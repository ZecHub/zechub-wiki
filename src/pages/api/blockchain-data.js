// Same-origin proxy for Zcash on-chain data (Dashboard "Zcash Metrics" + Halving
// meter + Treasury tab): block height, circulating supply, and shielded-pool value.
//
// Source: Cipherscan (keyless). The browser only ever talks to this origin.
// Blockchair (previously used here, with a now-expired hardcoded key) is gone.
// Market price / market cap are NOT here — they come from /api/prices/simple.
//
// Rate-limit protection is two-layered so Cipherscan is hit ~once/min regardless
// of traffic OR cache-busting query strings:
//   1. Vercel CDN edge cache (s-maxage) handles the common no-param case.
//   2. A process-local last-good memo (below) bounds a warm instance to ~1
//      upstream call/min even when `?x=<random>` bypasses the CDN, and serves
//      the last good value during an upstream outage instead of caching nulls.
const CIPHERSCAN = "https://api.mainnet.cipherscan.app/api/blockchain-info";
const CACHE = "public, s-maxage=60, stale-while-revalidate=300";
const MEMO_TTL_MS = 60_000;
// Pools that are NOT user-shielded value. Everything else (sprout/sapling/
// orchard/ironwood/…) counts, so a future privacy pool is included automatically.
const NON_SHIELDED_POOLS = new Set(["transparent", "lockbox"]);

// Process-local cache (survives across invocations on a warm serverless instance).
let memo = { at: 0, body: null };

function toZat(v) {
  const n = v != null ? Number(v) : NaN;
  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const now = Date.now();
  if (memo.body && now - memo.at < MEMO_TTL_MS) {
    res.setHeader("Cache-Control", CACHE);
    return res.status(200).json(memo.body);
  }

  try {
    // Timeout so a slow/unreachable upstream fails fast instead of hanging to a 504.
    const chainRes = await fetch(CIPHERSCAN, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!chainRes.ok) throw new Error(`Cipherscan upstream ${chainRes.status}`);
    const chain = await chainRes.json();

    // Shielded pools in exact zats (deny-list transparent + lockbox).
    const poolsArr = Array.isArray(chain.valuePools) ? chain.valuePools : [];
    let shieldedZat = 0;
    for (const p of poolsArr) {
      if (!p || NON_SHIELDED_POOLS.has(p.id)) continue;
      const z = toZat(p.chainValueZat);
      if (z != null) shieldedZat += z;
    }

    const supplyZat = toZat(chain.chainSupply?.chainValueZat);

    const body = {
      data: {
        blocks: typeof chain.blocks === "number" ? chain.blocks : null,
        circulation: supplyZat != null ? supplyZat * 1e-8 : null,
        shielded_value_zec: shieldedZat > 0 ? shieldedZat * 1e-8 : null,
        transactions_24h: null, // pending combined 24h total from the data pipeline
      },
    };

    memo = { at: now, body };
    res.setHeader("Cache-Control", CACHE);
    return res.status(200).json(body);
  } catch (error) {
    console.error("Error fetching Cipherscan blockchain data:", error);
    // Serve the last known-good value rather than caching nulls (which would
    // e.g. make the halving meter compute a bogus countdown from blocks=null).
    if (memo.body) {
      res.setHeader("Cache-Control", "public, s-maxage=30");
      return res.status(200).json(memo.body);
    }
    // No cached value yet: signal failure (not a cacheable success). Consumers
    // treat non-200 as "unavailable" and render N/A.
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ data: null, error: "upstream unavailable" });
  }
}
