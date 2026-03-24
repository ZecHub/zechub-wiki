import "server-only";

interface BucketEntry {
  count: number;
  windowStart: number;
}

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

// In-memory store — replace with Redis (e.g. Upstash) for multi-instance deployments.
const ipBuckets = new Map<string, BucketEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = ipBuckets.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipBuckets.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - entry.windowStart) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
