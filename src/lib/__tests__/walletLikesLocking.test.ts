/**
 * @jest-environment node
 */
// The vote path reads (already voted? votes today? likes so far?) and then
// writes based on what it read. Concurrent votes for one wallet used to pass
// those reads together: the daily cap was exceeded, a reviewer counted twice,
// and a wallet's first likes landed in separate rows. The handler now takes a
// per-title advisory lock inside its transaction before any of those reads.
// A real-PostgreSQL race harness verified the behaviour; this pins the order.

// The handler is plain JS (allowJs is off), so it is required rather than imported.
type Handler = (req: unknown, res: unknown) => Promise<void>;
const handler: Handler = require("@/pages/api/wallet-likes").default;

const queries: { text: string; values?: unknown[] }[] = [];
const results: Record<string, { rows: unknown[] }> = {};

jest.mock("pg", () => ({
  Client: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(async (text: string, values?: unknown[]) => {
      queries.push({ text, values });
      const key = Object.keys(results).find((k) => text.includes(k));
      return key ? results[key] : { rows: [] };
    }),
  })),
}));

const vote = (title: string, ip = "10.0.0.1") =>
  new Promise<{ code: number; body: unknown }>((done) => {
    const res = {
      statusCode: 200,
      status(c: number) {
        this.statusCode = c;
        return this;
      },
      json(body: unknown) {
        done({ code: this.statusCode, body });
        return this;
      },
      setHeader() {},
    };
    handler(
      { method: "POST", body: { title, delta: 1 }, headers: { "x-forwarded-for": ip }, connection: {} },
      res,
    );
  });

const index = (fragment: string) => queries.findIndex((q) => q.text.includes(fragment));

beforeEach(() => {
  queries.length = 0;
  for (const k of Object.keys(results)) delete results[k];
});

describe("wallet-likes vote path", () => {
  it("locks the title inside the transaction before any read it acts on", async () => {
    results["SELECT EXISTS"] = { rows: [{ exists: false }] };
    const r = await vote("Zashi");

    expect(r.code).toBe(200);
    const begin = index("BEGIN");
    const lock = index("pg_advisory_xact_lock");
    expect(begin).toBeGreaterThanOrEqual(0);
    expect(lock).toBeGreaterThan(begin);
    for (const read of ["SELECT EXISTS", "SELECT votes", "SELECT likes"]) {
      expect(index(read)).toBeGreaterThan(lock);
    }
    expect(index("COMMIT")).toBeGreaterThan(index("INSERT INTO wallet_likes_proofs"));
  });

  it("releases the lock by rolling back when the reviewer already voted", async () => {
    results["SELECT EXISTS"] = { rows: [{ exists: true }] };
    const r = await vote("Zashi");

    expect(r.code).toBe(429);
    expect(index("ROLLBACK")).toBeGreaterThan(index("SELECT EXISTS"));
    expect(index("COMMIT")).toBe(-1);
  });

  it("uses one lock key per title", async () => {
    results["SELECT EXISTS"] = { rows: [{ exists: false }] };
    const keyFor = async (title: string) => {
      queries.length = 0;
      await vote(title);
      return queries[index("pg_advisory_xact_lock")].values?.[1];
    };

    const a1 = await keyFor("Zashi");
    const a2 = await keyFor("Zashi");
    const b = await keyFor("Ywallet");
    expect(a1).toBe(a2);
    expect(a1).not.toBe(b);
    expect(queries[index("pg_advisory_xact_lock")].values?.[0]).toBe(0x5aec1115);
    // A signed 32-bit integer, as pg_advisory_xact_lock(int, int) takes.
    const key = BigInt(a1 as string);
    expect(key >= BigInt("-2147483648")).toBe(true);
    expect(key <= BigInt("2147483647")).toBe(true);
  });

  it("checks the daily cap after the lock and rolls it back", async () => {
    results["SELECT EXISTS"] = { rows: [{ exists: false }] };
    results["SELECT votes"] = { rows: [{ votes: 5 }] };
    const r = await vote("Zashi");

    expect(r.code).toBe(429);
    expect(index("SELECT votes")).toBeGreaterThan(index("pg_advisory_xact_lock"));
    expect(index("ROLLBACK")).toBeGreaterThan(index("SELECT votes"));
    expect(index("COMMIT")).toBe(-1);
  });
});
