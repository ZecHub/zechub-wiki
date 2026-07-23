// Same-origin proxy for Zcash on-chain data (Dashboard "Zcash Metrics" + Halving
// meter): block height, circulating supply, and shielded-pool value.
//
// Source: Cipherscan (keyless). The browser only ever talks to this origin.
// Blockchair (previously used here, with a now-expired hardcoded key) is gone.
// Market price / market cap are NOT here — they come from /api/prices/simple.
//
// Rate-limit protection is layered so Cipherscan is hit ~once/min regardless of
// traffic OR cache-busting query strings:
//   1. Vercel CDN edge cache (s-maxage) handles the common no-param case.
//   2. A process-local last-good memo bounds a warm instance to ~1 upstream
//      call/min even when `?x=<random>` bypasses the CDN, and an in-flight
//      promise coalesces concurrent misses into a single upstream call.
// A malformed 200 (renamed/missing fields) is rejected, never cached, so the
// memo can only ever hold a validated snapshot; last-good is served on outage
// up to MEMO_MAX_STALE_MS, after which the route reports unavailable (503).
const CIPHERSCAN = "https://api.mainnet.cipherscan.app/api/blockchain-info";
const CACHE = "public, s-maxage=60, stale-while-revalidate=300";
const MEMO_TTL_MS = 60_000;
const MEMO_MAX_STALE_MS = 15 * 60_000;
// Explicit shielded (private) value pools. New privacy pools must be added here
// deliberately; unknown pool ids are logged so an upstream contract change is
// noticed rather than silently mis-counted.
const SHIELDED_POOLS = new Set(["sprout", "sapling", "orchard", "ironwood"]);
const KNOWN_NON_SHIELDED = new Set(["transparent", "lockbox"]);

let memo = { at: 0, body: null };
let inflight = null;

function toZat(v) {
  const n = v != null ? Number(v) : NaN;
  return Number.isSafeInteger(n) && n >= 0 ? n : null;
}

async function fetchChain() {
  const chainRes = await fetch(CIPHERSCAN, {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!chainRes.ok) throw new Error(`Cipherscan upstream ${chainRes.status}`);
  const chain = await chainRes.json();

  // Validate the semantic contract; throw on any violation so a malformed 200
  // runs the stale/503 path instead of becoming a cached all-null payload.
  const blocks = chain?.blocks;
  if (typeof blocks !== "number" || !Number.isFinite(blocks) || blocks < 0) {
    throw new Error("Cipherscan: invalid block height");
  }
  const supplyZat = toZat(chain?.chainSupply?.chainValueZat);
  if (supplyZat == null) throw new Error("Cipherscan: invalid chainSupply");
  if (!Array.isArray(chain?.valuePools)) {
    throw new Error("Cipherscan: valuePools not an array");
  }

  const seen = new Set();
  let shieldedZat = 0;
  for (const p of chain.valuePools) {
    const id = p?.id;
    if (typeof id !== "string") continue;
    if (seen.has(id)) throw new Error(`Cipherscan: duplicate pool ${id}`);
    seen.add(id);
    if (SHIELDED_POOLS.has(id)) {
      const z = toZat(p.chainValueZat);
      if (z == null) throw new Error(`Cipherscan: invalid ${id} pool value`);
      shieldedZat += z;
    } else if (!KNOWN_NON_SHIELDED.has(id)) {
      // A pool we don't classify yet — surface it, don't guess its privacy.
      console.warn(`blockchain-data: unclassified value pool "${id}"`);
    }
  }
  if (!Number.isSafeInteger(shieldedZat) || shieldedZat > supplyZat) {
    throw new Error("Cipherscan: shielded sum out of range");
  }

  return {
    data: {
      blocks,
      circulation: supplyZat * 1e-8,
      shielded_value_zec: shieldedZat * 1e-8, // 0 is a valid value, not null
      transactions_24h: null, // pending combined 24h total from the data pipeline
    },
  };
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
    // Coalesce concurrent misses so a warm instance makes at most one upstream call.
    if (!inflight) {
      inflight = fetchChain().finally(() => {
        inflight = null;
      });
    }
    const body = await inflight;
    memo = { at: Date.now(), body };
    res.setHeader("Cache-Control", CACHE);
    return res.status(200).json(body);
  } catch (error) {
    console.error("Error fetching Cipherscan blockchain data:", error);
    // Serve last-good only while it isn't too stale, so a long outage doesn't
    // present arbitrarily old chain values as if current.
    if (memo.body && Date.now() - memo.at < MEMO_MAX_STALE_MS) {
      res.setHeader("Cache-Control", "public, s-maxage=30");
      return res.status(200).json(memo.body);
    }
    // No fresh-enough value: signal failure (not a cacheable success). Consumers
    // treat non-200 as "unavailable" and render N/A / an unavailable state.
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ data: null, error: "upstream unavailable" });
  }
}
