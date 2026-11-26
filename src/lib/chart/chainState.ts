export type ExpiryDeltaBar = { delta: number | "other"; count: number };

/**
 * The most frequent expiry deltas (expiry height minus block height), with
 * everything past `limit` folded into a single "other" bar.
 *
 * The chain-wide histogram in public/data/zcash/chain-state/results.json has
 * about 264,000 distinct deltas, so ranking it is by far the most expensive
 * step of the Chain State page. It depends only on the dataset: callers should
 * compute it once per load, not on every render.
 */
export function topExpiryDeltas(
  histogram: Record<string, number> | undefined,
  limit = 30,
): ExpiryDeltaBar[] {
  const entries = Object.entries(histogram ?? {})
    .map(([delta, count]) => ({ delta: Number(delta), count }))
    .sort((a, b) => b.count - a.count);
  const top: ExpiryDeltaBar[] = entries.slice(0, limit);
  const rest = entries.slice(limit).reduce((sum, e) => sum + e.count, 0);
  return rest > 0 ? [...top, { delta: "other", count: rest }] : top;
}
