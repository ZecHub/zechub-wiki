// Ported from Am I Linkable (github.com/Adeolu05/am-i-linkable, packages/core, MIT,
// (c) 2026 David Peluola). Kept as close to the original as possible so the two
// stay easy to compare; see docs/MATCHING.md there for how the scoring works.

// "Before you move": how linkable would withdrawing (unshielding) a given amount be?
//
// Pure and synchronous. The scoring is deliberately simple so every result can
// be explained in a sentence; docs/MATCHING.md describes it and its limits.

import { DUST_MESSAGE, isDust } from "./dust";
import type { Pool, ShieldEvent } from "./shields";
import { formatZec } from "./zat";

/**
 * A deposit (shield) of X followed by a withdrawal of P is suspicious when
 * 0 <= X - P <= FEE_BAND_ZAT: the pool paid out P plus the withdrawal fee (and
 * maybe a fee or two for shielded hops in between). 100,000 zat is the 99th
 * percentile of unshield fees observed over 30 days of mainnet data
 * (2026-10-14: median 15,000, p95 50,000, p99 100,000).
 */
export const FEE_BAND_ZAT = 100_000;
/** At or above this many candidate deposits, a withdrawal blends in. */
export const COMMON_SET_SIZE = 10;
/** Candidates newer than this are "recent". */
export const RECENT_MS = 7 * 86_400_000;
/** Deposits shown and projected; matches the dataset window. */
export const WINDOW_DAYS = 30;

export type Risk = "high" | "medium" | "low";

export interface Match {
  time: number;
  ageMs: number;
  amountZat: number;
  pool: Pool;
  /** First 12 hex characters of the deposit's transaction id. */
  txidPrefix: string;
  /** "exact": same amount; "near": deposit minus withdrawal is within the fee band. */
  kind: "exact" | "near";
  differenceZat: number;
}

export interface CommonAmount {
  amountZat: number;
  /** Deposits this withdrawal would blend in with. */
  anonymitySet: number;
}

export interface Suggestions {
  /** How the risk level changes if you wait (only when waiting helps). */
  wait?: { afterDays: number; risk: Risk }[];
  /** Nearby lower amounts that blend in with many deposits. */
  commonAmounts?: CommonAmount[];
  /** Parts that each blend in; only offered when no single common amount is close. */
  split?: CommonAmount[];
}

export type CheckResult =
  | { kind: "dust"; message: string }
  | { kind: "no-data"; message: string }
  | {
      kind: "result";
      amountZat: number;
      risk: Risk;
      reasons: string[];
      /** Deposits with exactly this amount. */
      exactCount: number;
      /** Deposits within [amount, amount + fee band]: the anonymity set. */
      anonymitySet: number;
      /** Newest first, at most 10. */
      matches: Match[];
      suggestions: Suggestions;
      caveat: string;
    };

const CAVEAT =
  "This is a risk indicator based on public amounts and timing, not proof. A low result does not guarantee privacy; a high result means a pattern exists, not that anyone has linked you.";

const DAY = 86_400_000;

/** Sorted amounts with counts, for fast range queries. */
export class ShieldIndex {
  readonly events: ShieldEvent[];
  private readonly amounts: number[];

  constructor(events: ShieldEvent[]) {
    this.events = events;
    this.amounts = events.map((e) => e.amountZat).sort((a, b) => a - b);
  }

  get size() {
    return this.events.length;
  }

  private lowerBound(x: number) {
    let lo = 0;
    let hi = this.amounts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.amounts[mid]! < x) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /** Number of deposits with amount in [lo, hi]. */
  countBetween(lo: number, hi: number) {
    return this.lowerBound(hi + 1) - this.lowerBound(lo);
  }

  /** Anonymity set for withdrawing `p`: deposits in [p, p + fee band]. */
  anonymitySet(p: number) {
    return this.countBetween(p, p + FEE_BAND_ZAT);
  }

  /** Distinct deposit amounts in [lo, hi], ascending. */
  distinctAmountsBetween(lo: number, hi: number): number[] {
    const out: number[] = [];
    for (let i = this.lowerBound(lo); i < this.amounts.length && this.amounts[i]! <= hi; i++) {
      if (out[out.length - 1] !== this.amounts[i]) out.push(this.amounts[i]!);
    }
    return out;
  }
}

