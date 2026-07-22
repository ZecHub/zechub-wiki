import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for CoinGecko's simple/price endpoint. Keeps the API key
// server-side (out of the browser) and stops the visitor's browser from
// contacting api.coingecko.com directly (which leaked "this browser is on a
// Zcash tool/page now" to CoinGecko, including a 60s beacon). The upstream call
// is cached so we make at most ~1 request/minute globally.
const CG_BASE = "https://api.coingecko.com/api/v3/simple/price";

const ALLOWED_PARAMS = new Set([
  "ids",
  "names",
  "vs_currencies",
  "include_market_cap",
  "include_24hr_vol",
  "include_24hr_change",
]);

const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

export async function GET(req: NextRequest) {
  const out = new URLSearchParams();
  for (const [key, value] of req.nextUrl.searchParams) {
    if (ALLOWED_PARAMS.has(key)) out.set(key, value);
  }
  if (!out.has("vs_currencies")) out.set("vs_currencies", "usd");
  if (!out.has("ids") && !out.has("names")) {
    return NextResponse.json({ error: "missing ids or names" }, { status: 400 });
  }

  const headers: Record<string, string> = { accept: "application/json" };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) headers["x-cg-demo-api-key"] = apiKey;

  try {
    const upstream = await fetch(`${CG_BASE}?${out.toString()}`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 },
      );
    }
    const data = await upstream.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 502 });
  }
}
