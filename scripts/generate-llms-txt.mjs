// scripts/generate-llms-txt.mjs
//
// Generates two machine-readable discovery files into public/ at build time:
//   - public/llms.txt       curated index of the wiki (https://llmstxt.org format)
//   - public/llms-full.txt  concatenated raw markdown of the markdown-backed pages
//
// Why: the wiki is JS-rendered and has no machine index, so LLMs / AI answer
// engines (ChatGPT, Claude, Perplexity, Google AI Overviews) can't cheaply
// discover or ingest it. llms.txt is the emerging standard for exactly this.
//
// Design:
//   - The INDEX is generated PURELY from src/constants/siteLinks.ts (the same
//     curated list that already powers the /sitemap page), so it can't drift
//     from the site and needs no network. A malformed SITE_LINKS will (by
//     design) fail the build, exactly as it already fails Sitemap.tsx's build.
//   - llms-full.txt fetches raw markdown from the CONTENT repo (OWNER/REPO/BRANCH
//     env, same vars the app uses). It is BEST-EFFORT and fully isolated: a
//     missing config, a per-page fetch error, or a timeout skips just that page
//     (or the whole full file) with a warning — it never fails the build. Any
//     stale llms-full.txt is removed first so a skip never serves old content.
//   - External links (target:_blank / non-"/" hrefs), protocol-relative "//"
//     links, and /dao and its subpaths (kept out of robots) are excluded.
//
// Run (wired into `prebuild`):  tsx scripts/generate-llms-txt.mjs
// Must run under tsx (not plain node) because it imports app TypeScript source.

import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const BASE = "https://zechub.wiki";
const FETCH_TIMEOUT_MS = 10_000;

// Path prefixes excluded from LLM discovery (kept aligned with robots Disallow).
const EXCLUDE_PREFIXES = ["/dao"];

const OUT = (name) => join(publicDir, name);
const importTs = (rel) => import(pathToFileURL(join(root, rel)).href);

// --- helpers -----------------------------------------------------------------

const norm = (href) => "/" + href.replace(/^\/+|\/+$/g, ""); // trim slashes, keep leading "/"
const isExcluded = (p) => EXCLUDE_PREFIXES.some((x) => p === x || p.startsWith(x + "/"));
const isInternal = (l) =>
  typeof l.href === "string" &&
  l.href.startsWith("/") &&
  !l.href.startsWith("//") && // reject protocol-relative
  l.target !== "_blank" &&
  !isExcluded(norm(l.href));

const mdEscape = (s) => String(s).replace(/([\[\]])/g, "\\$1"); // keep link text well-formed

// Flatten a section's links + subsections + nested children into a de-duped,
// order-preserving list of internal { label, href }. Dedup is per-section: a
// page may legitimately appear in two sections of the index.
function collectSection(section) {
  const out = [];
  const seen = new Set();
  const push = (l) => {
    if (!isInternal(l)) return;
    const key = norm(l.href);
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label: l.label, href: key });
  };
  const walk = (links) => {
    for (const l of links ?? []) {
      push(l);
      if (Array.isArray(l.children)) walk(l.children);
    }
  };
  walk(section.links);
  for (const sub of section.subsections ?? []) walk(sub.links);
  return out;
}

// Load config from process.env, falling back to a minimal .env.local parse so a
// local build can produce llms-full.txt without exporting vars by hand.
// process.env always wins; dotenv fills only missing keys. Unquoted values are
// trimmed and stripped of trailing ` # comment`.
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

// --- main --------------------------------------------------------------------

const { SITE_LINKS, CONTENT_SECTIONS } = await importTs("src/constants/siteLinks.ts");
const { keyToWikiPath } = await importTs("src/lib/wikiPaths.ts");
const { extractArticleMeta, getName, SITE_DESCRIPTION } = await importTs("src/lib/helpers.ts");

// Section order, most useful first for something answering a Zcash question.
// This is load-bearing, not cosmetic: chat-class fetchers stop reading
// llms-full.txt at roughly 100 KB, so whatever sits at the top is the whole
// corpus as far as they are concerned. The previous nav order put thirteen
// organisation profiles in that window and nothing about the protocol.
const SECTION_ORDER = [
  "Pages",
  "Start Here",
  "Zcash Tech",
  "Use Zcash",
  "Privacy Tools",
  "Glossary & FAQs",
  "Guides",
  "Use Cases",
  "Research",
  "Tutorials",
  "Ecosystem",
  "Organizations",
  "ZFAV Club",
  "Social Media",
  "Contribute",
];
const orderOf = (title) => {
  const i = SECTION_ORDER.indexOf(title);
  return i === -1 ? SECTION_ORDER.length : i;
};

