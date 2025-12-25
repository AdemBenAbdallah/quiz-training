import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import { rateLimitByIp, getRateLimitHeaders } from "@/lib/rate-limit";
import logger from "@/lib/logger";

const chatSchema = z.object({
  messages: z.array(z.any()).optional(),
  data: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = await rateLimitByIp(ip, "chatLlm");

    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({
          error: rateLimitResult.message,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...getRateLimitHeaders(rateLimitResult),
          },
        },
      );
    }

    const body = await req.json();

    const { messages } = chatSchema.parse(body);

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const uiMessages: UIMessage[] = messages as UIMessage[];

    const prompt = `You are a helpful AI assistant for students learning through quiz questions. Be friendly, encouraging, and explain things in a beginner-friendly way.

Please provide a helpful, educational response that:
1. Directly addresses the user's question
2. Uses simple, clear language
3. Is encouraging and supportive
4. References the specific question when relevant
5. Is concise but informative (2-4 sentences usually)

Keep the response conversational and helpful for a beginner.`;

    const result = streamText({
      model: google("gemini-flash-latest"),
      system: prompt,
      messages: convertToModelMessages(uiMessages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    logger.error("Error processing chat request:", err);

    if (err instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: err.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
