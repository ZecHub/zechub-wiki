// scripts/generate-search-index.mjs
//
// Generates one full-text search index per locale into public/search-index/
// at build time.
//
// Why: site search reads src/constants/searcher.ts, a hand-maintained list of
// 125 entries. The content repo holds 218 curated pages in 18 locales. So a
// page is findable only if somebody remembered to add it to that file, 93 of
// the English pages are not in it, and the other 17 languages have no index at
// all. Nothing in the build notices when the list falls behind.
//
// Design, following scripts/generate-llms-txt.mjs:
//   - ENGLISH costs no network. The previous prebuild step has already written
//     public/llms-full.txt, the concatenated markdown of every markdown-backed
//     page, with each page delimited by "---" and carrying its Source: URL. We
//     parse that. If it is missing (llms-full is itself best-effort and may be
//     skipped) we fall back to fetching, so a skip degrades rather than fails.
//   - LOCALES read translations/<locale>/site/<key> over raw.githubusercontent,
//     the same CDN path src/lib/authAndFetch.ts uses and for the same reason:
//     the contents API is capped at 5,000 requests/hour and this needs ~3,700.
//   - CURATED entries from src/constants/searcher.ts keep their aliases and
//     carry a ranking boost, so hand-tuned results cannot regress.
//   - BEST-EFFORT throughout. A page that fails to read is skipped with a
//     warning; a locale that fails entirely is skipped; the script never fails
//     the build. A missing index degrades search to the curated list, which is
//     exactly today's behaviour.
//
// Run (wired into `prebuild`):  tsx scripts/generate-search-index.mjs
// Must run under tsx: it imports app TypeScript.

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "search-index");
const llmsFull = join(root, "public", "llms-full.txt");

const importTs = (rel) => import(pathToFileURL(join(root, rel)).href);

// Load config from process.env, falling back to a minimal .env.local parse so a
// local build can produce the index without exporting vars by hand.
// process.env always wins; dotenv fills only missing keys. Unquoted values are
// trimmed and stripped of trailing ` # comment`.
//
// Copied verbatim from scripts/generate-llms-txt.mjs, which hit the same
// problem first: prebuild runs before Next loads .env.local. Kept identical on
// purpose — two env parsers that disagree about quoting would fail only in
// somebody else's environment. Worth extracting into a shared module if a
// third script ever needs it.
function loadEnv() {
  const need = ["GITHUB_TOKEN", "OWNER", "REPO", "BRANCH"];
  const env = {};
  for (const k of need) if (process.env[k]) env[k] = process.env[k];
  const dotenv = join(root, ".env.local");
  if (need.some((k) => !env[k]) && existsSync(dotenv)) {
    for (const line of readFileSync(dotenv, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)$/);
      if (!m || env[m[1]]) continue;
      let v = m[2].trim();
      if (/^["']/.test(v)) {
        v = v.replace(/^["']|["']$/g, ""); // quoted: strip quotes, keep as-is
      } else {
        v = v.replace(/\s+#.*$/, "").trim(); // unquoted: drop inline comment
      }
      if (v) env[m[1]] = v;
    }
  }
  return env;
}

const { OWNER, REPO, BRANCH } = loadEnv();
const RAW = "https://raw.githubusercontent.com";
const CONCURRENCY = Number(process.env.SEARCH_INDEX_CONCURRENCY ?? 32);
const FETCH_TIMEOUT_MS = 15_000;

/**
 * Share of the manifest an index must cover to be worth publishing.
 *
 * Best-effort is right per page: one article missing from search beats a failed
 * build. It is wrong for the corpus. A build once produced a llms-full.txt with
 * 3 pages of 218 — its own fetches had failed — and this script dutifully
 * indexed all three and reported success, replacing a complete index with a
 * useless one. Below this floor we write nothing, so whatever is already
 * deployed keeps serving.
 *
 * Generous on purpose: partial translations are normal and expected, and only a
 * collapse should trip this.
 */
const MIN_COVERAGE = 0.5;

/** Budget from the listing's acceptance criteria. Warn, never fail. */
const SIZE_BUDGET_GZIP = 300 * 1024;

const t0 = Date.now();
const warn = (m) => console.warn(`[search-index] ${m}`);
const info = (m) => console.log(`[search-index] ${m}`);

// ---------------------------------------------------------------- fetching

const RETRIES = Number(process.env.SEARCH_INDEX_RETRIES ?? 3);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Read one URL, retrying transients.
 *
 * 404 is final: raw.githubusercontent uses it for "no such path on this ref",
 * which is how a locale without a given translation reports itself. Anything
 * else — reset, timeout, 5xx, 429 — is transient. Treating those as absence
 * silently drops pages from the index, and makes the index depend on network
 * luck during the build rather than on what the content repo contains.
 */
async function fetchText(url) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(250 * 2 ** (attempt - 1));
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { signal: ctl.signal });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.text();
    } catch (err) {
      lastErr = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`${lastErr?.message ?? lastErr} after ${RETRIES + 1} attempts: ${url}`);
}

