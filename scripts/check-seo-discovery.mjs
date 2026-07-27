// SEO / LLM-discovery anti-drift gate (imports the real Phase 1-5 modules; the
// deterministic checks run with NO secrets and can fail CI).
//
// Guards the discovery surface built in Phases 1-5 (llms.txt, robots, sitemap,
// canonical/hreflang resolvers) against a silent regression — a shrunk index, a
// dropped AI crawler, a leaked /dao path, a broken resolver. It IMPORTS the
// actual app modules (never regex) so an assertion tracks real behaviour.
//
// Two-tier by design, so it is robust in CI without secrets:
//   - DETERMINISTIC checks (llms.txt structure, robots rules, sitemap shape,
//     resolver sanity) need no network and ALWAYS run — they fail the build.
//   - The one NETWORK-dependent check (content-repo manifest health) only runs
//     when GITHUB_TOKEN + OWNER + REPO + BRANCH are all present; a transient
//     fetch failure is a logged SKIP, never a hard failure. A secretless run
//     still performs every structural check.
//
// NB on the sitemap count: sitemap() called from a standalone script always
// takes its SITE_LINKS + English fallback, because getMenuTitlesCached is
// wrapped in Next's unstable_cache and throws outside the Next runtime. So the
// "real content > 100 pages" signal is asserted by fetching the English
// menu-titles manifest directly (the same host/path the generator uses), which
// is what actually catches manifest breakage in a credentialed CI run.
//
// Run: node_modules/.bin/tsx scripts/check-seo-discovery.mjs

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const importTs = (rel) => import(pathToFileURL(join(root, rel)).href);

const BASE = "https://zechub.wiki";
const LLMS_LINK_THRESHOLD = 40; // safely below current ~65 — real shrinkage trips it, edits don't
const MANIFEST_PAGE_THRESHOLD = 100; // healthy English manifest carries ~180-195 pages

// The AI crawlers robots.ts MUST name. Hard-coded here (not imported from
// robots.ts) on purpose: importing robots' own list would let a deletion pass
// vacuously. This is the independent contract the gate enforces.
const REQUIRED_AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Bingbot",
  "Amazonbot",
  "Applebot-Extended",
  "Bytespider",
];

// --- assertion plumbing ------------------------------------------------------

const failures = [];
const fail = (msg) => failures.push(msg);
const assert = (cond, msg) => {
  if (!cond) fail(msg);
};
const arr = (v) => (Array.isArray(v) ? v : v == null ? [] : [v]); // robots allow/disallow/userAgent may be scalar or array
const hasDao = (s) => typeof s === "string" && /(^|\/)dao($|\/)/.test(s); // /dao or any …/dao segment

// ==== 1. llms.txt structure ==================================================
// Invoke the real generator (its index is pure/no-network) then assert on the
// emitted public/llms.txt — no re-implementation, so it can't drift.

function checkLlmsTxt() {
  const before = failures.length;
  const out = join(root, "public", "llms.txt");
  const tsxBin = join(root, "node_modules", ".bin", "tsx");
  const gen = existsSync(tsxBin)
    ? spawnSync(tsxBin, ["scripts/generate-llms-txt.mjs"], { cwd: root, encoding: "utf8" })
    : spawnSync(process.execPath, ["--import", "tsx", "scripts/generate-llms-txt.mjs"], { cwd: root, encoding: "utf8" });
  if (gen.status !== 0) {
    fail(`llms.txt: generator exited ${gen.status} (expected 0) — ${(gen.stderr || "").trim().split("\n").pop()}`);
    return;
  }
  if (!existsSync(out)) {
    fail(`llms.txt: generator did not write ${out}`);
    return;
  }
  const text = readFileSync(out, "utf8");
  const lines = text.split("\n");

  assert(text.startsWith("# ZecHub"), `llms.txt: expected to begin with "# ZecHub", found ${JSON.stringify(lines[0])}`);
  assert(lines.some((l) => l.startsWith("> ")), `llms.txt: expected a ">" blockquote summary line, none found`);
  const sections = lines.filter((l) => l.startsWith("## "));
  assert(sections.length >= 1, `llms.txt: expected at least one "## " section, found ${sections.length}`);

  const linkLines = lines.filter((l) => /^- \[.*\]\(.*\)\s*$/.test(l));
  assert(
    linkLines.length >= LLMS_LINK_THRESHOLD,
    `llms.txt: expected >= ${LLMS_LINK_THRESHOLD} index links, found ${linkLines.length} — the curated index may have shrunk`,
  );

  // Every index link must be an absolute https://zechub.wiki/... URL, and none
  // may point at the excluded /dao section.
  const nonAbsolute = [];
  const daoLinks = [];
  for (const l of linkLines) {
    const m = /\]\((.*?)\)\s*$/.exec(l);
    const url = m ? m[1] : "";
    if (!url.startsWith(`${BASE}/`)) nonAbsolute.push(url || l);
    else if (hasDao(url.slice(BASE.length))) daoLinks.push(url);
  }
  assert(
    nonAbsolute.length === 0,
    `llms.txt: ${nonAbsolute.length} link(s) are not absolute ${BASE}/ URLs, e.g. ${JSON.stringify(nonAbsolute[0])}`,
  );
  assert(daoLinks.length === 0, `llms.txt: ${daoLinks.length} link(s) point at excluded /dao, e.g. ${JSON.stringify(daoLinks[0])}`);

  if (failures.length === before)
    console.log(`  [1] llms.txt: ${sections.length} sections, ${linkLines.length} links, all absolute, no /dao.`);
}

