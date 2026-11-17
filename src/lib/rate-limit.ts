import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export type RateLimitPolicy = "login" | "otp" | "checkout" | "payment" | "tracking" | "contact" | "review";

type PolicyConfig = {
  limit: number;
  windowMs: number;
  window: `${number} ${"s" | "m" | "h"}`;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const policies: Record<RateLimitPolicy, PolicyConfig> = {
  login: { limit: 5, windowMs: 15 * 60 * 1000, window: "15 m" },
  otp: { limit: 3, windowMs: 10 * 60 * 1000, window: "10 m" },
  checkout: { limit: 5, windowMs: 10 * 60 * 1000, window: "10 m" },
  payment: { limit: 10, windowMs: 10 * 60 * 1000, window: "10 m" },
  tracking: { limit: 10, windowMs: 10 * 60 * 1000, window: "10 m" },
  contact: { limit: 5, windowMs: 60 * 60 * 1000, window: "1 h" },
  review: { limit: 5, windowMs: 60 * 60 * 1000, window: "1 h" }
};

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;

const distributedLimiters = redis
  ? Object.fromEntries(
      Object.entries(policies).map(([name, config]) => [
        name,
        new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(config.limit, config.window), prefix: `risjas:${name}` })
      ])
    ) as Record<RateLimitPolicy, Ratelimit>
  : null;

const memoryBuckets = new Map<string, { count: number; reset: number }>();

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export async function rateLimit(policy: RateLimitPolicy, identifier: string): Promise<RateLimitResult> {
  const config = policies[policy];
  const key = `${policy}:${identifier}`;

  if (distributedLimiters) {
    const result = await distributedLimiters[policy].limit(key);
    return { success: result.success, limit: result.limit, remaining: result.remaining, reset: result.reset };
  }

  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || bucket.reset <= now) {
    memoryBuckets.set(key, { count: 1, reset: now + config.windowMs });
    return { success: true, limit: config.limit, remaining: config.limit - 1, reset: now + config.windowMs };
  }

  bucket.count += 1;
  return { success: bucket.count <= config.limit, limit: config.limit, remaining: Math.max(0, config.limit - bucket.count), reset: bucket.reset };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
    "Retry-After": String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)))
  };
}

export function rateLimitResponse(result: RateLimitResult) {
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again later.", errors: {} },
    { status: 429, headers: rateLimitHeaders(result) }
  );
}
