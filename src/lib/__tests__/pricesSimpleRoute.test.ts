/** @jest-environment node */
import { NextRequest } from "next/server";
import {
  ALLOWED_COINGECKO_NAMES,
  coingeckoNameFor,
} from "@/lib/chart/coingeckoNames";

function get(query: string) {
  return new NextRequest(`http://localhost/api/prices/simple?${query}`);
}

function mockUpstream() {
  const fetchMock = jest.fn(
    async (_input: RequestInfo | URL, _init?: RequestInit) =>
      new Response(JSON.stringify({ Zcash: { usd: 30 } }), { status: 200 }),
  );
  (global as unknown as { fetch: jest.Mock }).fetch = fetchMock;
  return fetchMock;
}

async function loadRoute() {
  return import("@/app/api/prices/simple/route");
}

// The exact query Metric.tsx sends for a chart coin.
function metricQuery(coin: string) {
  return (
    `vs_currencies=usd%2Cbtc&names=${encodeURIComponent(
      coingeckoNameFor(coin).toLowerCase(),
    )}` +
    "&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
  );
}

describe("/api/prices/simple", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("rejects a name the app never sends, without calling CoinGecko", async () => {
    const fetchMock = mockUpstream();
    const { GET } = await loadRoute();
    const res = await GET(get("names=not%20a%20coin%20abc123&vs_currencies=usd"));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not turn distinct junk names into upstream calls", async () => {
    const fetchMock = mockUpstream();
    const { GET } = await loadRoute();
    for (let i = 0; i < 50; i++) {
      await GET(get(`names=probe${i}&vs_currencies=usd`));
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["Atom", "Tia", "Osmo", "stOsmo", "stTia", "stAtom", "Um", "Ntrn", "Namada", "Penumbra", "Usdc"])(
    "accepts the query Metric.tsx sends for %s",
    async (coin) => {
      const fetchMock = mockUpstream();
      const { GET } = await loadRoute();
      const res = await GET(get(metricQuery(coin)));
      expect(res.status).toBe(200);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      const upstream = new URL(String(fetchMock.mock.calls[0][0]));
      expect(upstream.searchParams.get("names")).toBe(
        coingeckoNameFor(coin).toLowerCase(),
      );
    },
  );

  it("still serves the ids=zcash shapes the charts use", async () => {
    const fetchMock = mockUpstream();
    const { GET } = await loadRoute();
    const res = await GET(
      get("ids=zcash&vs_currencies=usd%2Cbtc&include_market_cap=true"),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ Zcash: { usd: 30 } });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats include_*=false like an absent flag (one cache key)", async () => {
    const fetchMock = mockUpstream();
    const { GET } = await loadRoute();
    await GET(get("ids=zcash&vs_currencies=usd"));
    await GET(get("ids=zcash&vs_currencies=usd&include_24hr_vol=false"));
    await GET(
      get(
        "ids=zcash&vs_currencies=usd&include_market_cap=false&include_24hr_change=false",
      ),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("keeps every valid shape memoised (cycling shapes cannot force misses)", async () => {
    const fetchMock = mockUpstream();
    const { GET } = await loadRoute();
    const shapes: string[] = [];
    for (const name of ALLOWED_COINGECKO_NAMES) {
      for (const vs of ["usd", "btc", "usd%2Cbtc"]) {
        shapes.push(`names=${encodeURIComponent(name)}&vs_currencies=${vs}`);
      }
    }
    expect(shapes.length).toBeGreaterThan(24);
    for (let round = 0; round < 2; round++) {
      for (const q of shapes) await GET(get(q));
    }
    expect(fetchMock).toHaveBeenCalledTimes(shapes.length);
  });

  it("keeps the allowed name list within the memo-cap arithmetic", () => {
    // route.ts sizes MEMO_MAX_KEYS for at most 15 names.
    expect(ALLOWED_COINGECKO_NAMES.size).toBeLessThanOrEqual(15);
    expect(coingeckoNameFor("Atom")).toBe("Cosmos Hub");
    expect(coingeckoNameFor("Usdc")).toBe("Usdc");
  });
});