// ==== 2. robots ==============================================================

async function checkRobots() {
  const before = failures.length;
  const mod = await importTs("src/app/robots.ts");
  assert(typeof mod.default === "function", `robots: default export is not a function (got ${typeof mod.default})`);
  if (typeof mod.default !== "function") return;
  const r = mod.default();

  assert(Array.isArray(r.rules), `robots: .rules is not an array`);
  const rules = arr(r.rules);

  // Match a rule by user-agent (userAgent may itself be a string or array).
  const ruleFor = (ua) => rules.find((rule) => arr(rule.userAgent).includes(ua));

  // The ONLY disallows any group may carry. An extra entry (e.g. "/using-zcash")
  // would silently deindex real content, so assert the set exactly — required
  // entries present AND nothing beyond them (additive-sabotage guard).
  const ALLOWED_DISALLOWS = ["/dao", "/*/dao"];
  const checkDisallows = (label, disallow) => {
    const set = arr(disallow);
    for (const d of ALLOWED_DISALLOWS)
      assert(set.includes(d), `robots: ${label} rule must Disallow ${JSON.stringify(d)}, got ${JSON.stringify(disallow)}`);
    const extra = set.filter((d) => !ALLOWED_DISALLOWS.includes(d));
    assert(
      extra.length === 0,
      `robots: ${label} rule Disallows path(s) beyond ${JSON.stringify(ALLOWED_DISALLOWS)} — real content would be blocked: ${JSON.stringify(extra)}`,
    );
  };

  const wildcard = ruleFor("*");
  if (!wildcard) {
    fail(`robots: no "*" catch-all rule found`);
  } else {
    assert(arr(wildcard.allow).includes("/"), `robots: "*" rule must Allow "/", got ${JSON.stringify(wildcard.allow)}`);
    checkDisallows(`"*"`, wildcard.disallow);
  }

  for (const ua of REQUIRED_AI_CRAWLERS) {
    const rule = ruleFor(ua);
    if (!rule) {
      fail(`robots: required AI crawler ${JSON.stringify(ua)} is missing a named rule`);
      continue;
    }
    assert(arr(rule.allow).includes("/"), `robots: ${ua} rule must Allow "/", got ${JSON.stringify(rule.allow)}`);
    checkDisallows(ua, rule.disallow);
  }

  assert(
    r.sitemap === `${BASE}/sitemap.xml`,
    `robots: sitemap must be ${JSON.stringify(`${BASE}/sitemap.xml`)}, got ${JSON.stringify(r.sitemap)}`,
  );

  if (failures.length === before)
    console.log(`  [2] robots: "*" + ${REQUIRED_AI_CRAWLERS.length} named AI crawlers, all Disallow /dao + /*/dao (and nothing more), sitemap OK.`);
}

// ==== 3. sitemap sanity ======================================================
// Structural checks always run (sitemap() is deterministic from a script — it
// takes the SITE_LINKS + English fallback, which still exercises URL shape,
// /dao exclusion, and reciprocal homepage alternates). The content-count signal
// is a credentialed-only direct manifest fetch (see header note).

