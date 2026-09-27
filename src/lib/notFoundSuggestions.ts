import type { Searcher } from "@/types";
import {
  normalizeQuery,
  scoreItem,
  searchWiki,
  tokenizeQuery,
} from "./wikiSearch";

/**
 * Suggested pages for a URL that returned 404.
 *
 * The wiki already builds a search index from the menu-titles manifest and
 * already has a fuzzy scorer behind the nav search box, so a dead URL can be
 * answered from data the page is holding anyway. No new endpoint, no second
 * index. /zcash-tech/light-wallet-node ranks "Zcash Lightwallet Nodes" first,
 * which is the page the reader was after.
 */

/** Extensions an old bookmark or an external link may still carry. */
const TRAILING_EXTENSION = /\.(html?|md|php|aspx?)$/i;

/**
 * Suggestions are only shown when the best match clears this score.
 *
 * Scored against the live index, clear near-misses land far above it:
 * "developer resources" 2359, "frost" 2226, "viewing key" 1829, "memo" 1661,
 * "who can see payment" 1432, "block explorer" 1303, "payment procesors" 1005,
 * "light wallet node" 812. Typed noise lands at or below it: "baz" 334,
 * "index php" 227, "qwerty nonsense" 29, and "asdfghjkl", "wp admin",
 * "lorem ipsum" and "1234567" match nothing at all.
 *
 * The two bands do overlap in the 350-430 range, and no threshold separates
 * them cleanly: real typos "glosary" 365 and "hardware walets" 394 sit right
 * next to junk "test123" 360 and "null" 418. The floor is set below that
 * overlap on purpose. A weak suggestion costs a glance at a list the reader can
 * ignore, since the search box sits directly above it, while a missing one
 * costs the whole point of the page. What the floor is really for is the case
 * where the scorer has nothing and names its least-bad guess anyway: offering
 * "Namada Protocol" for /qwerty-nonsense is worse than offering nothing.
 */
export const MIN_SUGGESTION_SCORE = 350;

/**
 * Keep the trailing suggestions in the same league as the first one, so a
 * single strong match doesn't drag weak ones onto the page behind it.
 */
export const SUGGESTION_RELATIVE_FLOOR = 0.45;

export interface SuggestPagesOptions {
  /** Most suggestions to return. */
  limit?: number;
  /** Absolute floor the best match must clear. */
  minScore?: number;
  /** Fraction of the best score a further suggestion must reach. */
  relativeFloor?: number;
  /** Locale prefixes to strip, for a pathname that still carries one. */
  locales?: readonly string[];
}

const decodeSegment = (segment: string): string => {
  try {
    return decodeURIComponent(segment);
  } catch {
    // A malformed escape ("%zz") throws; the raw segment is still usable.
    return segment;
  }
};

/**
 * The search query a dead path implies.
 *
 * Only the last segment is used. Section words make the query worse rather
 * than better, because they match a lot of pages: as a whole path,
 * "/zcash-tech/nu-5" ranks "Zcash Resources" above "NU5", and
 * "/using-zcash/aaaaaaa" pulls up four "Using Zcash" pages for a segment that
 * matches nothing. The last segment on its own gets both right.
 */
export function pathToQuery(
  pathname: string,
  locales: readonly string[] = [],
): string {
  // Cut the query and hash before splitting, or "/zcash-tech/nu-5?ref=x#top"
  // would make "top" the last segment.
  const path = (pathname ?? "").split(/[?#]/)[0];
  const segments = path.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0])) {
    segments.shift();
  }

  const last = segments[segments.length - 1];
  if (!last) return "";

  return decodeSegment(last)
    .replace(TRAILING_EXTENSION, "")
    .replace(/[-_+.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rank the search index against a dead path and return the pages worth
 * offering, best first. An empty array means nothing was close enough, and the
 * caller should show the search box alone rather than a bad guess.
 */
export function suggestPages(
  items: readonly Searcher[],
  pathname: string,
  {
    limit = 5,
    minScore = MIN_SUGGESTION_SCORE,
    relativeFloor = SUGGESTION_RELATIVE_FLOOR,
    locales = [],
  }: SuggestPagesOptions = {},
): Searcher[] {
  const query = pathToQuery(pathname, locales);
  if (!query) return [];

  const normalizedFull = normalizeQuery(query);
  const tokens = tokenizeQuery(query);
  if (!normalizedFull || !tokens.length) return [];

  // searchWiki already drops non-matches and sorts by score descending.
  const ranked = searchWiki(items, query).map((item) => ({
    item,
    score: scoreItem(item, normalizedFull, tokens),
  }));

  const best = ranked[0]?.score ?? 0;
  if (best < minScore) return [];

  return ranked
    .filter((entry) => entry.score >= best * relativeFloor)
    .slice(0, limit)
    .map((entry) => entry.item);
}
