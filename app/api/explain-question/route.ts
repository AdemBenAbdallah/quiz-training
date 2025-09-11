import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCachedData, setCachedData } from "@/lib/redis-cache";
import { explainSchema } from "./schemas";

function stripCodeBlock(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function generateCacheKey(
  question: string,
  options: string[],
  answer: ("A" | "B" | "C" | "D" | "E")[],
): string {
  // Create a unique key based on the question content
  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedOptions = options.map((opt) => opt.toLowerCase().trim());
  const normalizedAnswer = answer.join(",").toLowerCase().trim();

  // Create a hash of the question data
  return `explain:${Buffer.from(
    JSON.stringify({
      q: normalizedQuestion,
      o: normalizedOptions,
      a: normalizedAnswer,
    }),
  ).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      options,
      answer,
    }: {
      question: string;
      options: string[];
      answer: ("A" | "B" | "C" | "D" | "E")[];
    } = body;

    if (!question || !options || !answer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(question, options, answer);

    // Try to get cached response
    let cachedResponse = null;
    try {
      cachedResponse = await getCachedData(cacheKey);
      if (cachedResponse) {
        console.log("✨ Returning cached response for question:", question);
        return NextResponse.json(cachedResponse);
      }
    } catch (error) {
      console.error("Failed to get cached response:", error);
      // Continue with generation if cache fails
    }

    console.log("🔄 Generating new response for question:", question);
    const answerLabels = ["A", "B", "C", "D", "E"];
    const prompt = `You are a helpful assistant for beginners. Given the following multiple-choice question, explain the question, each choice, and why the correct answer is correct in a beginner-friendly way. Also, provide a short actionable trick or tip for answering this type of question in the future.\n\nQuestion: ${question}\nChoices:\n${options
      .map((opt: string, i: number) => `${answerLabels[i]}. ${opt}`)
      .join(
        "\n",
      )}\nCorrect Answer: ${answer}\n\nRespond in this JSON format:\n{ explanation: string, choices: Array<{ label: string, text: string, explanation: string }>, correctAnswer: string, correctExplanation: string, trick: string }`;

    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt,
    });

    const cleanText = stripCodeBlock(result.text);
    const parsed = JSON.parse(cleanText);

    const validated = explainSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 500 },
      );
    }

    // Cache the validated response
    // Store for 30 days (you can adjust this value)
    try {
      await setCachedData(cacheKey, parsed);
      console.log("✅ Cached new response for question:", question);
    } catch (error) {
      console.error("Failed to cache response:", error);
      // Continue even if caching fails
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Error processing question:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
