import { CANISHIELD_ORIGIN, SLUG_RE, parseRecord, parseServiceList, shortDay } from "../canishield";

// Shaped like the live https://canishield.vercel.app/api/services/binance reply (15 Nov 2026).
const binance = {
  format: "canishield-service/1",
  service: { slug: "binance", name: "Binance" },
  url: "https://canishield.vercel.app/services/binance",
  reportUrl: "https://canishield.vercel.app/report/outcome?service=bfa3ff1e-ac83-4271-8452-49f0e05b5761",
  deposit: { result: "credited", label: "Credited", addressType: "tex", to: "a TEX", date: "2026-11-07", creditMinutes: 10, credit: "about 10 min", ok: true },
  outcomes: {
    total: 2,
    counts: { rejected: 2 },
    latest: { result: "rejected", label: "Refused", weekOf: "2026-09-14", week: "week of 14 Sep 2026" },
    trouble: 2,
  },
};

describe("parseRecord", () => {
  it("keeps only the fields the tool shows", () => {
    expect(parseRecord(binance, "binance")).toEqual({
      service: "binance",
      name: "Binance",
      url: `${CANISHIELD_ORIGIN}/services/binance`,
      reportUrl: "https://canishield.vercel.app/report/outcome?service=bfa3ff1e-ac83-4271-8452-49f0e05b5761",
      deposit: { label: "Credited", ok: true, to: "a TEX", date: "2026-11-07", credit: "about 10 min" },
      outcomes: { total: 2, trouble: 2, latest: { label: "Refused", tone: "bad", week: "week of 14 Sep 2026" } },
    });
  });

  it("builds the link itself instead of trusting the payload", () => {
    const hostile = { ...binance, url: "javascript:alert(1)" };
    expect(parseRecord(hostile, "binance")?.url).toBe(`${CANISHIELD_ORIGIN}/services/binance`);
  });

  it("keeps the report link only in Can I Shield's exact shape", () => {
    for (const reportUrl of [
      "javascript:alert(1)",
      "https://evil.example/report/outcome?service=bfa3ff1e-ac83-4271-8452-49f0e05b5761",
      "https://canishield.vercel.app/report/outcome?service=x&next=https://evil.example",
      "https://canishield.vercel.app.evil.example/report/outcome?service=bfa3ff1e-ac83-4271-8452-49f0e05b5761",
      null,
    ]) {
      expect(parseRecord({ ...binance, reportUrl }, "binance")?.reportUrl).toBeNull();
    }
  });

  it("refuses a payload for another service or another format", () => {
    expect(parseRecord(binance, "kraken")).toBeNull();
    expect(parseRecord({ ...binance, format: "other/1" }, "binance")).toBeNull();
    expect(parseRecord(null, "binance")).toBeNull();
    expect(parseRecord("<html>", "binance")).toBeNull();
  });

  it("drops a malformed deposit or report instead of showing half of it", () => {
    const r = parseRecord(
      { ...binance, deposit: { ...binance.deposit, date: "7 Nov" }, outcomes: { total: -4, trouble: "x", latest: { result: "stolen", label: "Refused", week: "w" } } },
      "binance",
    );
    expect(r?.deposit).toBeNull();
    expect(r?.outcomes).toEqual({ total: 0, trouble: 0, latest: null });
  });

  it("shows no credit time for a deposit that was not credited", () => {
    const r = parseRecord({ ...binance, deposit: { ...binance.deposit, ok: false, label: "Held for review", credit: "about 10 min" } }, "binance");
    expect(r?.deposit).toMatchObject({ ok: false, credit: null });
  });
});

describe("parseServiceList", () => {
  it("lists exchanges and swaps only, those with a record first, each group by name", () => {
    const list = parseServiceList({
      services: [
        { slug: "zingo", name: "Zingo", kind: "wallet" },
        { slug: "kraken", name: "Kraken", kind: "exchange" },
        { slug: "near-intents", name: "NEAR Intents", kind: "swap", outcomes: { total: 1 } },
        { slug: "binance", name: "Binance", kind: "exchange", outcomes: { total: 2 } },
        { slug: "coinbase", name: "Coinbase", kind: "exchange" },
        { slug: "okx", name: "OKX", kind: "exchange" },
        { slug: "Bad Slug!", name: "Bad", kind: "exchange" },
        { slug: "ledger", name: "Ledger", kind: "hardware" },
      ],
      depositChecks: [{ service: "okx" }],
    });
    expect(list.map((s) => [s.slug, s.hasRecord])).toEqual([
      ["binance", true],
      ["near-intents", true],
      ["okx", true],
      ["coinbase", false],
      ["kraken", false],
    ]);
  });

  it("returns nothing for an unexpected payload", () => {
    expect(parseServiceList(null)).toEqual([]);
    expect(parseServiceList({ services: "x" })).toEqual([]);
  });
});

describe("helpers", () => {
  it("accepts only plain slugs", () => {
    expect(SLUG_RE.test("near-intents")).toBe(true);
    for (const bad of ["../etc", "a/b", "", "UPPER", "a".repeat(65), "x?y=1"]) expect(SLUG_RE.test(bad)).toBe(false);
  });

  it("formats a day", () => {
    expect(shortDay("2026-11-07")).toBe("7 Nov 2026");
  });
});
