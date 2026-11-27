import "server-only";

// Shared, durable rate limiter for the public API routes.
//
// Backed by Upstash Redis when configured, so a limit holds across every
// serverless instance and survives cold starts (unlike a per-instance Map,
// which resets constantly and is effectively no limit at all on serverless).
// Falls back to an in-memory counter for local dev and tests, mirroring the
// pattern in src/app/api/payment-request-uri/shorten/store.ts.
//
// Two primitives:
//   rateLimit()            — per-caller fixed-window request limit (fail-OPEN on
//                            backend error, so a Redis blip cannot take the site
//                            down; the daily budget below is the real backstop).
//   tryConsumeDailyBudget() — a durable global per-day counter used to cap the
//                            number of paid/expensive operations (e.g. OpenAI
//                            calls) regardless of how a caller spoofs their IP.
//                            Fail-CLOSED on backend error, so we never spend on a
//                            paid API when we cannot account for the spend.

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfterMs: number;
};

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

type RedisLike = {
  incr: (key: string) => Promise<number>;
  pexpire: (key: string, ms: number) => Promise<unknown>;
};

let redisPromise: Promise<RedisLike | null> | undefined;

async function getRedis(): Promise<RedisLike | null> {
  if (!hasRedisEnv()) return null;
  if (!redisPromise) {
    redisPromise = import("@upstash/redis")
      .then(({ Redis }) => Redis.fromEnv() as unknown as RedisLike)
      .catch((err) => {
        console.error("[rateLimit] Upstash Redis init failed:", err);
        return null;
      });
  }
  return redisPromise;
}

// In-memory fallback: a fixed-window counter per key. Shared by both primitives.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 50_000;

function memoryConsume(
  key: string,
  limit: number,
  windowMs: number,
  now: number,
): RateLimitResult {
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) {
      // Drop the oldest-inserted key to bound memory under a flood of fresh keys.
      const oldest = buckets.keys().next().value;
      if (oldest !== undefined) buckets.delete(oldest);
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, limit, retryAfterMs: 0 };
  }
  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, limit, retryAfterMs: existing.resetAt - now };
  }
  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, limit, retryAfterMs: 0 };
}

/**
 * Per-caller fixed-window limit. `windowSeconds` is the window length and
 * `limit` the number of requests allowed within it. Fails open if the Redis
 * backend errors.
 */
export async function rateLimit(opts: {
  key: string;
  limit: number;
  windowSeconds: number;
}): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = opts;
  const windowMs = windowSeconds * 1000;
  const now = Date.now();

  const redis = await getRedis();
  if (!redis) return memoryConsume(key, limit, windowMs, now);

  const windowId = Math.floor(now / windowMs);
  const redisKey = `rl:${key}:${windowId}`;
  try {
    const count = await redis.incr(redisKey);
    if (count === 1) await redis.pexpire(redisKey, windowMs);
    if (count > limit) {
      const resetAt = (windowId + 1) * windowMs;
      return { allowed: false, remaining: 0, limit, retryAfterMs: Math.max(0, resetAt - now) };
    }
    return { allowed: true, remaining: Math.max(0, limit - count), limit, retryAfterMs: 0 };
  } catch (err) {
    console.error("[rateLimit] backend error, allowing request:", err);
    return { allowed: true, remaining: limit, limit, retryAfterMs: 0 };
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Consumes one unit of a durable, global, per-UTC-day budget and returns true
 * while the budget is not yet exhausted. Used to cap expensive/paid operations
 * across the whole deployment. Fails CLOSED (returns false) if the Redis backend
 * errors, so a backend outage never results in unbounded paid-API spend.
 */
export async function tryConsumeDailyBudget(name: string, limit: number): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  const key = `budget:${name}:${day}`;
  const now = Date.now();

  const redis = await getRedis();
  if (!redis) return memoryConsume(key, limit, DAY_MS, now).allowed;

  try {
    const count = await redis.incr(key);
    // Expire a little past midnight so the counter is reclaimed after the day ends.
    if (count === 1) await redis.pexpire(key, DAY_MS + 60 * 60 * 1000);
    return count <= limit;
  } catch (err) {
    console.error("[rateLimit] budget backend error, denying spend:", err);
    return false;
  }
}

/** Test-only: clears the in-memory fallback counters. */
export function __clearRateLimitMemory(): void {
  buckets.clear();
}
