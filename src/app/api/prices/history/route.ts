import { NextRequest, NextResponse } from "next/server";

const CG_BASE = "https://api.coingecko.com/api/v3/coins/zcash/market_chart";
const ALLOWED_DAYS = new Set(["7", "30"]);
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=900";
const MEMO_TTL_MS = 300_000;

type Entry = { at: number; data: unknown };
const memo = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

function bad(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const days = req.nextUrl.searchParams.get("days") ?? "7";
  if (!ALLOWED_DAYS.has(days)) return bad("invalid days");

  const now = Date.now();
  const cached = memo.get(days);
  if (cached && now - cached.at < MEMO_TTL_MS) {
    return NextResponse.json(cached.data, { headers: { "Cache-Control": CACHE_CONTROL } });
  }

  const fetchOnce = async () => {
    const headers: Record<string, string> = { accept: "application/json" };
    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
    const upstream = await fetch(`${CG_BASE}?vs_currency=usd&days=${days}&interval=daily`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    return upstream.json();
  };

  try {
    let request = inflight.get(days);
    if (!request) {
      request = fetchOnce().finally(() => inflight.delete(days));
      inflight.set(days, request);
    }
    const data = await request;
    memo.set(days, { at: Date.now(), data });
    return NextResponse.json(data, { headers: { "Cache-Control": CACHE_CONTROL } });
  } catch {
    if (cached) {
      return NextResponse.json(cached.data, { headers: { "Cache-Control": "public, s-maxage=60" } });
    }
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}
