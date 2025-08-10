import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCachedData, setCachedData } from "@/lib/redis-cache";
import { serviceInfoSchema } from "./schemas";

function stripCodeBlock(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function generateCacheKey(question: string, options: string[]): string {
  // Create a unique key based on the question content
  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedOptions = options.map((opt) => opt.toLowerCase().trim());

  // Create a hash of the question data
  return `service:${Buffer.from(
    JSON.stringify({
      q: normalizedQuestion,
      o: normalizedOptions,
    }),
  ).toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      options,
    }: {
      question: string;
      options: string[];
    } = body;

    if (!question || !options) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Generate cache key
    const cacheKey = generateCacheKey(question, options);

    // Try to get cached response
    let cachedResponse = null;
    try {
      cachedResponse = await getCachedData(cacheKey);
      if (cachedResponse) {
        console.log("✨ Returning cached service info for question:", question);
        return NextResponse.json(cachedResponse);
      }
    } catch (error) {
      console.error("Failed to get cached service info:", error);
      // Continue with generation if cache fails
    }

    console.log("🔄 Generating new service info for question:", question);
    const answerLabels = ["A", "B", "C", "D", "E"];
    const prompt = `You are an AWS expert assistant. Given the following AWS certification exam question, identify the primary AWS service being discussed and provide comprehensive information about it.

Question: ${question}
Choices:
${options
  .map((opt: string, i: number) => `${answerLabels[i]}. ${opt}`)
  .join("\\n")}

Analyze the question and identify the main AWS service being discussed. Then provide:
1. The service name
2. A clear, beginner-friendly description of what the service does
3. A very small, concise description of the overall service (1-2 sentences)
4. Key features of the service (3-5 important features)
5. Common use cases (2-4 practical scenarios)
6. For each choice, provide a very small, concise description (1-2 sentences) of the service mentioned in the choice. If the choice is not an AWS service or is irrelevant, provide a description stating that it\'s not an AWS service or is irrelevant to the context.

Respond in this JSON format:
{
  "serviceName": "string",
  "serviceDescription": "string",
  "overallServiceSmallDescription": "string",
  "keyFeatures": ["string", "string", "string"],
  "useCases": ["string", "string"],
  "optionsWithSmallDescriptions": [
    {
      "optionLabel": "string",
      "optionText": "string",
      "optionDescription": "string"
    }
  ]
}`;

    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt,
    });

    console.log("Raw AI response:", result.text); // Log raw AI response
    const cleanText = stripCodeBlock(result.text);
    const parsed = JSON.parse(cleanText);

    const validated = serviceInfoSchema.safeParse(parsed);
    if (!validated.success) {
      console.error("AI response validation error:", validated.error);
      return NextResponse.json(
        {
          error: "AI response did not match expected format",
          details: validated.error.issues,
        },
        { status: 500 },
      );
    }

    // Cache the validated response
    // Store for 30 days (you can adjust this value)
    try {
      await setCachedData(cacheKey, parsed, 30);
      console.log("✅ Cached new service info for question:", question);
    } catch (error) {
      console.error("Failed to cache service info:", error);
      // Continue even if caching fails
    }

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error("❌ Error processing service info request:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
