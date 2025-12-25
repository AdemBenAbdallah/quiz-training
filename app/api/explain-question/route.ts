import { generateCacheKey } from "@/lib/explain-utils";
import { getCachedData, setCachedData } from "@/lib/redis-cache";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { explainSchema } from "./schemas";
import { rateLimitByIp, getRateLimitHeaders } from "@/lib/rate-limit";
import logger from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = await rateLimitByIp(ip, "explainQuestion");

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      );
    }

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
    // Generate cache key - options are already cleaned by frontend
    const cacheKey = generateCacheKey(question, options, answer);

    // Try to get cached response
    let cachedResponse = null;
    try {
      cachedResponse = await getCachedData(cacheKey);
      if (cachedResponse) {
        return NextResponse.json(cachedResponse);
      }
    } catch (error) {
      logger.error("Failed to get cached response:", error);
      // Continue with generation if cache fails
    }

    // Create a more direct prompt for structured output
    const answerLabels = ["A", "B", "C", "D", "E"];
    const prompt = `You are a helpful assistant for beginners. Given the following multiple-choice question, explain the question, each choice, and why the correct answer is correct in a beginner-friendly way. Also, provide a short actionable trick or tip for answering this type of question in the future.

Question: ${question}
Choices:
${options.map((opt: string, i: number) => `${answerLabels[i]}. ${opt}`).join("\n")}
Correct Answer: ${answer}`;

    const result = await generateObject({
      model: google("gemini-flash-latest"),
      schema: explainSchema,
      prompt,
    });

    const validated = result.object;

    // Cache the validated response
    // Store for 30 days (you can adjust this value)
    try {
      await setCachedData(cacheKey, validated);
    } catch (error) {
      logger.error("Failed to cache response:", error);
      // Continue even if caching fails
    }

    return NextResponse.json(validated);
  } catch (err: any) {
    logger.error("Error processing question:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 },
    );
  }
}
