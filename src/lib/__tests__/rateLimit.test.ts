import {
  rateLimit,
  tryConsumeDailyBudget,
  __clearRateLimitMemory,
} from "@/lib/rateLimit";

// These tests exercise the in-memory fallback path (no UPSTASH_* env set), which
// is the behaviour used in local dev and CI. The Redis-backed path mirrors it.
describe("rateLimit (in-memory fallback)", () => {
  beforeEach(() => {
    __clearRateLimitMemory();
  });

  it("allows up to the limit then blocks within the window", async () => {
    const opts = { key: "k1", limit: 3, windowSeconds: 60 };
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await rateLimit(opts));

    expect(results.map((r) => r.allowed)).toEqual([true, true, true, false]);
    expect(results[3].retryAfterMs).toBeGreaterThan(0);
    expect(results[3].remaining).toBe(0);
  });

  it("tracks separate keys independently", async () => {
    const a = await rateLimit({ key: "a", limit: 1, windowSeconds: 60 });
    const b = await rateLimit({ key: "b", limit: 1, windowSeconds: 60 });
    const aAgain = await rateLimit({ key: "a", limit: 1, windowSeconds: 60 });

    expect(a.allowed).toBe(true);
    expect(b.allowed).toBe(true);
    expect(aAgain.allowed).toBe(false);
  });

  it("resets after the window elapses", async () => {
    const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000);
    try {
      const opts = { key: "win", limit: 1, windowSeconds: 1 };
      expect((await rateLimit(opts)).allowed).toBe(true);
      expect((await rateLimit(opts)).allowed).toBe(false);
      now.mockReturnValue(1_000_000 + 2_000); // past the 1s window
      expect((await rateLimit(opts)).allowed).toBe(true);
    } finally {
      now.mockRestore();
    }
  });
});

describe("tryConsumeDailyBudget (in-memory fallback)", () => {
  beforeEach(() => {
    __clearRateLimitMemory();
  });

  it("allows up to the budget then denies", async () => {
    const consume = () => tryConsumeDailyBudget("test-budget", 2);
    expect(await consume()).toBe(true);
    expect(await consume()).toBe(true);
    expect(await consume()).toBe(false);
    expect(await consume()).toBe(false);
  });
});
