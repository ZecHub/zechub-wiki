/**
 * The one tokenizer, shared by the build-time indexer and the browser.
 *
 * Why it lives in its own module: if the index is built with one tokenizer and
 * queried with another, a term the user types can be absent from the index even
 * though the word is on the page — a failure that looks like a ranking bug and
 * is almost impossible to find. Both sides import this file, and a test asserts
 * they agree.
 *
 * Scripts are a worthwhile cost here. The wiki ships 18 locales, and a
 * whitespace tokenizer indexes a Japanese paragraph as one enormous token,
 * which means Japanese search matches nothing at all. CJK runs are therefore
 * emitted as overlapping character bigrams, the standard cheap approach: it
 * needs no dictionary, no segmentation model and no per-locale configuration,
 * and it finds any substring of two or more characters.
 */

/** Han, Hiragana, Katakana, Hangul. */
const CJK =
  /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]/;

const CJK_RUN =
  /[぀-ヿ㐀-䶿一-鿿豈-﫿가-힯]+/gu;

/** Letters and numbers in any script, plus the joiners that sit inside words. */
const WORD = /[\p{L}\p{N}]+(?:[’'·][\p{L}\p{N}]+)*/gu;

/** Longer than this is a hash, a base64 blob or an address, not a word. */
const MAX_TOKEN = 32;

/**
 * Tokens for one piece of text.
 *
 * Returns them in order and with duplicates, because callers that need
 * positions or counts can collapse them and callers that need a set cannot
 * recover order from one.
 */
export function tokenize(input: string): string[] {
  if (!input) return [];
  const text = input.normalize("NFKC").toLowerCase();
  const out: string[] = [];

  // CJK first: take the runs, emit bigrams, and blank them so the word pass
  // below does not also emit the whole run as a single token.
  let rest = text;
  if (CJK.test(text)) {
    rest = text.replace(CJK_RUN, (run) => {
      if (run.length === 1) {
        out.push(run);
      } else {
        for (let i = 0; i < run.length - 1; i++) out.push(run.slice(i, i + 2));
      }
      return " ";
    });
  }

  for (const m of rest.matchAll(WORD)) {
    const t = m[0];
    // Single Latin letters carry no signal and cost a posting list each.
    if (t.length < 2) continue;
    out.push(t.length > MAX_TOKEN ? t.slice(0, MAX_TOKEN) : t);
  }

  return out;
}

/** Distinct tokens, order preserved. */
export function tokenSet(input: string): string[] {
  return [...new Set(tokenize(input))];
}

/**
 * Strip markdown to the prose a reader would see.
 *
 * Deliberately crude: this feeds a search index, not a renderer. Fenced code,
 * HTML tags, link targets, images and table pipes are removed because matching
 * them produces results a reader cannot see on the page. Link *text* is kept,
 * because that is visible prose.
 */
export function markdownToText(md: string): string {
  return md
    .replace(/^---\n[\s\S]*?\n---\n/, "")        // frontmatter
    .replace(/```[\s\S]*?```/g, " ")             // fenced code
    .replace(/`[^`\n]*`/g, " ")                  // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")       // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")     // links: keep the text
    .replace(/<[^>]+>/g, " ")                    // html
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")          // heading markers
    .replace(/^\s{0,3}>\s?/gm, "")               // blockquote markers
    .replace(/[*_~|]+/g, " ")                    // emphasis, table pipes
    .replace(/\s+/g, " ")
    .trim();
}