async function checkSitemap() {
  const before = failures.length;
  const credsPresent = Boolean(process.env.GITHUB_TOKEN && process.env.OWNER && process.env.REPO && process.env.BRANCH);
  console.log(`  [3] sitemap: running in ${credsPresent ? "CREDENTIALED" : "SECRETLESS"} mode.`);

  const mod = await importTs("src/app/sitemap.ts");
  assert(typeof mod.default === "function", `sitemap: default export is not a function (got ${typeof mod.default})`);
  if (typeof mod.default !== "function") return;
  const entries = await mod.default();

  assert(Array.isArray(entries), `sitemap: default() did not return an array (got ${typeof entries})`);
  if (!Array.isArray(entries)) return;
  assert(entries.length > 0, `sitemap: returned an empty array`);

  let badUrl = null;
  let badAltUrl = null;
  let daoHit = null;
  let missingXDefault = null;
  let reciprocalCount = 0;
  for (const e of entries) {
    if (typeof e.url !== "string" || !e.url.startsWith(BASE)) badUrl ??= e.url;
    if (hasDao(e.url?.slice(BASE.length))) daoHit ??= e.url;
    const langs = e.alternates?.languages;
    if (langs && typeof langs === "object") {
      const keys = Object.keys(langs);
      if (!keys.includes("x-default")) missingXDefault ??= e.url;
      for (const v of Object.values(langs)) {
        if (typeof v !== "string" || !v.startsWith(BASE)) badAltUrl ??= v;
        if (hasDao(typeof v === "string" ? v.slice(BASE.length) : v)) daoHit ??= v;
      }
      if (keys.filter((k) => k !== "x-default").length > 1) reciprocalCount++;
    }
  }
  assert(badUrl === null, `sitemap: entry url is not a ${BASE} absolute URL, e.g. ${JSON.stringify(badUrl)}`);
  assert(badAltUrl === null, `sitemap: an alternates.languages href is not a ${BASE} absolute URL, e.g. ${JSON.stringify(badAltUrl)}`);
  assert(daoHit === null, `sitemap: a url or alternate points at excluded /dao: ${JSON.stringify(daoHit)}`);
  assert(missingXDefault === null, `sitemap: an alternates.languages set omits "x-default": ${JSON.stringify(missingXDefault)}`);
  assert(
    reciprocalCount >= 1,
    `sitemap: expected >= 1 entry with a reciprocal multi-locale alternate set, found ${reciprocalCount}`,
  );

  if (failures.length === before)
    console.log(`  [3] sitemap: ${entries.length} entries, all ${BASE} absolute (urls + alternates), no /dao, ${reciprocalCount} reciprocal multi-locale set(s).`);

  // Credentialed-only: prove the content-repo English manifest is reachable and
  // healthy (> threshold pages). Direct raw fetch — same repo/branch the app
  // uses — because sitemap() itself can't reach the manifest outside Next.
  if (!credsPresent) {
    console.log(`  [3] sitemap: SKIP manifest-health check (no content creds).`);
    return;
  }
  const { OWNER, REPO, BRANCH, GITHUB_TOKEN } = process.env;
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/translation/menu-titles/en.json`;

  // Only genuine network faults (fetch throwing, timeout/AbortError, a body that
  // never arrives) may SKIP. Anything past a received 200 — a bad JSON body or a
  // non-object/empty shape — is REAL manifest breakage and must fail the build,
  // so parse + shape validation live OUTSIDE this try.
  let res, body;
  try {
    res = await fetch(url, {
      headers: { "User-Agent": "zechub-seo-check", Authorization: `token ${GITHUB_TOKEN}` },
      signal: AbortSignal.timeout(15_000),
    });
    body = await res.text();
  } catch (err) {
    // Transient network error (timeout/DNS/reset) — SKIP, don't fail flakily.
    console.log(`  [3] sitemap: SKIP manifest-health check — transient fetch error: ${err.message}`);
    return;
  }

  if (!res.ok) {
    // A definite HTTP error on a credentialed run = real manifest breakage.
    fail(`sitemap: content manifest fetch returned HTTP ${res.status} for ${OWNER}/${REPO}@${BRANCH} — manifest path may be broken`);
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    // 200 with an unparseable body is breakage, not a transient fetch error.
    fail(`sitemap: content manifest returned HTTP 200 but body is not valid JSON for ${OWNER}/${REPO}@${BRANCH} — ${err.message}`);
    return;
  }

  const isPlainObject = parsed && typeof parsed === "object" && !Array.isArray(parsed);
  if (!isPlainObject) {
    fail(`sitemap: content manifest for ${OWNER}/${REPO}@${BRANCH} is not a JSON object (got ${Array.isArray(parsed) ? "array" : typeof parsed}) — manifest shape is broken`);
    return;
  }
  const pageCount = Object.keys(parsed).length;
  assert(
    pageCount > MANIFEST_PAGE_THRESHOLD,
    `sitemap: English manifest has ${pageCount} pages (expected > ${MANIFEST_PAGE_THRESHOLD}) for ${OWNER}/${REPO}@${BRANCH} — manifest may be truncated/broken`,
  );
  if (pageCount > MANIFEST_PAGE_THRESHOLD)
    console.log(`  [3] sitemap: content manifest healthy — ${pageCount} pages (${OWNER}/${REPO}@${BRANCH}).`);
}

// ==== 4. resolver sanity =====================================================

async function checkResolvers() {
  const before = failures.length;
  const { resolveContentPath } = await importTs("src/lib/helpers.ts");
  const { buildAlternates, keyToWikiPath } = await importTs("src/lib/localeCoverage.ts");
  assert(typeof resolveContentPath === "function", `resolvers: resolveContentPath is not exported as a function`);
  assert(typeof buildAlternates === "function", `resolvers: buildAlternates is not exported as a function`);
  assert(typeof keyToWikiPath === "function", `resolvers: keyToWikiPath is not exported as a function`);
  if (typeof resolveContentPath !== "function" || typeof buildAlternates !== "function" || typeof keyToWikiPath !== "function") return;

  // keyToWikiPath is the PURE manifest-key → served-URL-path transform. The
  // sitemap's per-page hreflang coverage and buildAlternates both resolve
  // paths through it, but neither can be exercised end-to-end in secretless CI
  // (sitemap()'s manifest branch is credentialed). Pin it directly against real
  // manifest keys whose served URLs are known-good (verified HTTP 200 on the
  // live site) — an acronym + nested path in each so a botched lowercase or
  // underscore→hyphen rewrite trips the gate.
  const keyCases = [
    ["Using_Zcash/Buying_ZEC.md", "/using-zcash/buying-zec"],
    ["Glossary_and_FAQs/FAQ.md", "/glossary-and-faqs/faq"],
    ["Privacy_Tools/PGP_Encryption.md", "/privacy-tools/pgp-encryption"],
  ];
  for (const [key, expected] of keyCases) {
    let got;
    try {
      got = keyToWikiPath(key);
    } catch (err) {
      fail(`resolvers: keyToWikiPath(${JSON.stringify(key)}) threw: ${err.message}`);
      continue;
    }
    assert(
      got === expected,
      `resolvers: keyToWikiPath(${JSON.stringify(key)}) = ${JSON.stringify(got)} (expected ${JSON.stringify(expected)}) — manifest→URL transform drifted`,
    );
  }

  // A plain content slug and a nested research slug (the two branches).
  const cases = [
    ["using-zcash", "buying-zec"],
    ["research", "zcash-foundations-series", "an-article"],
  ];
  for (const slug of cases) {
    let p;
    try {
      p = resolveContentPath(slug);
    } catch (err) {
      fail(`resolvers: resolveContentPath(${JSON.stringify(slug)}) threw: ${err.message}`);
      continue;
    }
    assert(
      typeof p === "string" && p.includes("site/") && /\.md$/i.test(p),
      `resolvers: resolveContentPath(${JSON.stringify(slug)}) produced malformed path ${JSON.stringify(p)} (expected a site/…​.md path)`,
    );
  }

  let alt;
  try {
    alt = buildAlternates("/using-zcash/buying-zec", "en", ["en", "it", "es"]);
  } catch (err) {
    fail(`resolvers: buildAlternates(...) threw: ${err.message}`);
    alt = null;
  }
  if (alt) {
    assert(
      typeof alt.canonical === "string" && alt.canonical.startsWith(BASE),
      `resolvers: buildAlternates canonical is not a ${BASE} URL: ${JSON.stringify(alt.canonical)}`,
    );
    const langs = alt.languages ?? {};
    assert(Object.keys(langs).includes("x-default"), `resolvers: buildAlternates languages omits "x-default": ${JSON.stringify(Object.keys(langs))}`);
    const badLang = Object.values(langs).find((u) => typeof u !== "string" || !u.startsWith(BASE));
    assert(badLang === undefined, `resolvers: buildAlternates emitted a non-${BASE} alternate URL: ${JSON.stringify(badLang)}`);
  }

  if (failures.length === before)
    console.log(`  [4] resolvers: resolveContentPath + buildAlternates + keyToWikiPath produce well-formed paths/urls.`);
}

// --- run ---------------------------------------------------------------------

console.log("Checking SEO / LLM-discovery surface (Phases 1-5)…");
checkLlmsTxt();
await checkRobots();
await checkSitemap();
await checkResolvers();

if (failures.length > 0) {
  console.error(`\nSEO discovery check FAILED — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nSEO discovery check OK — llms.txt index, robots AI-crawler rules, sitemap shape, and canonical/hreflang resolvers all intact.`);
