import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import logger from "@/lib/logger";

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 3; // Max 3 messages per IP per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

// Content filtering patterns for security
const blockedPatterns = [
  /hack|exploit|malware|virus|phishing/i,
  /password|credential|token|api[_\s]?key/i,
  /system|server|admin|root/i,
  /eval|exec|shell|cmd/i,
];

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const clientData = rateLimitStore.get(ip);

  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize
    const resetTime = now + RATE_LIMIT_WINDOW;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetTime };
  }

  if (clientData.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: clientData.resetTime,
    };
  }

  // Increment counter
  clientData.count++;
  rateLimitStore.set(ip, clientData);

  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - clientData.count,
    resetTime: clientData.resetTime,
  };
}

// Cleanup old entries periodically
setInterval(
  () => {
    const now = Date.now();
    const ipsToDelete: string[] = [];

    rateLimitStore.forEach((data, ip) => {
      if (now > data.resetTime) {
        ipsToDelete.push(ip);
      }
    });

    ipsToDelete.forEach((ip) => {
      rateLimitStore.delete(ip);
    });
  },
  15 * 60 * 1000,
); // Cleanup every 15 minutes

const chatSchema = z.object({
  messages: z.array(z.any()).optional(),
  data: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimit = checkRateLimit(clientIP);

    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          message:
            "You've reached the maximum number of messages. Please sign up for unlimited access.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
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

    const response = result.toUIMessageStreamResponse();

    // Add CORS headers for better compatibility
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
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

// Handle GET requests for health check
export async function GET(req: NextRequest) {
  const clientIP = getClientIP(req);
  const rateLimit = checkRateLimit(clientIP);

  return new Response(
    JSON.stringify({
      status: "healthy",
      rateLimit: {
        allowed: rateLimit.allowed,
        remaining: rateLimit.remaining,
        max: RATE_LIMIT_MAX,
        windowMs: RATE_LIMIT_WINDOW,
      },
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