/** Run jobs with a fixed number in flight. Rejections become nulls. */
async function pooled(items, worker, limit) {
  const out = new Array(items.length);
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      try {
        out[i] = await worker(items[i], i);
      } catch (err) {
        out[i] = null;
        warn(`skipped ${items[i]?.key ?? i}: ${err?.message ?? err}`);
      }
    }
  });
  await Promise.all(runners);
  return out;
}

// ------------------------------------------------------- english from disk

/**
 * Parse public/llms-full.txt into { title, url, markdown } records.
 *
 * Format, set by generate-llms-txt.mjs:
 *   ---\n\n# <title>\nSource: <url>\nMarkdown: <url>.md\n\n<body>
 * The file opens with a contents section; a chunk without a Source: line is
 * that header and is ignored.
 */
export function parseLlmsFull(text) {
  const pages = [];
  for (const chunk of text.split(/\n---\n/)) {
    const m = chunk.match(/^\s*#\s+(.+?)\n\s*Source:\s*(\S+)\s*\n(?:\s*Markdown:\s*\S+\s*\n)?([\s\S]*)$/);
    if (!m) continue;
    const [, title, url, body] = m;
    pages.push({ title: title.trim(), url: url.trim(), markdown: body });
  }
  return pages;
}

/** /start-here/network-upgrades -> Start_Here/Network_Upgrades.md, via the manifest. */
export function urlToManifestKey(url, manifestKeys) {
  const path = url.replace(/^https?:\/\/[^/]+/, "").replace(/\.md$/, "");
  const norm = (s) => s.toLowerCase().replace(/[-_/\s]/g, "");
  const want = norm(path);
  for (const key of manifestKeys) {
    if (norm("/" + key.replace(/\.md$/, "")) === want) return key;
  }
  return null;
}

// ------------------------------------------------------------- index build

/**
 * Build one locale's index.
 *
 * docs      [title, url, lead]           lead is prose for the snippet fallback
 * terms     token -> delta-encoded doc ids
 * titles    token -> delta-encoded doc ids, for tokens in the title
 * aliases   token -> delta-encoded doc ids, from the curated list
 *
 * Doc ids are delta-encoded because they are ascending and small deltas
 * compress far better than absolute ids.
 */
export function buildIndex(locale, pages, curatedByUrl, tokenize, tokenSet, markdownToText) {
  const docs = [];
  const terms = new Map();
  const titles = new Map();
  const aliases = new Map();

  const add = (map, token, id) => {
    let list = map.get(token);
    if (!list) map.set(token, (list = []));
    if (list[list.length - 1] !== id) list.push(id);
  };

  pages.forEach((page) => {
    const text = markdownToText(page.markdown);
    if (!text) return;
    const id = docs.length;
    // Paths, never absolute URLs: the client compares these against the
    // existing results, which are paths, and an origin breaks every match.
    const href = page.url.replace(/^https?:\/\/[^/]+/, "");
    docs.push([page.title, href, text.slice(0, 220)]);

    for (const tk of tokenSet(text)) add(terms, tk, id);
    for (const tk of tokenSet(page.title)) add(titles, tk, id);

    const curated = curatedByUrl.get(page.url.replace(/^https?:\/\/[^/]+/, ""));
    if (curated) {
      for (const alias of [curated.desc ?? "", ...(curated.aliases ?? [])]) {
        for (const tk of tokenSet(alias)) add(aliases, tk, id);
      }
    }
  });

  const encode = (map) => {
    const obj = {};
    for (const [token, ids] of map) {
      const deltas = [];
      let prev = 0;
      for (const id of ids) {
        deltas.push(id - prev);
        prev = id;
      }
      obj[token] = deltas;
    }
    return obj;
  };

  return {
    v: 1,
    locale,
    generated: new Date().toISOString(),
    docs,
    terms: encode(terms),
    titles: encode(titles),
    aliases: encode(aliases),
  };
}

// ------------------------------------------------------------------- main

async function main() {
  const { tokenize, tokenSet, markdownToText } = await importTs("src/lib/search/tokenize.ts");

  // Curated list, keyed by path, so aliases survive into the ranking.
  let curatedByUrl = new Map();
  try {
    const { searcher } = await importTs("src/constants/searcher.ts");
    for (const entry of searcher ?? []) {
      if (entry?.url) curatedByUrl.set(entry.url, entry);
    }
    info(`curated entries: ${curatedByUrl.size}`);
  } catch (err) {
    warn(`curated list unavailable, ranking loses alias boosts: ${err?.message ?? err}`);
  }

  // English, from the file the previous prebuild step already wrote.
  if (!existsSync(llmsFull)) {
    warn("public/llms-full.txt is missing — search index skipped, search falls back to the curated list");
    return;
  }
  const english = parseLlmsFull(readFileSync(llmsFull, "utf8"));
  if (english.length === 0) {
    warn("public/llms-full.txt parsed to zero pages — search index skipped");
    return;
  }
  info(`english pages from llms-full.txt: ${english.length}`);

  // Locale file paths come from the English manifest in the content repo.
  let manifestKeys = [];
  if (OWNER && REPO && BRANCH) {
    try {
      const raw = await fetchText(`${RAW}/${OWNER}/${REPO}/${BRANCH}/translation/menu-titles/en.json`);
      manifestKeys = Object.keys(JSON.parse(raw ?? "{}"));
      info(`manifest keys: ${manifestKeys.length}`);
    } catch (err) {
      warn(`manifest unavailable, localized indexes skipped: ${err?.message ?? err}`);
    }
  } else {
    warn("OWNER/REPO/BRANCH not set, localized indexes skipped");
  }

  // A locale list the app already owns, rather than a second copy of it.
  let locales = ["en"];
  try {
    const { routing } = await importTs("src/i18n/routing.ts");
    if (Array.isArray(routing?.locales)) locales = [...routing.locales];
  } catch (err) {
    warn(`locale list unavailable, English only: ${err?.message ?? err}`);
  }

  // Nothing is removed or written until the corpus looks whole. An index
  // covering a handful of pages is not a degraded index, it is a broken one,
  // and the already-deployed files are a better answer than replacing them.
  if (manifestKeys.length > 0) {
    const coverage = english.length / manifestKeys.length;
    if (coverage < MIN_COVERAGE) {
      warn(
        `only ${english.length} of ${manifestKeys.length} pages parsed ` +
          `(${(coverage * 100).toFixed(0)}%, floor is ${MIN_COVERAGE * 100}%) — ` +
          `refusing to replace the existing index. public/llms-full.txt is ` +
          `probably incomplete; check the generate-llms-txt step above.`,
      );
      return;
    }
  }

  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  const report = [];

  const writeLocale = (locale, pages) => {
    const index = buildIndex(locale, pages, curatedByUrl, tokenize, tokenSet, markdownToText);
    const json = JSON.stringify(index);
    writeFileSync(join(outDir, `${locale}.json`), json);
    const gz = gzipSync(Buffer.from(json)).length;
    report.push({ locale, pages: index.docs.length, bytes: json.length, gzip: gz });
    if (gz > SIZE_BUDGET_GZIP) {
      warn(`${locale}: ${(gz / 1024).toFixed(0)} KB gzipped exceeds the ${SIZE_BUDGET_GZIP / 1024} KB budget`);
    }
  };

  writeLocale("en", english);

  // Map each English page to its manifest key once, then reuse for every locale.
  const keyed = english
    .map((p) => ({ ...p, key: urlToManifestKey(p.url, manifestKeys) }))
    .filter((p) => p.key);
  if (manifestKeys.length && keyed.length < english.length) {
    warn(`${english.length - keyed.length} english page(s) had no manifest key and are English-only`);
  }

  for (const locale of locales) {
    if (locale === "en" || keyed.length === 0) continue;
    const got = await pooled(
      keyed,
      async (p) => {
        const md = await fetchText(
          `${RAW}/${OWNER}/${REPO}/${BRANCH}/translations/${locale}/site/${p.key}`,
        );
        return md ? { title: p.title, url: `/${locale}${p.url.replace(/^https?:\/\/[^/]+/, "")}`, markdown: md } : null;
      },
      CONCURRENCY,
    );
    const pages = got.filter(Boolean);
    if (pages.length === 0) {
      warn(`${locale}: no translated pages found, skipped`);
      continue;
    }
    writeLocale(locale, pages);
  }

  writeFileSync(
    join(outDir, "manifest.json"),
    JSON.stringify({ v: 1, generated: new Date().toISOString(), locales: report }),
  );

  const total = report.reduce((a, r) => a + r.gzip, 0);
  info(
    `wrote ${report.length} locale index(es), ${report.reduce((a, r) => a + r.pages, 0)} pages, ` +
      `${(total / 1024).toFixed(0)} KB gzipped total, in ${((Date.now() - t0) / 1000).toFixed(1)}s`,
  );
  for (const r of report) {
    const cov = manifestKeys.length ? ` ${((r.pages / manifestKeys.length) * 100).toFixed(0)}%` : "";
    info(`  ${r.locale.padEnd(3)} ${String(r.pages).padStart(4)} pages${cov.padStart(5)}  ${(r.gzip / 1024).toFixed(0).padStart(4)} KB gzipped`);
  }
}

// Run only when executed, not when imported: scripts/check-search-index.mjs
// imports parseLlmsFull and buildIndex to exercise the pipeline against a
// fixture, and must not generate 19 locales as a side effect of loading them.
const executedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (executedDirectly) {
  main().catch((err) => {
    // Never fail the build. Search degrades to the curated list.
    warn(`failed, search falls back to the curated list: ${err?.stack ?? err}`);
  });
}
