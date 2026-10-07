// scripts/check-search-index.mjs
//
// Anti-drift gate for site search, modelled on scripts/check-seo-discovery.mjs.
// It IMPORTS the real modules rather than matching on text, and fails a PR that
// silently degrades search: a tokenizer that stops splitting CJK, a ranking
// change that buries curated results, or an index that outgrows its budget.
//
// Two tiers, the same split seo-discovery uses:
//
//   STRUCTURAL (always, no network, no secrets)
//     Builds an index from a fixture corpus and asserts the contract: pages are
//     findable by body text, curated aliases outrank plain body matches, CJK is
//     split into bigrams, postings decode to the documents they came from, and
//     the generated shape is what the client expects.
//
//   CONTENT REPO (only when OWNER/REPO/BRANCH are set)
//     Generates the real per-locale indexes and enforces the gzipped size
//     budget on each. Skipped silently otherwise, so forks and PRs from
//     contributors without repo-vars still get the structural tier.
//
// Run: node scripts/check-search-index.mjs        (structural only)
//      OWNER=… REPO=… BRANCH=… tsx scripts/check-search-index.mjs   (both)

import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const importTs = (rel) => import(pathToFileURL(join(root, rel)).href);

/**
 * Per-locale gzipped ceiling.
 *
 * 300 KB was the original target and every alphabetic locale fits it with room
 * — the largest, Russian, is 228 KB. Chinese and Japanese do not, and cannot:
 * neither is space-delimited, so both are indexed as overlapping character
 * bigrams, which produces roughly one distinct key per character. The weight is
 * in the rare bigrams, which are exactly the ones that make a specific page
 * findable, so pruning them would trade Chinese search for a number. Measured:
 * zh 427 KB, ja 315 KB. The budget is set above both rather than below.
 */
const BUDGET_GZIP = 450 * 1024;

let failures = 0;
const fail = (msg) => {
  console.error(`  FAIL  ${msg}`);
  failures++;
};
const pass = (msg) => console.log(`  ok    ${msg}`);

const FIXTURE = [
  {
    title: "Heartwood",
    url: "https://zechub.wiki/zcash-tech/heartwood",
    markdown:
      "# Heartwood\n\nShielded mining rewards, and FlyClient for light clients.\n\n```\nzcashd -daemon\n```\n",
  },
  {
    title: "Buying ZEC",
    url: "https://zechub.wiki/using-zcash/buying-zec",
    markdown: "# Buying ZEC\n\nShielded balances and exchanges. See [a guide](https://x.test/y).\n",
  },
  {
    title: "屏蔽交易",
    url: "https://zechub.wiki/zh/shielded",
    markdown: "# 屏蔽交易\n\n屏蔽交易是私密的。\n",
  },
];

async function structural() {
  console.log("structural tier");

  const { tokenize, markdownToText } = await importTs("src/lib/search/tokenize.ts");
  const { buildIndex, parseLlmsFull } = await import(
    pathToFileURL(join(root, "scripts/generate-search-index.mjs")).href
  );
  const { search } = await importTs("src/lib/search/client.ts");

  // Tokenizer contract.
  if (!tokenize("屏蔽交易").includes("屏蔽")) {
    fail("CJK is not split into bigrams — CJK search would match nothing");
  } else pass("CJK splits into bigrams");

  if (markdownToText("a\n```\nzcash-cli\n```\nb").includes("zcash-cli")) {
    fail("fenced code reaches the index — results a reader cannot see on the page");
  } else pass("fenced code is stripped");

  // Parser contract: the delimiter format generate-llms-txt.mjs writes.
  const sample =
    "# Contents\n\n---\n\n# Heartwood\nSource: https://zechub.wiki/zcash-tech/heartwood\nMarkdown: https://zechub.wiki/zcash-tech/heartwood.md\n\nFlyClient.\n";
  const parsed = parseLlmsFull(sample);
  if (parsed.length !== 1 || parsed[0].url !== "https://zechub.wiki/zcash-tech/heartwood") {
    fail("llms-full.txt parsing broke — English pages would vanish from the index");
  } else pass("llms-full.txt parses to pages");

  // Index shape and ranking.
  const curated = new Map([
    ["/using-zcash/buying-zec", { desc: "where to buy", aliases: ["exchanges", "onboarding"] }],
  ]);
  const idx = buildIndex("en", FIXTURE, curated, tokenize, (s) => [...new Set(tokenize(s))], markdownToText);

  for (const key of ["v", "locale", "docs", "terms", "titles", "aliases"]) {
    if (!(key in idx)) fail(`generated index is missing "${key}" — the client cannot read it`);
  }
  if (!failures) pass("generated shape matches what the client reads");

  if (idx.docs.some(([, url]) => /^https?:\/\//.test(url))) {
    fail("docs store absolute URLs — they will not deduplicate against existing results");
  } else pass("docs store paths, not absolute URLs");

  const byTitle = (q) => search(idx, q, 3).map((h) => h.title);

  if (byTitle("flyclient")[0] !== "Heartwood") {
    fail("a body-only term does not find its page — the whole point of the index");
  } else pass("body-only terms find their page");

  if (byTitle("onboarding")[0] !== "Buying ZEC") {
    fail("a curated alias no longer finds its page — hand-tuned results regressed");
  } else pass("curated aliases still rank");

  if (!byTitle("屏蔽")[0]) {
    fail("CJK query returns nothing");
  } else pass("CJK queries return results");

  if (search(null, "anything").length !== 0) {
    fail("a missing index does not degrade silently");
  } else pass("a missing index degrades to no results, not a crash");
}

async function contentRepo() {
  const { OWNER, REPO, BRANCH } = process.env;
  if (!OWNER || !REPO || !BRANCH) {
    console.log("\ncontent-repo tier skipped (OWNER/REPO/BRANCH unset)");
    return;
  }
  console.log("\ncontent-repo tier");

  const dir = join(root, "public", "search-index");
  if (!existsSync(dir)) {
    console.log("  no public/search-index — run scripts/generate-search-index.mjs first");
    return;
  }

  const files = readdirSync(dir).filter((f) => f.endsWith(".json") && f !== "manifest.json");
  if (files.length === 0) {
    fail("public/search-index exists but holds no locale index");
    return;
  }

  let worst = 0;
  for (const f of files.sort()) {
    const raw = readFileSync(join(dir, f));
    const gz = gzipSync(raw).length;
    worst = Math.max(worst, gz);
    const line = `${f.replace(/\.json$/, "").padEnd(3)} ${(gz / 1024).toFixed(0).padStart(4)} KB gzipped`;
    if (gz > BUDGET_GZIP) fail(`${line} — over the ${BUDGET_GZIP / 1024} KB budget`);
    else pass(line);
  }
  console.log(`  largest locale: ${(worst / 1024).toFixed(0)} KB of ${BUDGET_GZIP / 1024} KB`);
}

await structural();
await contentRepo();

console.log();
if (failures) {
  console.error(`check-search-index FAILED: ${failures} problem(s)`);
  process.exit(1);
}
console.log("check-search-index OK");
