// Ported from Am I Linkable (github.com/Adeolu05/am-i-linkable, packages/core, MIT,
// (c) 2026 David Peluola). Kept as close to the original as possible so the two
// stay easy to compare; see docs/MATCHING.md there for how the scoring works.

// Compact wire format for recent shield events (GET /api/v1/shields) and its decoder.
//
// Rows are arrays rather than objects to keep the payload small:
//   [timeOffsetSeconds, amountZat, poolIndex, txidPrefix]
// where time = baseTime + timeOffsetSeconds. Amounts fit safely in a JS number:
// the 21M ZEC cap is 2.1e15 zatoshis, below 2^53.
//
// Only the first 12 hex characters of each txid are sent: full txids were 85%
// of the payload, and 12 characters (48 bits) are plenty to compare against the
// id shown in your own wallet.

export type Pool = "sprout" | "sapling" | "orchard" | "ironwood";

export const TXID_PREFIX_LENGTH = 12;

export interface ShieldsPayload {
  v: 1;
  generatedAt: string;
  tipHeight: number | null;
  windowDays: number;
  /** Unix seconds that row time offsets are relative to. */
  baseTime: number;
  pools: Pool[];
  rows: [number, number, number, string][];
}

export interface ShieldEvent {
  /** Unix milliseconds. */
  time: number;
  amountZat: number;
  pool: Pool;
  /** First TXID_PREFIX_LENGTH hex characters of the transaction id. */
  txidPrefix: string;
}

export function decodeShields(p: ShieldsPayload): ShieldEvent[] {
  if (p.v !== 1) throw new Error(`unsupported shields payload version ${String(p.v)}`);
  return p.rows.map(([dt, amountZat, poolIndex, txidPrefix]) => {
    const pool = p.pools[poolIndex];
    if (!pool) throw new Error(`unknown pool index ${poolIndex}`);
    return { time: (p.baseTime + dt) * 1000, amountZat, pool, txidPrefix };
  });
}
