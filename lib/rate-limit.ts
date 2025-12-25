import client from "@/lib/redis";

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export const RATE_LIMIT_CONFIGS = {
  chatLlm: {
    windowMs: 60000,
    maxRequests: 20,
    description: "20 requests per minute",
  },
  serviceInfo: {
    windowMs: 60000,
    maxRequests: 30,
    description: "30 requests per minute",
  },
  explainQuestion: {
    windowMs: 60000,
    maxRequests: 25,
    description: "25 requests per minute",
  },
  generalApi: {
    windowMs: 60000,
    maxRequests: 60,
    description: "60 requests per minute",
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMIT_CONFIGS;

function generateKey(
  identifier: string,
  type: RateLimitType,
): string {
  return `ratelimit:${type}:${identifier}`;
}

export async function rateLimit(
  identifier: string,
  type: RateLimitType = "generalApi",
): Promise<RateLimitResult & { message?: string }> {
  const config = RATE_LIMIT_CONFIGS[type];
  const key = generateKey(identifier, type);

  try {
    const currentCount = (await client.incr(key)) as number;
    const isNew = currentCount === 1;

    if (isNew) {
      await client.pExpire(key, config.windowMs);
    }

    const ttl = (await client.pTTL(key)) as number;
    const reset = Date.now() + ttl;
    const remaining = Math.max(0, config.maxRequests - currentCount);

    const success = remaining > 0;

    return {
      success,
      limit: config.maxRequests,
      remaining,
      reset,
      message: success
        ? undefined
        : `Rate limit exceeded. ${config.description}. Please try again in ${Math.ceil(ttl / 1000)} seconds.`,
    };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: Date.now() + config.windowMs,
    };
  }
}

export function getRateLimitHeaders(
  result: Omit<RateLimitResult, "success">,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.reset.toString(),
  };
}

export async function rateLimitByIp(
  ip: string,
  type: RateLimitType = "generalApi",
): Promise<RateLimitResult & { message?: string }> {
  return rateLimit(ip, type);
}

export async function rateLimitByUser(
  userId: string,
  type: RateLimitType = "generalApi",
): Promise<RateLimitResult & { message?: string }> {
  return rateLimit(`user:${userId}`, type);
}
