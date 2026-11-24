// CoinGecko coin *names* the Metric card can ask /api/prices/simple for.
//
// Shared by the client (src/components/Charts/Metric.tsx builds the query from
// it) and the server proxy (src/app/api/prices/simple/route.ts allow-lists
// `names` against it). Keeping both sides on one list means a coin added to the
// chart is automatically accepted by the proxy, and nothing else is.

// Chart coin id -> CoinGecko name, for ids whose CoinGecko name differs.
const RENAMED: Record<string, string> = {
  Atom: "Cosmos Hub",
  Tia: "Celestia",
  Osmo: "Osmosis",
  stOsmo: "Stride Staked Osmo",
  stTia: "Stride Staked TIA",
  stAtom: "Stride Staked Atom",
  Um: "Penumbra",
  Ntrn: "Neutron",
};

// Coin ids the Namada and Penumbra charts pass to <CryptoMetrics> under their
// own name (NamadaChart's "all" -> "Namada", PenumbraChart's default, and the
// Namada supply token ids that are sent unchanged).
const PASSTHROUGH = ["Namada", "Penumbra", "Usdc", "Nam"];

/** CoinGecko name for a chart coin id (the key of the upstream response). */
export function coingeckoNameFor(coin: string): string {
  return RENAMED[coin] ?? coin;
}

/** Every `names` value the app sends; the proxy rejects anything else. */
export const ALLOWED_COINGECKO_NAMES: ReadonlySet<string> = new Set(
  [...Object.values(RENAMED), ...PASSTHROUGH].map((n) => n.toLowerCase()),
);
