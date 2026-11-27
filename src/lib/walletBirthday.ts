// Wallet birthday finder: the Zcash mainnet block height to enter as a
// wallet's birthday when restoring it, for a given date.
//
// A restored wallet only scans blocks from its birthday onwards. Funds it
// received before that block are not found (they are still on chain), while a
// lower birthday only makes the first sync longer. So the answer is the last
// block mined before the date, moved back by a safety margin.
//
// The first guess assumes every block took its era's target spacing. Real
// block times, looked up one height at a time, then correct it.

export type BlockEra = {
  name: string;
  /** First block of the era. */
  height: number;
  /** Header time of that block, in Unix seconds. */
  time: number;
  /** Target block spacing, in seconds. */
  spacing: number;
};

/**
 * Mainnet target block spacing by era, from the ZIPs (https://zips.z.cash):
 * - Launch: 150 s, PreBlossomPoWTargetSpacing (ZIP 208).
 * - Blossom, from block 653,600 (ZIP 206): 75 s, PostBlossomPoWTargetSpacing (ZIP 208).
 * - NU7, from block 3,543,405 (ZIP 259): 25 s, PostNU7PoWTargetSpacing (ZIP 218).
 * `time` is the header time of the era's first block (block 0 for Launch), as
 * the Block Time tool shows it.
 */
export const MAINNET_ERAS: readonly BlockEra[] = [
  { name: "Launch", height: 0, time: 1477641360, spacing: 150 },
  { name: "Blossom", height: 653_600, time: 1576101005, spacing: 75 },
  { name: "NU7", height: 3_543_405, time: 1793932442, spacing: 25 },
];

/** Sapling activation (ZIP 205). Light wallets such as ZODL reject a lower birthday. */
export const SAPLING_ACTIVATION_HEIGHT = 419_200;

export type FoundBlock = {
  height: number;
  /** Header time, in Unix seconds. */
  timestamp: number;
  hash?: string;
  /** Confirmations when looked up; the tip is height + confirmations - 1. */
  confirmations?: number | null;
};

/** Fetches one block, or resolves to null if the height is above the chain tip. */
export type BlockLookup = (height: number) => Promise<FoundBlock | null>;

export type LastBlockBefore = {
  /** The last block mined before the target time. */
  block: FoundBlock;
  lookups: number;
  /**
   * False if the lookup budget ran out first. `block` was still mined before
   * the target, just maybe not the last one, which is the safe direction.
   */
  exact: boolean;
};

const WEEK = 7 * 86_400;

function eraIndex(height: number, eras: readonly BlockEra[]): number {
  let i = 0;
  while (i + 1 < eras.length && height >= eras[i + 1].height) i++;
  return i;
}

export function eraAt(height: number, eras: readonly BlockEra[] = MAINNET_ERAS): BlockEra {
  return eras[eraIndex(height, eras)];
}

/** First guess at the height of the block mined at `time`. */
export function estimateHeight(time: number, eras: readonly BlockEra[] = MAINNET_ERAS): number {
  let i = 0;
  while (i + 1 < eras.length && time >= eras[i + 1].time) i++;
  const era = eras[i];
  const height = era.height + Math.floor((time - era.time) / era.spacing);
  const next = eras[i + 1];
  return Math.max(era.height, next ? Math.min(height, next.height - 1) : height);
}

/**
 * The height reached by moving `seconds` along the chain from `height`
 * (backwards when negative), with every block taking its era's target
 * spacing. Never below 0.
 */
export function shiftHeight(height: number, seconds: number, eras: readonly BlockEra[] = MAINNET_ERAS): number {
  let h = height;
  let left = Math.abs(seconds);
  let i = eraIndex(h, eras);
  if (seconds >= 0) {
    for (;;) {
      const { spacing } = eras[i];
      const next = eras[i + 1];
      const room = next ? (next.height - h) * spacing : Infinity;
      if (left <= room) return h + Math.floor(left / spacing);
      h = next.height;
      left -= room;
      i += 1;
    }
  }
  for (;;) {
    if (i > 0 && h === eras[i].height) i -= 1;
    const era = eras[i];
    const room = (h - era.height) * era.spacing;
    if (left <= room || i === 0) return Math.max(0, h - Math.ceil(left / era.spacing));
    h = era.height;
    left -= room;
  }
}

const midpoint = (lo: FoundBlock, hi: number) => lo.height + Math.floor((hi - lo.height) / 2);

