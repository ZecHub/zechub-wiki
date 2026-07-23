import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for CoinGecko's simple/price endpoint. Keeps the API key
// server-side (out of the browser) and stops the visitor's browser from
// contacting api.coingecko.com directly (which leaked "this browser is on a
// Zcash tool/page now" to CoinGecko).
//
// Hardened against cache-busting fan-out (an attacker varying query strings to
// force many distinct upstream calls and burn the CoinGecko key/rate limit):
//   - VALUE allow-lists, not just param names: ids is locked to the coins the
//     app actually queries (only `zcash`); vs_currencies to usd/btc; booleans
//     to true/false; free-form `names` is length/charset-bounded.
//   - A process-local memo keyed by the CANONICAL query (params sorted) with a
//     60s TTL, an in-flight promise per key to coalesce concurrent misses, a
//     hard key cap as a backstop, and last-good served on upstream failure.
const CG_BASE = "https://api.coingecko.com/api/v3/simple/price";
const ALLOWED_IDS = new Set(["zcash"]); // the only coin queried by id in-app
const ALLOWED_VS = new Set(["usd", "btc"]);
const BOOL = new Set(["true", "false"]);
const BOOL_PARAMS = [
  "include_market_cap",
  "include_24hr_vol",
  "include_24hr_change",
];
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";
const MEMO_TTL_MS = 60_000;
const MEMO_MAX_KEYS = 24; // backstop; legit app usage is a handful of shapes

type Entry = { at: number; data: unknown };
const memo = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

function csv(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function bad(msg: string) {
  return NextResponse.json({ error: msg }, { status: 400 });
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const out = new URLSearchParams();

  const idsRaw = sp.get("ids");
  if (idsRaw != null) {
    const ids = [...new Set(csv(idsRaw))];
    if (!ids.length || ids.some((id) => !ALLOWED_IDS.has(id)))
      return bad("invalid ids");
    out.set("ids", ids.sort().join(","));
  }

  const namesRaw = sp.get("names");
  if (namesRaw != null) {
    const names = namesRaw.trim().toLowerCase();
    // one/few coin names — bounded length + safe charset (letters/digits/space/.,-)
    if (!names || names.length > 80 || !/^[a-z0-9 ,.\-]+$/.test(names))
      return bad("invalid names");
    out.set("names", names);
  }

  const vsRaw = sp.get("vs_currencies");
  if (vsRaw != null) {
    const vs = [...new Set(csv(vsRaw))];
    if (!vs.length || vs.some((c) => !ALLOWED_VS.has(c)))
      return bad("invalid vs_currencies");
    out.set("vs_currencies", vs.sort().join(","));
  }

  for (const key of BOOL_PARAMS) {
    const v = sp.get(key);
    if (v == null) continue;
    if (!BOOL.has(v)) return bad(`invalid ${key}`);
    out.set(key, v);
  }

  if (!out.has("vs_currencies")) out.set("vs_currencies", "usd");
  if (!out.has("ids") && !out.has("names")) return bad("missing ids or names");

  // Canonical cache key (params sorted) so equivalent requests share an entry.
  const canonical = [...out.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const now = Date.now();
  const cached = memo.get(canonical);
  if (cached && now - cached.at < MEMO_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  }

  const fetchOnce = async () => {
    const headers: Record<string, string> = { accept: "application/json" };
    const apiKey = process.env.COINGECKO_API_KEY;
    if (apiKey) headers["x-cg-demo-api-key"] = apiKey;
    const upstream = await fetch(`${CG_BASE}?${out.toString()}`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`);
    return upstream.json();
  };

  try {
    let p = inflight.get(canonical);
    if (!p) {
      p = fetchOnce().finally(() => inflight.delete(canonical));
      inflight.set(canonical, p);
    }
    const data = await p;
    memo.delete(canonical); // re-insert so freshest entries sit at the tail
    memo.set(canonical, { at: Date.now(), data });
    if (memo.size > MEMO_MAX_KEYS) {
      const oldest = memo.keys().next().value;
      if (oldest !== undefined) memo.delete(oldest);
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": CACHE_CONTROL },
    });
  } catch {
    // Serve last-good rather than hammering CoinGecko during an outage/429.
    if (cached) {
      return NextResponse.json(cached.data, {
        headers: { "Cache-Control": "public, s-maxage=30" },
      });
    }
    return NextResponse.json({ error: "upstream unavailable" }, { status: 502 });
  }
}
