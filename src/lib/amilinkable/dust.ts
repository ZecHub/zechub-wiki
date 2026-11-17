// Ported from Am I Linkable (github.com/Adeolu05/am-i-linkable, packages/core, MIT,
// (c) 2026 David Peluola). Kept as close to the original as possible so the two
// stay easy to compare; see docs/MATCHING.md there for how the scoring works.

// Dust: amounts this small are moved in large numbers by automated senders,
// so matching them says nothing useful about any one user.

/** 0.001 ZEC. Amounts at or below this are dust. */
export const DUST_THRESHOLD_ZAT = BigInt(100_000);

export const DUST_MESSAGE = "This amount is too small and common to match meaningfully.";

export function isDust(amountZat: bigint | string): boolean {
  return BigInt(amountZat) <= DUST_THRESHOLD_ZAT;
}
