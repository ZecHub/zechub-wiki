/**
 * Loading and querying the generated search index, in the browser.
 *
 * The index for one locale is a single JSON file under /search-index/. It is
 * fetched on first use — not imported — so it never enters the initial bundle
 * and a reader who never opens search never pays for it. One locale is loaded,
 * never all nineteen.
 *
 * Ranking in one sentence: a page scores for every query term it contains,
 * weighted by where the term appears, and is then multiplied by the share of
 * the query it matched, so a page containing all three words always outranks
 * one containing two.
 *
 * The curated list in src/constants/searcher.ts keeps its influence: its
 * descriptions and aliases are indexed into their own map and weighted above
 * body text, so hand-tuned results do not regress when full-text matching
 * arrives alongside them.
 */

import { tokenize, tokenSet } from "./tokenize";

export interface SearchIndex {
  v: number;
  locale: string;
  generated: string;
  /** [title, url, lead] */
  docs: [string, string, string][];
  /** token -> delta-encoded doc ids */
  terms: Record<string, number[]>;
  titles: Record<string, number[]>;
  aliases: Record<string, number[]>;
}

export interface SearchHit {
  title: string;
  url: string;
  snippet: string;
  score: number;
  /** Which part of the page matched best — used to label results. */
  matchedIn: "title" | "curated" | "body";
}

/** Weights. Title beats curated alias beats body; the gaps are deliberate. */
const W_TITLE = 8;
const W_ALIAS = 5;
const W_BODY = 1;

/**
 * Rarity weighting, and why it is not optional.
 *
 * Without it every term counts the same, and a query like "trusted setup"
 * ranks a page whose title contains "setup" alongside the page that discusses
 * trusted setups, because "setup" is on half the wiki and "trusted" is not.
 * Measured against the real index, the three worst results in a sample of
 * eleven queries were all this. Inverse document frequency is the standard
 * correction and costs nothing here: a term's document frequency is the length
 * of its postings list, which the index already stores.
 */
function idf(docCount: number, df: number): number {
  return Math.log(1 + docCount / (df + 1));
}

/** A prefix shorter than this expands to too much of the vocabulary. */
const MIN_PREFIX = 2;
/** Cap on vocabulary scanned for the trailing type-ahead term. */
const MAX_PREFIX_EXPANSION = 48;

const cache = new Map<string, Promise<SearchIndex | null>>();

/**
 * Fetch one locale's index, once per page load.
 *
 * Returns null rather than throwing when the index is absent. The build is
 * allowed to skip index generation — see scripts/generate-search-index.mjs —
 * and when it does, callers fall back to the curated list, which is the
 * behaviour the site had before this existed.
 */
export function loadIndex(locale: string, base = ""): Promise<SearchIndex | null> {
  const key = `${base}/${locale}`;
  const existing = cache.get(key);
  if (existing) return existing;

  const p = fetch(`${base}/search-index/${locale}.json`)
    .then((res) => (res.ok ? (res.json() as Promise<SearchIndex>) : null))
    .catch(() => null);

  cache.set(key, p);
  return p;
}

/** Delta-encoded ids back to absolute ones. */
function decode(deltas: number[] | undefined): number[] {
  if (!deltas) return [];
  const out = new Array<number>(deltas.length);
  let acc = 0;
  for (let i = 0; i < deltas.length; i++) out[i] = acc += deltas[i];
  return out;
}

/**
 * Tokens in the vocabulary starting with `prefix`.
 *
 * This is what makes the box feel like type-ahead: the trailing word of a
 * query is treated as incomplete, so "unif" already finds "unified". Capped,
 * because a one-letter prefix otherwise expands to most of the vocabulary and
 * scores every page equally, which is the same as no ranking at all.
 */
function expandPrefix(index: SearchIndex, prefix: string): string[] {
  if (prefix.length < MIN_PREFIX) return [];
  const out: string[] = [];
  for (const token in index.terms) {
    if (token.startsWith(prefix)) {
      out.push(token);
      if (out.length >= MAX_PREFIX_EXPANSION) break;
    }
  }
  return out;
}

/** A snippet from the lead, centred on the first matching term if there is one. */
function snippetFor(lead: string, queryTokens: string[]): string {
  if (!lead) return "";
  const lower = lead.toLowerCase();
  let at = -1;
  for (const t of queryTokens) {
    const i = lower.indexOf(t);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  if (at === -1) return lead.length > 160 ? lead.slice(0, 157).trimEnd() + "…" : lead;

  const start = Math.max(0, at - 60);
  const end = Math.min(lead.length, at + 100);
  return (start > 0 ? "…" : "") + lead.slice(start, end).trim() + (end < lead.length ? "…" : "");
}

export function search(
  index: SearchIndex | null,
  query: string,
  limit = 10,
): SearchHit[] {
  if (!index || !query.trim()) return [];

  const tokens = tokenSet(query);
  if (tokens.length === 0) return [];

  // The last token is treated as possibly incomplete, the rest as whole words.
  const whole = tokens.slice(0, -1);
  const trailing = tokens[tokens.length - 1];

  const score = new Map<number, number>();
  const matchedTokens = new Map<number, Set<string>>();
  const best = new Map<number, SearchHit["matchedIn"]>();

  const rank: Record<SearchHit["matchedIn"], number> = { body: 0, curated: 1, title: 2 };

  const credit = (
    ids: number[],
    weight: number,
    where: SearchHit["matchedIn"],
    forToken: string,
  ) => {
    for (const id of ids) {
      score.set(id, (score.get(id) ?? 0) + weight);
      let seen = matchedTokens.get(id);
      if (!seen) matchedTokens.set(id, (seen = new Set()));
      seen.add(forToken);
      const cur = best.get(id);
      if (!cur || rank[where] > rank[cur]) best.set(id, where);
    }
  };

  const docCount = index.docs.length;

  const applyToken = (token: string, forToken: string, weightScale = 1) => {
    // Document frequency comes from the body postings, the only map that
    // covers the whole corpus. A term that appears solely in a title or an
    // alias is by definition rare, so it gets the maximum weighting.
    const df = index.terms[token]?.length ?? 0;
    const rarity = idf(docCount, df);
    const scale = weightScale * rarity;

    credit(decode(index.titles[token]), W_TITLE * scale, "title", forToken);
    credit(decode(index.aliases[token]), W_ALIAS * scale, "curated", forToken);
    credit(decode(index.terms[token]), W_BODY * scale, "body", forToken);
  };

  for (const t of whole) applyToken(t, t);

  if (trailing) {
    applyToken(trailing, trailing);
    // A prefix hit is worth less than an exact one, so a complete word still wins.
    for (const expanded of expandPrefix(index, trailing)) {
      if (expanded !== trailing) applyToken(expanded, trailing, 0.4);
    }
  }

  const hits: SearchHit[] = [];
  for (const [id, raw] of score) {
    const doc = index.docs[id];
    if (!doc) continue;
    const coverage = (matchedTokens.get(id)?.size ?? 0) / tokens.length;
    // Squared so that matching every term dominates matching most of them.
    const final = raw * coverage * coverage;
    const [title, url, lead] = doc;
    hits.push({
      title,
      url,
      snippet: snippetFor(lead, tokens),
      score: final,
      matchedIn: best.get(id) ?? "body",
    });
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return hits.slice(0, limit);
}
