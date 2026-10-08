// Treasury balances arrive in each chain's base unit. Most Cosmos assets use 6
// decimals (ujuno, uosmo, uatom, …), but the IBC assets bridged from other
// ecosystems do not, and the dataset names their base unit in the ticker:
// WETH-WEI and WAVAX-WEI (18), AEVMOS (atto-EVMOS, 18), DOT-PLANCK (10),
// WBTC-SATOSHI (8). Dividing everything by 1e6 showed 3.65 quadrillion EVMOS
// and 104.8 million ETH for balances of about 3,650 EVMOS and 0.0001 ETH.

const UNIT_SUFFIXES: [RegExp, number][] = [
  [/-WEI$/, 18],
  [/-PLANCK$/, 10],
  [/-SATOSHI$/, 8],
];

/** Decimal places of the base unit a treasury balance is expressed in. */
export function decimalsFor(ticker: string): number {
  if (ticker === "AEVMOS") return 18;
  for (const [suffix, decimals] of UNIT_SUFFIXES) {
    if (suffix.test(ticker)) return decimals;
  }
  return 6;
}

/** A balance in whole tokens. */
export function toUnits(ticker: string, amount: string): number {
  const raw = parseFloat(amount);
  if (!Number.isFinite(raw)) return 0;
  return raw / 10 ** decimalsFor(ticker);
}

/** Whole-token amount for display: two decimals, or three significant digits below 1. */
export function formatUnits(value: number): string {
  if (value !== 0 && Math.abs(value) < 1) {
    return value.toLocaleString(undefined, { maximumSignificantDigits: 3 });
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

/** Token name without the base-unit suffix the dataset appends. */
export function tokenName(ticker: string): string {
  if (ticker === "AEVMOS") return "EVMOS";
  return ticker.replace(/-(WEI|PLANCK|SATOSHI)$/, "");
}
