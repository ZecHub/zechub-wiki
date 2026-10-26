import { randomBytes } from "crypto";

// Short links expire after 7 days. Payment requests are short-lived, so a
// week is generous while still letting storage reclaim stale entries.
export const SHORT_LINK_TTL_SECONDS = 60 * 60 * 24 * 7;

// Cap for the in-memory fallback store only. The persistent backend enforces
// its own eviction via per-key TTL.
export const MAX_STORE_ENTRIES = 10_000;

const KEY_PREFIX = "zpay:short:";

/**
 * Generates an opaque, URL-safe short id. 8 base64url characters encode 6
 * random bytes (~2.8e14 values), keeping collisions negligible at this scale.
 */
export function generateShortId(): string {
  return randomBytes(6).toString("base64url");
}

type RedisLike = {
  set: (
    key: string,
    value: string,
    opts: { ex: number },
  ) => Promise<unknown>;
  get: (key: string) => Promise<unknown>;
};

let redisPromise: Promise<RedisLike | null> | undefined;

function hasRedisEnv(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

/**
 * Lazily constructs an Upstash Redis client from the environment. Returns null
 * when the credentials are absent (local dev, tests), signalling callers to
 * use the in-memory fallback. The import is dynamic so the dependency is only
 * loaded when it is actually configured.
 */
async function getRedis(): Promise<RedisLike | null> {
  if (!hasRedisEnv()) return null;
  if (!redisPromise) {
    redisPromise = import("@upstash/redis")
      .then(({ Redis }) => Redis.fromEnv() as unknown as RedisLike)
      .catch((err) => {
        console.error("[shorten] Upstash Redis init failed:", err);
        return null;
      });
  }
  return redisPromise;
}

type MemoryEntry = { uri: string; expiresAt: number };

// Fallback store for environments without Upstash configured. Entries carry an
// absolute expiry so the fallback honours the same TTL semantics as Redis.
const memoryStore = new Map<string, MemoryEntry>();

function pruneExpired(now: number) {
  for (const [key, entry] of memoryStore) {
    if (entry.expiresAt <= now) memoryStore.delete(key);
  }
}

/**
 * Persists a short id -> URI mapping with a TTL. Uses Upstash Redis when
 * configured, otherwise a capped, TTL-aware in-memory map.
 */
export async function storeUri(shortId: string, uri: string): Promise<void> {
  const redis = await getRedis();
  if (redis) {
    await redis.set(KEY_PREFIX + shortId, uri, {
      ex: SHORT_LINK_TTL_SECONDS,
    });
    return;
  }

  const now = Date.now();
  pruneExpired(now);
  if (memoryStore.size >= MAX_STORE_ENTRIES) {
    const oldestKey = memoryStore.keys().next().value;
    if (oldestKey !== undefined) memoryStore.delete(oldestKey);
  }
  memoryStore.set(shortId, {
    uri,
    expiresAt: now + SHORT_LINK_TTL_SECONDS * 1000,
  });
}

/**
 * Resolves a short id back to its stored URI, or null when unknown or expired.
 */
export async function resolveUri(shortId: string): Promise<string | null> {
  const redis = await getRedis();
  if (redis) {
    const value = await redis.get(KEY_PREFIX + shortId);
    return typeof value === "string" ? value : null;
  }

  const entry = memoryStore.get(shortId);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    memoryStore.delete(shortId);
    return null;
  }
  return entry.uri;
}

/** Test-only: resets the in-memory fallback store. */
export function __clearMemoryStore(): void {
  memoryStore.clear();
}

/** Test-only: current size of the in-memory fallback store. */
export function __memoryStoreSize(): number {
  return memoryStore.size;
}