/** The core rule, in one place. */
export function riskFor(anonymitySet: number, newestAgeMs: number | null): Risk {
  if (anonymitySet === 0 || newestAgeMs === null) return "low";
  if (anonymitySet >= COMMON_SET_SIZE) return "low";
  const recent = newestAgeMs <= RECENT_MS;
  if (anonymitySet <= 2) return recent ? "high" : "medium";
  return recent ? "medium" : "low";
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function describeAge(ms: number): string {
  if (ms < 3_600_000) return plural(Math.max(1, Math.round(ms / 60_000)), "minute");
  if (ms < DAY) return plural(Math.round(ms / 3_600_000), "hour");
  return plural(Math.round(ms / DAY), "day");
}

/** Number of significant decimal places in ZEC (0 for whole ZEC, 8 for 1-zat precision). */
export function decimals(zat: number): number {
  let d = 8;
  let z = zat;
  while (d > 0 && z % 10 === 0) {
    z /= 10;
    d--;
  }
  return d;
}

/** Round amounts at or below p, e.g. 4.0, 4.9, 4.95, 4.99 for p = 4.9973. */
function roundCandidates(p: number): number[] {
  const out: number[] = [];
  for (const step of [1_000_000_000, 100_000_000, 50_000_000, 10_000_000, 5_000_000, 1_000_000, 500_000, 100_000]) {
    const top = Math.floor(p / step) * step;
    for (let k = 0; k < 3; k++) out.push(top - k * step);
  }
  return out;
}

/**
 * Lower amounts that blend in. Candidates are deposit amounts between half the
 * plan and the plan (and each minus the typical 15,000-zat fee) plus round
 * numbers. Candidates within one fee band of each other describe the same
 * crowd, so each group contributes one suggestion: the roundest amount that
 * keeps at least 80% of the group's best crowd.
 */
function commonAmounts(index: ShieldIndex, p: number, limit = 3): CommonAmount[] {
  const seen = new Set<number>();
  const all: CommonAmount[] = [];
  const consider = (a: number) => {
    if (a > p || a < p / 2 || isDust(BigInt(a)) || seen.has(a)) return;
    seen.add(a);
    const n = index.anonymitySet(a);
    if (n >= COMMON_SET_SIZE) all.push({ amountZat: a, anonymitySet: n });
  };
  for (const x of index.distinctAmountsBetween(Math.ceil(p / 2), p + FEE_BAND_ZAT)) {
    consider(x);
    consider(x - 15_000);
  }
  roundCandidates(p).forEach(consider);

  all.sort((a, b) => a.amountZat - b.amountZat);
  const groups: CommonAmount[][] = [];
  for (const c of all) {
    const last = groups[groups.length - 1];
    if (last && c.amountZat - last[last.length - 1]!.amountZat <= FEE_BAND_ZAT) last.push(c);
    else groups.push([c]);
  }
  const picks = groups.map((g) => {
    const best = Math.max(...g.map((c) => c.anonymitySet));
    const good = g.filter((c) => c.anonymitySet >= best * 0.8);
    good.sort((a, b) => decimals(a.amountZat) - decimals(b.amountZat) || b.anonymitySet - a.anonymitySet);
    return { pick: good[0]!, best };
  });
  // Biggest crowds first, then the amount closest to the plan.
  picks.sort((a, b) => b.best - a.best || b.pick.amountZat - a.pick.amountZat);
  return picks.slice(0, limit).map((x) => x.pick);
}

/** Up to three parts, each blending in, covering at least 95% of the plan. */
function splitPlan(index: ShieldIndex, p: number): CommonAmount[] | undefined {
  const pool: CommonAmount[] = [];
  const seen = new Set<number>();
  for (const x of index.distinctAmountsBetween(Math.ceil(p * 0.05), p)) {
    for (const a of [x, x - 15_000]) {
      if (a <= 0 || a > p || isDust(BigInt(a)) || seen.has(a)) continue;
      seen.add(a);
      const n = index.anonymitySet(a);
      if (n >= COMMON_SET_SIZE) pool.push({ amountZat: a, anonymitySet: n });
    }
  }
  if (pool.length === 0) return undefined;
  // Keep the search small and favour well-populated amounts.
  const top = pool.sort((a, b) => b.anonymitySet - a.anonymitySet).slice(0, 150).sort((a, b) => a.amountZat - b.amountZat);
  const target = p * 0.95;
  let best: { parts: CommonAmount[]; total: number } | undefined;
  const consider = (parts: CommonAmount[]) => {
    const total = parts.reduce((s, x) => s + x.amountZat, 0);
    if (total > p || total < target) return;
    if (!best || parts.length < best.parts.length || (parts.length === best.parts.length && total > best.total)) best = { parts, total };
  };
  for (let i = 0; i < top.length; i++) {
    for (let j = i; j < top.length; j++) {
      consider([top[j]!, top[i]!]);
      if (best && best.parts.length === 2) continue;
      for (let k = j; k < top.length; k++) consider([top[k]!, top[j]!, top[i]!]);
    }
  }
  return best?.parts;
}

export function checkWithdrawal(amountZat: bigint, now: number, shields: ShieldEvent[] | ShieldIndex): CheckResult {
  if (isDust(amountZat)) return { kind: "dust", message: DUST_MESSAGE };
  const index = shields instanceof ShieldIndex ? shields : new ShieldIndex(shields);
  if (index.size === 0) {
    return { kind: "no-data", message: "Recent deposit data is not available right now, so this amount cannot be checked." };
  }
  const p = Number(amountZat);

  const candidates = index.events
    .filter((e) => e.amountZat >= p && e.amountZat - p <= FEE_BAND_ZAT && e.time <= now)
    .sort((a, b) => b.time - a.time);
  const matches: Match[] = candidates.slice(0, 10).map((e) => ({
    time: e.time,
    ageMs: now - e.time,
    amountZat: e.amountZat,
    pool: e.pool,
    txidPrefix: e.txidPrefix,
    kind: e.amountZat === p ? "exact" : "near",
    differenceZat: e.amountZat - p,
  }));
  const n = candidates.length;
  const exactCount = candidates.filter((e) => e.amountZat === p).length;
  const newestAge = n > 0 ? now - candidates[0]!.time : null;
  const risk = riskFor(n, newestAge);

  const amount = `${formatZec(p)} ZEC`;
  const reasons: string[] = [];
  if (n === 0) {
    reasons.push(`No deposit into the shielded pools in the last ${WINDOW_DAYS} days matches ${amount}, or ${amount} plus a typical fee.`);
  } else if (n >= COMMON_SET_SIZE) {
    reasons.push(`${plural(n, "recent deposit")} match ${amount} (exactly or within a typical fee), so a withdrawal of this size blends in with many others.`);
  } else {
    const what = exactCount === n ? "exactly" : exactCount > 0 ? "exactly or within a typical fee" : "within a typical fee";
    reasons.push(`Only ${plural(n, "deposit")} in the last ${WINDOW_DAYS} days ${n === 1 ? "matches" : "match"} ${amount} ${what}.`);
    reasons.push(`The most recent was ${describeAge(newestAge!)} ago.`);
    if (risk === "high") reasons.push(`Withdrawing ${amount} soon may be linkable to ${n === 1 ? "that deposit" : "those deposits"} by amount and timing.`);
    else if (risk === "medium") reasons.push(`A withdrawal of ${amount} may be linkable to ${n === 1 ? "it" : "them"}, though ${newestAge! > RECENT_MS ? "the time gap" : "the small crowd"} weakens the link.`);
    else reasons.push(`The time gap and the number of similar deposits make a link weaker.`);
  }

  const suggestions: Suggestions = {};
  if (risk !== "low" && newestAge !== null) {
    const steps = [1, 3, 7, 14, 30].map((d) => ({ afterDays: d, risk: riskFor(n, newestAge + d * DAY) }));
    const firstBetter = steps.find((s) => s.risk !== risk);
    if (firstBetter) suggestions.wait = steps;
    const common = commonAmounts(index, p);
    if (common.length > 0) suggestions.commonAmounts = common;
    // Splitting only helps if no single common amount gets close to the plan.
    const closeEnough = common.some((c) => c.amountZat >= p * 0.95);
    if (!closeEnough) {
      const split = splitPlan(index, p);
      if (split) suggestions.split = split;
    }
  }

  return { kind: "result", amountZat: p, risk, reasons, exactCount, anonymitySet: n, matches, suggestions, caveat: CAVEAT };
}
