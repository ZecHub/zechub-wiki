/**
 * @jest-environment node
 */
// /api/wallet-likes stored a vote for any `title` string and returned every
// stored title to every /wallets visitor. Production holds probe rows ("",
// "xff-test", a 200-char "SECURITY-AUDIT-LEN200-BBB…"). Votes are now limited
// to the wallets listed in site/Using_Zcash/Wallets.md, checked before any
// database work, and the tally read drops unlisted rows.

type Handler = (req: unknown, res: unknown) => Promise<void>;

const queries: string[] = [];
let tallyRows: { title: string; likes: number }[] = [];
const clients = { created: 0 };

jest.mock("pg", () => ({
  Client: jest.fn().mockImplementation(() => {
    clients.created += 1;
    return {
      connect: jest.fn(),
      end: jest.fn(),
      query: jest.fn(async (text: string) => {
        queries.push(text);
        if (text.startsWith("SELECT title, likes")) return { rows: tallyRows };
        if (text.includes("SELECT EXISTS")) return { rows: [{ exists: false }] };
        return { rows: [] };
      }),
    };
  }),
}));

const listed = { titles: new Set(["ZODL", "Zingo!", "Zend:Zcash Wallet"]) as Set<string> | null };
jest.mock("@/lib/walletTitles", () => ({
  MAX_WALLET_TITLE_LENGTH: 100,
  getKnownWalletTitles: jest.fn(async () => listed.titles),
}));

const handler: Handler = require("@/pages/api/wallet-likes").default;
const { getKnownWalletTitles } = require("@/lib/walletTitles");

const call = (title: unknown, delta: unknown) =>
  new Promise<{ code: number; body: any }>((done) => {
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
      { method: "POST", body: { title, delta }, headers: { "x-forwarded-for": "10.0.0.9" }, connection: {} },
      res,
    );
  });

beforeEach(() => {
  // Without a database URL the handler reports ratings as unavailable.
  process.env.POSTGRES_URL = "postgres://test";
  queries.length = 0;
  tallyRows = [];
  clients.created = 0;
  listed.titles = new Set(["ZODL", "Zingo!", "Zend:Zcash Wallet"]);
  (getKnownWalletTitles as jest.Mock).mockClear();
});

describe("wallet-likes title allow-list", () => {
  it("rejects a vote for a title that /wallets does not list, before touching the database", async () => {
    for (const title of ["SECURITY-AUDIT-BURST-1-7787", "xff-test", "zodl", "ZODL "]) {
      const r = await call(title, 1);
      expect(r.code).toBe(400);
    }
    expect(clients.created).toBe(0);
    expect(queries).toEqual([]);
  });

  it("rejects an empty or oversized title without reading the allow-list", async () => {
    expect((await call("", 1)).code).toBe(400);
    expect((await call("B".repeat(101), -1)).code).toBe(400);
    expect((await call("B".repeat(500_000), 1)).code).toBe(400);
    expect(getKnownWalletTitles).not.toHaveBeenCalled();
    expect(clients.created).toBe(0);
  });

  it("fails closed with 503 when the wallet list has never been read", async () => {
    listed.titles = null;
    const r = await call("ZODL", 1);
    expect(r.code).toBe(503);
    expect(clients.created).toBe(0);
  });

  it("still records a vote for a listed wallet, in the locked transaction", async () => {
    const r = await call("Zend:Zcash Wallet", 1);
    expect(r.code).toBe(200);
    expect(r.body.likes).toBe(1);
    expect(queries.some((q) => q.includes("pg_advisory_xact_lock"))).toBe(true);
    expect(queries.some((q) => q.includes("INSERT INTO wallet_likes_proofs"))).toBe(true);
    expect(queries[queries.length - 1]).toBe("COMMIT");
  });

  it("drops unlisted rows from the tally the page reads", async () => {
    tallyRows = [
      { title: "ZODL", likes: 7 },
      { title: "", likes: 1 },
      { title: "SECURITY-AUDIT-LEN200-" + "B".repeat(178), likes: 1 },
      { title: "Zingo!", likes: 3 },
      { title: "pentesk-probe", likes: -1 },
    ];
    const r = await call("", 0);
    expect(r.code).toBe(200);
    expect(r.body).toEqual({ ZODL: 7, "Zingo!": 3 });
  });

  it("returns the tally unfiltered when the wallet list can't be read", async () => {
    listed.titles = null;
    tallyRows = [
      { title: "ZODL", likes: 7 },
      { title: "xff-test", likes: 1 },
    ];
    const r = await call("", 0);
    expect(r.code).toBe(200);
    expect(r.body).toEqual({ ZODL: 7, "xff-test": 1 });
  });
});