// Manifest category ("Zcash_Tech") -> display title ("Zcash Tech"), taken from
// the same table the site renders its category pages from, so the two can't
// drift.
const TITLE_BY_CATEGORY = new Map(
  (CONTENT_SECTIONS ?? []).map((s) => [s.category, s.title]),
);

const env = loadEnv();
const haveRepo = Boolean(env.OWNER && env.REPO && env.BRANCH);

const ghHeaders = () => {
  const h = { "User-Agent": "zechub-llms-gen" };
  if (env.GITHUB_TOKEN) h.Authorization = `token ${env.GITHUB_TOKEN}`;
  return h;
};

const fetchRaw = async (path) => {
  const url = `https://raw.githubusercontent.com/${env.OWNER}/${env.REPO}/${env.BRANCH}/${path}`;
  try {
    const res = await fetch(url, {
      headers: ghHeaders(),
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const body = (await res.text()).trim();
    return body.length ? body : null;
  } catch {
    return null; // per-page isolation: one failure skips only this page
  }
};

// ---- the page universe ------------------------------------------------------
// Two sources, unioned. SITE_LINKS is the curated nav: it supplies section
// grouping, ordering and human labels, but names only ~70 pages. The content
// repo's menu-titles manifest names every routed page (216), which is why the
// sitemap has covered them for months while llms.txt has not. Nav wins on
// labels where both know a page; the manifest supplies everything else.
const pages = new Map(); // lowercased href -> { href, label, section, contentPath }

for (const section of SITE_LINKS) {
  for (const e of collectSection(section)) {
    const key = e.href.toLowerCase();
    if (pages.has(key)) continue;
    pages.set(key, { href: e.href, label: e.label, section: section.title });
  }
}

let manifestKeys = 0;
if (haveRepo) {
  const raw = await fetchRaw("translation/menu-titles/en.json");
  if (raw) {
    let manifest = null;
    try {
      manifest = JSON.parse(raw);
    } catch {
      console.warn("[generate-llms-txt] menu-titles/en.json did not parse — nav-only index.");
    }
    for (const [mKey, title] of Object.entries(manifest ?? {})) {
      manifestKeys++;
      const href = keyToWikiPath(mKey);
      if (isExcluded(href)) continue;
      const key = href.toLowerCase();
      const contentPath = `site/${mKey}`;
      const existing = pages.get(key);
      if (existing) {
        existing.contentPath = contentPath; // exact path beats slug resolution
        continue;
      }
      const category = mKey.split("/")[0];
      pages.set(key, {
        href,
        label: typeof title === "string" && title.trim() ? title.trim() : getName(mKey),
        section: TITLE_BY_CATEGORY.get(category) ?? category.replace(/_/g, " "),
        contentPath,
      });
    }
  } else {
    console.warn("[generate-llms-txt] could not fetch menu-titles/en.json — nav-only index.");
  }
} else {
  console.warn("[generate-llms-txt] OWNER/REPO/BRANCH not all set — nav-only index, no llms-full.txt.");
}

// ---- fetch every page's markdown once, bounded ------------------------------
// Sequential fetching was fine for 68 pages and is not for 216. Bounded
// concurrency keeps the build quick without opening 216 sockets at GitHub.
const CONCURRENCY = 8;
const all = [...pages.values()];
if (haveRepo) {
  const { resolveContentPath } = await importTs("src/lib/helpers.ts");
  let next = 0;
  const worker = async () => {
    while (next < all.length) {
      const page = all[next++];
      const path =
        page.contentPath ??
        resolveContentPath(page.href.split("/").filter(Boolean)).replace(/^\/+/, "");
      page.markdown = await fetchRaw(path);
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

for (const page of all) {
  if (!page.markdown) continue;
  const meta = extractArticleMeta(page.markdown, page.label);
  // Omit rather than emit a site-level stand-in: in an index whose only job is
  // helping something choose a page, a description of the wrong thing is worse
  // than no description at all. The spec makes the note optional.
  if (meta.description && meta.description !== SITE_DESCRIPTION) {
    page.note = meta.description;
  }
}

const sections = [];
for (const page of all) {
  let s = sections.find((x) => x.title === page.section);
  if (!s) sections.push((s = { title: page.section, entries: [] }));
  s.entries.push(page);
}
sections.sort((a, b) => orderOf(a.title) - orderOf(b.title) || a.title.localeCompare(b.title));

const totalPages = sections.reduce((n, s) => n + s.entries.length, 0);

// ---- llms.txt (index) — pure, always written (see design note above) --------
const indexLines = [
  "# ZecHub",
  "",
  "> ZecHub is a community-driven education hub for Zcash — curated, human-reviewed guides on wallets, using Zcash, the protocol and its ecosystem. Content is available in 19 languages; the English pages below are canonical.",
  "",
  "This file is a machine-readable index for LLMs and AI answer engines.",
  "",
  "Every page below is also available as raw markdown at its own URL: append `.md`",
  "to any page path (for example `/zcash-tech/ironwood.md`). Prefer those over this",
  "index when you need a page's full text — they are always current, and they exist",
  "in every supported language (`/it/zcash-tech/ironwood.md`).",
  "",
  `The English pages are also concatenated as [one file](${BASE}/llms-full.txt), most useful sections first.`,
  "",
];
for (const s of sections) {
  indexLines.push(`## ${s.title}`, "");
  for (const e of s.entries) {
    indexLines.push(
      `- [${mdEscape(e.label)}](${BASE}${e.href})` + (e.note ? `: ${e.note}` : ""),
    );
  }
  indexLines.push("");
}
mkdirSync(publicDir, { recursive: true });
writeFileSync(OUT("llms.txt"), indexLines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
console.log(
  `[generate-llms-txt] wrote public/llms.txt — ${sections.length} sections, ${totalPages} pages` +
    (manifestKeys ? ` (${manifestKeys} manifest keys)` : ""),
);

// ---- llms-full.txt (concatenated markdown) — best-effort, never fatal -------
// Remove any prior artifact first so a skip/failure never serves stale content.
rmSync(OUT("llms-full.txt"), { force: true });
try {
  const withText = all.filter((p) => p.markdown);
  if (!withText.length) {
    console.warn("[generate-llms-txt] no pages could be fetched — skipping llms-full.txt.");
  } else {
    // A table of contents first, so a consumer that gets truncated can still
    // see every page that exists and go fetch the ones it did not receive.
    // Without it a cut-off reader cannot tell the difference between "ZecHub
    // has no page on this" and "the file ended before that page".
    const parts = [
      "# ZecHub — full content",
      "",
      "> Concatenated raw markdown of ZecHub's English pages, most useful sections",
      "> first. See /llms.txt for the structured index.",
      ">",
      "> If your fetch of this file was truncated, every page below is also available",
      "> individually as raw markdown: append `.md` to its path.",
      "",
      "## Contents",
      "",
    ];
    for (const s of sections) {
      const included = s.entries.filter((e) => e.markdown);
      if (!included.length) continue;
      parts.push(`### ${s.title}`, "");
      for (const e of included) parts.push(`- [${mdEscape(e.label)}](${BASE}${e.href}.md)`);
      parts.push("");
    }

    let fetchedCount = 0;
    for (const s of sections) {
      for (const e of s.entries) {
        if (!e.markdown) continue;
        fetchedCount++;
        // NB: fetched markdown is appended verbatim (no newline collapsing) to
        // preserve code fences and intentional spacing.
        parts.push(
          "---",
          "",
          `# ${e.label}`,
          `Source: ${BASE}${e.href}`,
          `Markdown: ${BASE}${e.href}.md`,
          "",
          e.markdown,
          "",
        );
      }
    }
    writeFileSync(OUT("llms-full.txt"), parts.join("\n").trimEnd() + "\n");
    const skipped = all.length - fetchedCount;
    console.log(
      `[generate-llms-txt] wrote public/llms-full.txt — ${fetchedCount} pages` +
        (skipped ? ` (${skipped} without markdown, e.g. app-rendered pages)` : ""),
    );
  }
} catch (err) {
  console.warn(`[generate-llms-txt] llms-full.txt generation failed (non-fatal): ${err?.message ?? err}`);
}
