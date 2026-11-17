import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export type RateLimitPolicy = "loginIp" | "loginAccount" | "otp" | "checkout" | "payment" | "tracking" | "contact" | "review" | "public" | "user";

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

const envNumber = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
};
const envWindow = (name: string, fallback: PolicyConfig["window"]) =>
  /^\d+ (s|m|h)$/.test(process.env[name] || "") ? process.env[name] as PolicyConfig["window"] : fallback;
const windowMs = (window: PolicyConfig["window"]) => {
  const [n, unit] = window.split(" ");
  return Number(n) * (unit === "h" ? 3600000 : unit === "m" ? 60000 : 1000);
};
const makePolicy = (name: string, limit: number, fallbackWindow: PolicyConfig["window"]): PolicyConfig => {
  const window = envWindow(`RATE_LIMIT_${name.toUpperCase()}_WINDOW`, fallbackWindow);
  return { limit: envNumber(`RATE_LIMIT_${name.toUpperCase()}_LIMIT`, limit), window, windowMs: windowMs(window) };
};

const policies: Record<RateLimitPolicy, PolicyConfig> = {
  loginIp: makePolicy("login_ip", 10, "15 m"), loginAccount: makePolicy("login_account", 5, "15 m"),
  otp: makePolicy("otp", 3, "10 m"), checkout: makePolicy("checkout", 5, "10 m"),
  payment: makePolicy("payment", 10, "10 m"), tracking: makePolicy("tracking", 10, "10 m"),
  contact: makePolicy("contact", 5, "1 h"), review: makePolicy("review", 5, "1 h"),
  public: makePolicy("public", 120, "1 m"), user: makePolicy("user", 300, "1 m")
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
const authBackoff = new Map<string, { failures: number; nextAllowed: number }>();
const backoffBaseMs = Number(process.env.AUTH_BACKOFF_BASE_MS || 500);
const backoffMaxMs = Number(process.env.AUTH_BACKOFF_MAX_MS || 60000);

export async function waitForAuthBackoff(identifier: string) {
  const entry = authBackoff.get(identifier);
  const delay = entry ? entry.nextAllowed - Date.now() : 0;
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
}

export function recordAuthFailure(identifier: string) {
  const previous = authBackoff.get(identifier);
  const failures = (previous?.failures || 0) + 1;
  authBackoff.set(identifier, { failures, nextAllowed: Date.now() + Math.min(backoffMaxMs, backoffBaseMs * 2 ** (failures - 1)) });
}

export function clearAuthFailures(identifier: string) {
  authBackoff.delete(identifier);
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

export async function rateLimit(policy: RateLimitPolicy, identifier: string): Promise<RateLimitResult> {
  const config = policies[policy];
  const key = `${policy}:${identifier}`;

  if (distributedLimiters) {
    try {
      const result = await distributedLimiters[policy].limit(key);
      return { success: result.success, limit: result.limit, remaining: result.remaining, reset: result.reset };
    } catch (error) {
      console.error("[rate-limit] distributed store unavailable", error);
      const failClosed = process.env.RATE_LIMIT_FAIL_CLOSED !== "false";
      if (failClosed) return { success: false, limit: config.limit, remaining: 0, reset: Date.now() + 30_000 };
    }
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
