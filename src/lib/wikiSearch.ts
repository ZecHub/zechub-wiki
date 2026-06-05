import type { Searcher } from "@/types";

export function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeQuery(q: string): string {
  return q.normalize("NFKD").replace(/\s+/g, " ").trim().toLowerCase();
}

export function tokenizeQuery(q: string): string[] {
  const n = normalizeQuery(q);
  if (!n) return [];
  return n.split(/\s+/).filter(Boolean);
}

export function pathSectionLabel(url: string): string {
  const seg = url.split("/").filter(Boolean)[0] ?? "";
  if (!seg) return "";
  return seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function levenshtein(a: string, b: string, cap = 3): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  const n = b.length;
  const row: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= n; j++) {
      const curr =
        a[i - 1] === b[j - 1]
          ? row[j - 1]
          : 1 + Math.min(row[j], prev, row[j - 1]);
      row[j - 1] = prev;
      prev = curr;
    }
    row[n] = prev;
  }
  return row[n];
}

function trigramSet(s: string): Set<string> {
  const padded = `  ${s} `;
  const out = new Set<string>();
  for (let i = 0; i <= padded.length - 3; i++) {
    out.add(padded.slice(i, i + 3));
  }
  return out;
}

function trigramSim(a: string, b: string): number {
  if (!a || !b) return 0;
  const ta = trigramSet(a);
  const tb = trigramSet(b);
  let inter = 0;
  ta.forEach((t) => {
    if (tb.has(t)) inter++;
  });
  return (2 * inter) / (ta.size + tb.size);
}

function tokenWordSim(t: string, w: string): number {
  if (w === t) return 1.0;
  if (w.startsWith(t)) return 0.88;
  if (w.includes(t) && t.length >= 3) return 0.72;
  if (t.includes(w) && w.length >= 3) return 0.65;

  const tSim = trigramSim(t, w);
  if (tSim >= 0.42) return 0.45 + 0.45 * tSim;

  if (t.length >= 4 && w.length >= 4) {
    const cap = t.length <= 5 ? 1 : 2;
    const dist = levenshtein(t, w, cap);
    if (dist === 1) return 0.78;
    if (dist === 2 && t.length >= 6) return 0.55;
  }

  return 0;
}

function bestTokenSim(t: string, fieldWords: string[]): number {
  let best = 0;
  for (const w of fieldWords) {
    const s = tokenWordSim(t, w);
    if (s > best) best = s;
    if (best === 1) break; // can't improve
  }
  return best;
}

const FIELD_W = { name: 1.8, desc: 1.0, url: 0.55 } as const;

export function scoreItem(
  item: Searcher,
  normalizedFull: string,
  tokens: string[],
): number {
  const nameRaw = item.name.toLowerCase();
  const descRaw = item.desc.toLowerCase();
  const urlRaw = item.url.toLowerCase().replace(/[-/]/g, " ");

  const nameWords = nameRaw.split(/\s+/).filter(Boolean);
  const descWords = descRaw.split(/\s+/).filter(Boolean);
  const urlWords = urlRaw.split(/\s+/).filter(Boolean);

  const aliasText = item.aliases?.join(" ").toLowerCase() ?? "";
  const aliasWords = aliasText.split(/\s+/).filter(Boolean);

  let coverageScore = 0;
  let hardMisses = 0;

  for (const t of tokens) {
    const nSim = bestTokenSim(t, nameWords);
    const dSim = bestTokenSim(t, descWords);
    const uSim = bestTokenSim(t, urlWords);
    const aSim = bestTokenSim(t, aliasWords);
    const best = Math.max(
      nSim * FIELD_W.name,
      dSim * FIELD_W.desc,
      uSim * FIELD_W.url,
      aSim * 1.5,
    );
    if (best === 0) hardMisses++;
    coverageScore += best;
  }

  if (tokens.length > 0 && hardMisses === tokens.length) return -1;

  if (hardMisses > 0) coverageScore *= Math.pow(0.35, hardMisses);

  const avgCoverage = tokens.length > 0 ? coverageScore / tokens.length : 0;

  let bonus = 0;

  if (normalizedFull) {
    if (nameRaw === normalizedFull) bonus += 1200;
    else if (nameRaw.startsWith(normalizedFull)) bonus += 700;
    else if (nameRaw.includes(normalizedFull)) bonus += 500;
    else if (descRaw.includes(normalizedFull)) bonus += 120;
  }

  if (tokens.length > 0 && nameRaw.startsWith(tokens[0])) bonus += 350;

  for (const t of tokens) {
    const wordStarts = nameWords.some((w) => w.startsWith(t));
    if (nameRaw.includes(t)) bonus += wordStarts ? 120 : 80;
    if (descRaw.includes(t)) bonus += 28;
    if (item.url.toLowerCase().includes(t)) bonus += 18;
  }

  const lengthPenalty = Math.min(nameRaw.length, 48) * 0.35;

  return avgCoverage * 300 + bonus - lengthPenalty;
}

export function searchWiki(
  items: readonly Searcher[],
  query: string,
): Searcher[] {
  const normalizedFull = normalizeQuery(query);
  const tokens = tokenizeQuery(query);

  if (!normalizedFull || !tokens.length) {
    return [...items];
  }

  return items
    .map((item) => ({ item, score: scoreItem(item, normalizedFull, tokens) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}
