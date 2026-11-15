// Ported from Am I Linkable (github.com/Adeolu05/am-i-linkable, packages/core, MIT,
// (c) 2026 David Peluola). Kept as close to the original as possible so the two
// stay easy to compare; see docs/MATCHING.md there for how the scoring works.

// Example amounts for the "Before you move" check.
// Pure: they read the already-downloaded deposits and send nothing anywhere.

import { isDust } from "./dust";
import { checkWithdrawal, COMMON_SET_SIZE, ShieldIndex, WINDOW_DAYS } from "./match";

const DAY = 86_400_000;
const TYPICAL_FEE_ZAT = 15_000;

function pick<T>(items: T[], random: () => number): T | null {
  return items.length === 0 ? null : items[Math.min(items.length - 1, Math.floor(random() * items.length))]!;
}

/**
 * A withdrawal amount that would be high risk right now: a recent deposit with a
 * unique amount, minus a typical fee (what its owner might withdraw).
 */
export function pickRiskyExample(index: ShieldIndex, now: number, random: () => number = Math.random): number | null {
  const recent = index.events.filter((e) => e.time <= now && now - e.time <= 2 * DAY).sort((a, b) => b.time - a.time);
  const found: number[] = [];
  for (const e of recent) {
    const p = e.amountZat - TYPICAL_FEE_ZAT;
    if (isDust(BigInt(p)) || p < 1_000_000) continue; // skip tiny amounts
    const r = checkWithdrawal(BigInt(p), now, index);
    if (r.kind === "result" && r.risk === "high") found.push(p);
    if (found.length >= 5) break;
  }
  return pick(found, random);
}

/** A withdrawal amount that blends into a large crowd of recent deposits. */
export function pickCommonExample(index: ShieldIndex, now: number, random: () => number = Math.random): number | null {
  const counts = new Map<number, number>();
  for (const e of index.events) {
    if (e.time > now || now - e.time > WINDOW_DAYS * DAY || isDust(BigInt(e.amountZat))) continue;
    counts.set(e.amountZat, (counts.get(e.amountZat) ?? 0) + 1);
  }
  const top = [...counts]
    .filter(([, n]) => n >= COMMON_SET_SIZE)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([amount]) => amount)
    .filter((a) => {
      const r = checkWithdrawal(BigInt(a), now, index);
      return r.kind === "result" && r.risk === "low";
    });
  return pick(top, random);
}