// Steps from whichever known block is closer in time to the target, at the
// target spacing, and a little further (half the usual spread of that many
// block times) so the next lookup is likely to land on the other side. Within
// 16 blocks, block times are too noisy to aim with, so it bisects.
function nextProbe(target: number, lo: FoundBlock, hi: number, above: FoundBlock | null, eras: readonly BlockEra[]): number {
  if (hi - lo.height <= 16) return midpoint(lo, hi);
  const from = above && above.timestamp - target < target - lo.timestamp ? above : lo;
  const landing = shiftHeight(from.height, target - from.timestamp, eras);
  const distance = Math.abs(landing - from.height);
  const step = distance + Math.ceil(Math.sqrt(distance) / 2) + 1;
  const probe = from === lo ? lo.height + step : from.height - step;
  if (probe > lo.height && probe < hi) return probe;
  // Aiming past the tip: try the newest block.
  if (from === lo && !above) return hi - 1;
  return midpoint(lo, hi);
}

/**
 * Finds the last block mined before `target` (Unix seconds): a first guess
 * from the era spacings, then lookups until two adjacent heights straddle the
 * target. Takes about six lookups on mainnet.
 */
export async function findLastBlockBefore(
  target: number,
  lookup: BlockLookup,
  { eras = MAINNET_ERAS, maxLookups = 20 }: { eras?: readonly BlockEra[]; maxLookups?: number } = {},
): Promise<LastBlockBefore> {
  const first = eras[0];
  if (!(target > first.time)) throw new RangeError("The target is not after the first block.");

  // `lo` was mined before the target. Nothing at or above `hi` was (or it is
  // past the tip); `above` is block `hi` once it has been fetched.
  let lo: FoundBlock = { height: first.height, timestamp: first.time };
  let hi = Infinity;
  let above: FoundBlock | null = null;
  let fetchedLo = false;
  let sawBlock = false;
  let misses = 0;
  let lookups = 0;
  let probe = estimateHeight(target, eras);

  while (hi - lo.height > 1 && lookups < maxLookups) {
    probe = Math.min(Math.max(probe, lo.height + 1), hi - 1);
    const block = await lookup(probe);
    lookups += 1;
    if (block && block.timestamp < target) {
      lo = block;
      fetchedLo = true;
    } else {
      hi = probe;
      above = block;
    }
    const confirmations = block?.confirmations;
    if (typeof confirmations === "number" && confirmations >= 1 && probe + confirmations < hi) {
      hi = probe + confirmations;
      above = null;
    }

    if (block) {
      sawBlock = true;
      probe = nextProbe(target, lo, hi, above, eras);
    } else if (fetchedLo) {
      probe = midpoint(lo, hi);
    } else {
      // The first guess is past the tip: the chain is behind the target
      // spacing. Look one week back, then two, four... until a block exists.
      misses += 1;
      probe = shiftHeight(probe, -WEEK * 2 ** (misses - 1), eras);
    }
  }

  if (!sawBlock) throw new Error("No block was found at any of the heights looked up.");
  return { block: lo, lookups, exact: hi - lo.height <= 1 };
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

/**
 * Unix time for a date (YYYY-MM-DD) and optional time (HH:MM or HH:MM:SS), as
 * date and time inputs give them, in UTC or the browser's timezone. A blank
 * time is the start of the day. Null if either is not a real date or time.
 */
export function toUnixTime(date: string, time: string, zone: "local" | "utc"): number | null {
  const d = DATE_RE.exec(date.trim());
  const t = TIME_RE.exec(time.trim() || "00:00");
  if (!d || !t) return null;
  const [year, month, day] = [Number(d[1]), Number(d[2]) - 1, Number(d[3])];
  const [hours, minutes, seconds] = [Number(t[1]), Number(t[2]), Number(t[3] ?? 0)];
  if (hours > 23 || minutes > 59 || seconds > 59) return null;

  const value =
    zone === "utc" ? new Date(Date.UTC(year, month, day, hours, minutes, seconds)) : new Date(year, month, day, hours, minutes, seconds);
  // Date rolls 31 April over into May instead of failing.
  const sameDay =
    zone === "utc"
      ? value.getUTCFullYear() === year && value.getUTCMonth() === month && value.getUTCDate() === day
      : value.getFullYear() === year && value.getMonth() === month && value.getDate() === day;
  return sameDay ? Math.floor(value.getTime() / 1000) : null;
}
