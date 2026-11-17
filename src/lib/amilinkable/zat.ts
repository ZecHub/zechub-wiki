// Ported from Am I Linkable (github.com/Adeolu05/am-i-linkable, packages/core, MIT,
// (c) 2026 David Peluola). Kept as close to the original as possible so the two
// stay easy to compare; see docs/MATCHING.md there for how the scoring works.

// Exact conversion between ZEC as people type it and zatoshis.
// String-based: no floating point is ever involved.

export const ZAT_PER_ZEC = BigInt(100_000_000);
/** Total ZEC supply cap. Anything larger cannot be a real amount. */
export const MAX_ZEC = BigInt(21_000_000);
export const MAX_ZAT = MAX_ZEC * ZAT_PER_ZEC;

export type ParseResult = { ok: true; zat: bigint } | { ok: false; error: string };

/**
 * Parses an amount in ZEC ("1", "1.5", "0.00000001", ".5", "1,000.25") into zatoshis.
 * Commas are accepted only as thousands separators before the decimal point.
 */
export function parseZecToZat(input: string): ParseResult {
  const s = input.trim().replace(/\s+/g, "");
  if (s === "") return { ok: false, error: "Enter an amount in ZEC." };
  if (!/^(\d{1,3}(,\d{3})+|\d+)?(\.\d*)?$/.test(s) || s === ".") {
    return { ok: false, error: "Use digits and an optional decimal point, for example 1.25." };
  }
  const [wholeRaw = "", frac = ""] = s.replace(/,/g, "").split(".");
  if (frac.length > 8) return { ok: false, error: "ZEC has at most 8 decimal places." };
  const whole = BigInt(wholeRaw === "" ? "0" : wholeRaw);
  const zat = whole * ZAT_PER_ZEC + BigInt(frac.padEnd(8, "0") || "0");
  if (zat === BigInt(0)) return { ok: false, error: "Enter an amount greater than zero." };
  if (zat > MAX_ZAT) return { ok: false, error: "That is more than the total ZEC supply." };
  return { ok: true, zat };
}

/** Formats zatoshis as ZEC with trailing zeros trimmed (keeps at least one decimal). */
export function formatZec(zat: bigint | number): string {
  const z = BigInt(zat);
  const sign = z < BigInt(0) ? "-" : "";
  const abs = z < BigInt(0) ? -z : z;
  const whole = abs / ZAT_PER_ZEC;
  const frac = (abs % ZAT_PER_ZEC).toString().padStart(8, "0").replace(/0+$/, "");
  return `${sign}${whole.toLocaleString("en-US")}.${frac === "" ? "0" : frac}`;
}
