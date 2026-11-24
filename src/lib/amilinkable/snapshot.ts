import type { Pool, ShieldsPayload } from "./shields";

export const AMILINKABLE_ORIGIN = "https://am-i-linkable.vercel.app";

const POOLS = new Set<Pool>(["sprout", "sapling", "orchard", "ironwood"]);
const HEX12 = /^[0-9a-f]{12}$/;
/** Far above a month of real shields (about 30,000), so a broken upstream can't flood the page. */
const MAX_ROWS = 500_000;

/**
 * Validates Am I Linkable's public 30-day shield snapshot and rebuilds it from
 * known fields only. Returns null if anything is off, so the tool shows "no
 * data" rather than a wrong answer.
 */
export function parseSnapshot(body: unknown): ShieldsPayload | null {
  const b = body as Record<string, any> | null;
  if (!b || b.v !== 1 || !Array.isArray(b.rows) || !Array.isArray(b.pools)) return null;
  if (b.rows.length > MAX_ROWS) return null;
  const pools = b.pools as unknown[];
  if (!pools.every((p) => POOLS.has(p as Pool))) return null;
  const baseTime = Number(b.baseTime);
  const windowDays = Number(b.windowDays);
  if (!Number.isSafeInteger(baseTime) || !Number.isInteger(windowDays) || windowDays < 1 || windowDays > 90) return null;

  const rows: ShieldsPayload["rows"] = [];
  for (const r of b.rows as unknown[]) {
    if (!Array.isArray(r) || r.length !== 4) return null;
    const [dt, amount, pool, txid] = r;
    if (!Number.isSafeInteger(dt) || dt < 0) return null;
    if (!Number.isSafeInteger(amount) || amount <= 0) return null;
    if (!Number.isInteger(pool) || pool < 0 || pool >= pools.length) return null;
    if (typeof txid !== "string" || !HEX12.test(txid)) return null;
    rows.push([dt, amount, pool, txid]);
  }
  return {
    v: 1,
    generatedAt: typeof b.generatedAt === "string" ? b.generatedAt.slice(0, 40) : "",
    tipHeight: Number.isSafeInteger(b.tipHeight) ? b.tipHeight : null,
    windowDays,
    baseTime,
    pools: pools as Pool[],
    rows,
  };
}
