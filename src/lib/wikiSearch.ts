import type { Searcher } from "@/types";

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Lowercase, collapse spaces, trim. */
export function normalizeQuery(q: string): string {
  return q.normalize("NFKD").replace(/\s+/g, " ").trim().toLowerCase();
}

export function tokenizeQuery(q: string): string[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  return n.split(/\s+/).filter(Boolean);
}

/** Human-readable section from first URL segment, e.g. /start-here/foo → "Start here" */
export function pathSectionLabel(url: string): string {
  const seg = url.split("/").filter(Boolean)[0] ?? "";
  if (!seg) return "";
  return seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Multi-field AND search (all tokens must appear somewhere in name, desc, or path).
 * Ranked: exact / prefix on title, token density, then description and path matches.
 */
export function scoreItem(item: Searcher, normalizedFull: string, tokens: string[]): number {
  const name = item.name.toLowerCase();
  const desc = item.desc.toLowerCase();
  const path = item.url.toLowerCase();
  const hay = `${name} ${desc} ${path}`;

  for (const t of tokens) {
    if (!hay.includes(t)) return -1;
  }

  let score = 0;

  if (normalizedFull) {
    if (name === normalizedFull) score += 1200;
    else if (name.startsWith(normalizedFull)) score += 700;
    else if (name.includes(normalizedFull)) score += 500;
  }

  if (tokens.length > 0 && name.startsWith(tokens[0])) score += 350;

  for (const t of tokens) {
    const wordStarts = name.split(/\s+/).some((w) => w.startsWith(t));
    if (name.includes(t)) score += wordStarts ? 120 : 80;
    if (desc.includes(t)) score += 28;
    if (path.includes(t)) score += 18;
  }

  score -= Math.min(name.length, 48) * 0.35;
  return score;
}

export function searchWiki(items: readonly Searcher[], query: string): Searcher[] {
  const normalizedFull = normalizeQuery(query);
  const tokens = tokenizeQuery(query);

  if (!normalizedFull || !tokens.length) {
    return [...items];
  }

  const ranked = items
    .map((item) => ({
      item,
      score: scoreItem(item, normalizedFull, tokens),
    }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score);

  return ranked.map((x) => x.item);
}
