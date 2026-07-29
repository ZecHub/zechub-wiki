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

const { SITE_LINKS } = await importTs("src/constants/siteLinks.ts");

const sections = SITE_LINKS.map((s) => ({
  title: s.title,
  entries: collectSection(s),
})).filter((s) => s.entries.length > 0);

const totalPages = sections.reduce((n, s) => n + s.entries.length, 0);

// ---- llms.txt (index) — pure, always written (see design note above) --------
const indexLines = [
  "# ZecHub",
  "",
  "> ZecHub is a community-driven education hub for Zcash — curated, human-reviewed guides on wallets, using Zcash, the protocol and its ecosystem. Content is available in 19 languages; the English pages below are canonical.",
  "",
  "This file is a machine-readable index for LLMs and AI answer engines. The full text of these pages is also available concatenated as raw markdown at /llms-full.txt.",
  "",
];
for (const s of sections) {
  indexLines.push(`## ${s.title}`, "");
  for (const e of s.entries) {
    indexLines.push(`- [${mdEscape(e.label)}](${BASE}${e.href})`);
  }
  indexLines.push("");
}
mkdirSync(publicDir, { recursive: true });
writeFileSync(OUT("llms.txt"), indexLines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n");
console.log(`[generate-llms-txt] wrote public/llms.txt — ${sections.length} sections, ${totalPages} pages`);

// ---- llms-full.txt (concatenated markdown) — best-effort, never fatal -------
// Remove any prior artifact first so a skip/failure never serves stale content.
rmSync(OUT("llms-full.txt"), { force: true });
try {
  const env = loadEnv();
  if (!env.OWNER || !env.REPO || !env.BRANCH) {
    console.warn(
      "[generate-llms-txt] OWNER/REPO/BRANCH not all set — skipping llms-full.txt (index still generated).",
    );
  } else {
    // slug -> content path uses the app's own resolver so casing/acronyms match
    // AND research-series articles resolve to their real (one-folder-deeper,
    // case-preserving) path — see resolveContentPath's parity note.
    const { resolveContentPath } = await importTs("src/lib/helpers.ts");

    const fetchMd = async (href) => {
      const slug = href.split("/").filter(Boolean);
      if (slug.length === 0) return null; // homepage has no markdown source
      const path = resolveContentPath(slug).replace(/^\/+/, ""); // "site/Cat/File.md"
      const url = `https://raw.githubusercontent.com/${env.OWNER}/${env.REPO}/${env.BRANCH}/${path}`;
      const headers = { "User-Agent": "zechub-llms-gen" };
      if (env.GITHUB_TOKEN) headers.Authorization = `token ${env.GITHUB_TOKEN}`; // optional (repo is public)
      try {
        const res = await fetch(url, { headers, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
        if (!res.ok) return null;
        const body = (await res.text()).trim();
        return body.length ? body : null;
      } catch {
        return null; // per-page isolation: one failure/timeout skips only this page
      }
    };

    const parts = [
      "# ZecHub — full content",
      "",
      "> Concatenated raw markdown of ZecHub's curated English pages, for direct ingestion by LLMs. See /llms.txt for the structured index.",
      "",
    ];
    const processed = new Set(); // global dedup: a page in two sections is handled once
    let fetchedCount = 0;
    const skipped = [];
    for (const s of sections) {
      for (const e of s.entries) {
        if (processed.has(e.href)) continue;
        processed.add(e.href);
        const md = await fetchMd(e.href);
        if (!md) {
          skipped.push(e.href);
          continue;
        }
        fetchedCount++;
        // NB: fetched markdown is appended verbatim (no newline collapsing) to
        // preserve code fences and intentional spacing.
        parts.push("---", "", `# ${e.label}`, `Source: ${BASE}${e.href}`, "", md, "");
      }
    }
    if (fetchedCount > 0) {
      writeFileSync(OUT("llms-full.txt"), parts.join("\n").trimEnd() + "\n");
      console.log(
        `[generate-llms-txt] wrote public/llms-full.txt — ${fetchedCount} pages` +
          (skipped.length ? ` (skipped ${skipped.length}: ${skipped.join(", ")})` : ""),
      );
    } else {
      console.warn("[generate-llms-txt] no pages could be fetched — skipping llms-full.txt.");
    }
  }
} catch (err) {
  console.warn(`[generate-llms-txt] llms-full.txt generation failed (non-fatal): ${err?.message ?? err}`);
}
