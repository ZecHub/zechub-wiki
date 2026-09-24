import { getFiles, transformUri } from "@/lib/helpers";
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";

const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env;

const authUser = GITHUB_TOKEN;
const owner = (OWNER ?? "").trim();
const repo = (REPO ?? "").trim();
const branch = (BRANCH ?? "main").trim();

const octokit = new Octokit({ auth: authUser });

/** Strip leading slashes so GitHub never sees %2Fsite/... */
function cleanPath(path: string): string {
  return path.replace(/^\/+/, "");
}

/**
 * Normalize a path for the GitHub contents API under the content repo.
 *
 * Callers pass mixed forms:
 *   - wiki slug roots like `/site/using-zcash` (need transformUri)
 *   - already-transformed content paths like `site/Using_Zcash` (must NOT
 *     re-run transformUri — that would turn `site/` into `Site/` and break
 *     the case-insensitive file fallback folder listing)
 *
 * Detection: content-repo paths contain uppercase letters (e.g. Using_Zcash).
 * Wiki slug paths are lowercase with hyphens (e.g. using-zcash). Only the
 * latter go through transformUri.
 */
function toGithubPath(path: string): string {
  const p = cleanPath(path);
  const hasSitePrefix = /^site\//i.test(p);
  const rest = hasSitePrefix ? p.slice(p.indexOf("/") + 1) : p;

  // Already a content-repo path (Capitalized_Underscore segments).
  if (hasSitePrefix && /[A-Z]/.test(rest)) {
    return "site/" + rest;
  }

  // Wiki slug path — run transformUri on the slug portion.
  const withSlash = rest.startsWith("/") ? rest : `/${rest}`;
  const transformed = transformUri(withSlash); // e.g. "/Using_Zcash"
  return cleanPath("site" + transformed);
}

function assertRepoConfig(): boolean {
  if (!owner || !repo) {
    console.error(
      "[authAndFetch] OWNER or REPO env var is missing — GitHub content fetches will return null. " +
        "Set OWNER and REPO in the CI environment / .env.local.",
    );
    return false;
  }
  return true;
}

function normalize(str: string): string {
  return str
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[-_ ]+/g, "");
}

/**
 * The commit SHA the content branch currently points at.
 *
 * One contents-API call per TTL, shared by every raw read, so those reads can
 * be pinned to an immutable ref.
 *
 * Falls back to the branch name when it cannot be resolved: a degraded read
 * (CDN-stale by up to five minutes) beats no read at all, and the warning
 * makes the degradation visible rather than silent.
 */
// Resolved in-process, NOT through unstable_cache. Two reasons, both measured:
//
//   * Next bypasses the cache of an unstable_cache invoked from inside another
//     one (`!isNestedUnstableCache` in unstable-cache.js), and this value is
//     needed by every cached reader.
//   * Even hoisted out of the nesting, unstable_cache did not hold it across
//     requests: 20 page renders produced 25 getCommit calls. A per-process memo
//     produces one per TTL, deterministically, with no dependence on Next cache
//     internals.
//
// PUBLICATION LAG: the memo is NOT cleared by revalidateTag, so the content
// repo's push webhook no longer makes a merge visible immediately. It clears
// the reader caches, they re-read — at the ref this memo still holds. A merge
// therefore appears within REF_TTL_MS, and hitting /api/revalidate cannot
// shorten that.
//
// 300s, not 60s. The memo is per-instance and vercel.json means lambdas, so
// this is the one unconditionally time-proportional cost in the file: at 60s
// and ~40 warm instances it is 2,400 getCommit/hour, roughly half the budget,
// to buy four minutes of publication lag. Quota is the problem being solved
// here; five minutes of lag is the cheaper side of that trade.
// On serverless each instance holds its own memo and flips on its own offset,
// so for up to one TTL after a merge two instances can serve different
// commits.
const REF_TTL_MS = 300_000;
let refMemo: { ref: string; at: number } | null = null;
let refInFlight: Promise<string> | null = null;

async function resolveContentRef(): Promise<string> {
  const now = Date.now();
  if (refMemo && now - refMemo.at < REF_TTL_MS) return refMemo.ref;
  // Collapse concurrent misses: a cold server rendering 21 pages at once must
  // issue one getCommit, not 21.
  if (refInFlight) return refInFlight;

  refInFlight = (async (): Promise<string> => {
    if (!assertRepoConfig()) return branch;
    try {
      const res = await octokit.rest.repos.getCommit({
        owner,
        repo,
        ref: branch,
        mediaType: { format: "sha" },
        // Without a deadline one socket GitHub never answers stalls EVERY
        // content read in the process: each public entry point awaits this
        // before its first raw fetch, and refInFlight makes them all share
        // the same pending promise.
        //
        // Constructed defensively: AbortSignal.timeout is absent in some
        // runtimes (jsdom, older edge builds). Calling it unguarded throws
        // INSIDE this try, which would be caught below and silently degrade
        // every read to the branch ref — a worse failure than having no
        // timeout at all.
        ...(typeof AbortSignal !== "undefined" &&
        typeof AbortSignal.timeout === "function"
          ? { request: { signal: AbortSignal.timeout(5_000) } }
          : {}),
      });
      const data: unknown = res.data;
      const sha =
        typeof data === "string" ? data : (data as { sha?: string })?.sha;
      return sha && /^[0-9a-f]{40}$/i.test(sha) ? sha : branch;
    } catch (err: any) {
      // Prefer the last SHA we knew over the branch name. The ref is part of
      // every cache key, so falling back to `branch` does not merely degrade
      // freshness — it orphans every warm entry and re-reads the whole corpus
      // at a CDN-cached ref. And the thing that makes getCommit fail is
      // usually quota exhaustion, which lasts the rest of the hour: exactly
      // when re-reading everything is worst.
      if (refMemo) {
        console.warn(
          `[authAndFetch] could not refresh the content ref (${err?.status ?? err?.message}); ` +
            `continuing at the last known commit ${refMemo.ref.slice(0, 8)}.`,
        );
        return refMemo.ref;
      }
      console.warn(
        `[authAndFetch] could not resolve ${branch} to a SHA (${err?.status ?? err?.message}) ` +
          `and no previous commit is known; raw reads fall back to the branch ref, ` +
          `which the CDN may serve up to 5 minutes stale.`,
      );
      return branch;
    }
  })();

  try {
    const ref = await refInFlight;
    refMemo = { ref, at: Date.now() };
    return ref;
  } finally {
    refInFlight = null;
  }
}

/** Test seam: drop the memo so a test can observe a cold resolve. */
export function __resetContentRefMemo(): void {
  refMemo = null;
  refInFlight = null;
}

// Send a credential to raw ONLY for a private content repo, and only when that
// is declared explicitly. raw answers a bad or unscoped token with 404 — not
// 401 — so an Authorization header that the contents API accepts but raw
// rejects would turn every read into a cached "this page does not exist", and
// the site would silently serve English everywhere with nothing in the logs.
// On a public repo the header buys nothing, so the default is to omit it.
const contentRepoIsPrivate = (process.env.CONTENT_REPO_PRIVATE ?? "") === "true";

/**
 * Read one file from raw.githubusercontent.com instead of the contents API.
 *
 * Why this exists: the contents API is capped at 5,000 requests/hour for the
 * whole token, and a full build reads 220 English pages plus 220 × 18 = 3,960
 * localized ones. Every localized read costs at least two API calls (does the
 * translation exist, does the English still exist), so one build needs roughly
 * 8,000 calls — more than the entire hourly budget — and the build dies with
 * "Request quota exhausted for request GET /repos/{owner}/{repo}/contents/
 * {path}". Adding locales made an existing design fail; at one locale it never
 * showed.
 *
 * raw.githubusercontent.com serves the same bytes from a CDN and is not
 * charged against the API quota. Measured: 200 files, 20 in parallel,
 * unauthenticated, all 200 OK in three seconds.
 *
 * Returns the file's text, or null when GitHub says 404 — which for raw means
 * "no such path on this ref", covering both a missing file and a directory.
 * Any other status goes through rethrowIfTransient, so a 5xx or a network blip
 * is not cached as "this page does not exist". NOTE the one exception that
 * function deliberately makes: a rate-limit during the build phase is
 * swallowed rather than thrown, so a throttled read CAN still surface as null.
 * That predates this change; see the comment on rethrowIfTransient.
 *
 * FRESHNESS: the URL is pinned to a commit SHA, not to the branch name. raw
 * serves a branch ref through a CDN with `max-age=300`, so a branch URL can
 * hand back content up to five minutes old — and because the caller stores
 * that body under its own `revalidate: 3600`, a stale read taken just after
 * /api/revalidate would then be held for another hour. Pinning to a SHA makes
 * every URL immutable, so the CDN TTL stops mattering. Cost is one contents-API
 * call per REF_TTL_MS instead of one per read. See resolveContentRef for what
 * this does to publication lag — it is not free.
 */
async function fetchRawFile(
  path: string,
  ref: string,
  method: "GET" | "HEAD" = "GET",
): Promise<string | null> {
  if (!assertRepoConfig()) throw new Error("[authAndFetch] repo not configured");
  const safePath = cleanPath(path);
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${safePath
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers:
        contentRepoIsPrivate && authUser
          ? { Authorization: `token ${authUser}` }
          : undefined,
      // Next must not layer its own fetch cache under unstable_cache: the
      // wrapper already owns the TTL and the revalidate tag.
      cache: "no-store",
    });
  } catch (err: any) {
    // DNS/socket failure — transient by definition, never "missing".
    rethrowIfTransient({ status: 0, message: err?.message }, safePath);
    return null;
  }

  if (res.status === 404) return null;
  if (!res.ok) {
    rethrowIfTransient(
      { status: res.status, message: `raw.githubusercontent returned ${res.status}` },
      safePath,
    );
    return null;
  }
  // HEAD proves existence without pulling the body — used by the
  // English-source probe, which runs once per localized page and never needs
  // the text. Returning "" would be indistinguishable from an empty file to a
  // GET caller, so HEAD is only ever called where the caller wants existence.
  return method === "HEAD" ? "" : res.text();
}

/**
 * A 404 is a real answer: the file is not there, and `null` is the correct
 * result to cache. Anything else — 403/429 rate limiting, 5xx, a network
 * blip, an expired token — is transient, and caching `null` for it would
 * blank the page permanently (these caches are keyed by path and, before
 * this change, never revalidated). Rethrow so `unstable_cache` stores
 * nothing and the next request retries.
 */
function isMissing(err: any): boolean {
  return err?.status === 404;
}

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function isRateLimited(err: any): boolean {
  const status = err?.status;
  const msg = String(err?.response?.data?.message ?? err?.message ?? "");
  return (
    status === 429 ||
    /quota exhausted|rate limit/i.test(msg) ||
    (status === 403 && /rate limit|quota exhausted/i.test(msg))
  );
}

function rethrowIfTransient(err: any, path: string): void {
  if (isMissing(err)) return;
  console.error(
    `[authAndFetch] transient GitHub failure for ${path} (status ${err?.status}): ${err?.response?.data?.message ?? err?.message}`,
  );
  // SSG: a GitHub 429 must not abort all ~985 static pages.
  // Runtime: still throw so unstable_cache does not store null.
  if (isRateLimited(err) && isBuildPhase()) return;
  throw err;
}

// Read one exact path at one exact ref. Nothing else — the case-insensitive
// fallback lives in the public wrapper, OUTSIDE this callback, because Next
// bypasses an unstable_cache invoked from inside another one. The fallback
// used to call getRootCached from in here, so every English page whose route
// spelling differs from the real filename casing issued an uncached
// contents-API call per request: the same defect as the translation path, one
// function away.
const readFileAtRefCached = unstable_cache(
  async (path: string, ref: string): Promise<string | null> => {
    // Not `return null`: a missing OWNER/REPO is a deploy-configuration fault,
    // not evidence that the page is absent. Caching null here would blank every
    // page requested during a misconfigured window — the exact failure this
    // function is being hardened against.
    if (!assertRepoConfig()) throw new Error("[authAndFetch] repo not configured");
    return fetchRawFile(cleanPath(path), ref);
  },
  ["github-file-content-cache", owner, repo, branch],
  // `revalidate: false` cached forever, so a single bad entry never healed.
  // A TTL bounds the damage of anything that still slips through.
  { revalidate: 3600, tags: ["github-content"] },
);

const getTranslationProbeAtRefCached = unstable_cache(
  async (path: string, ref: string) => {
    // 3,960 of these per revalidation cycle (220 pages × 18 locales) — the
    // single largest consumer of the API quota before this moved to the CDN.
    return fetchRawFile(path, ref);
  },
  ["github-translation-probe-cache", owner, repo, branch],
  { revalidate: 300, tags: ["github-content"] },
);

const getMenuTitlesAtRefCached = unstable_cache(
  async (locale: string, ref: string): Promise<Record<string, string>> => {
    if (!assertRepoConfig()) return {};
    try {
      const raw = await fetchRawFile(`translation/menu-titles/${locale}.json`, ref);
      if (raw === null) return {};
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
        return {};
      const out: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
      }
      return out;
    } catch (err) {
      console.error(
        `[menu-titles] manifest fetch failed for locale "${locale}" — menu/sitemap titles will fall back to English:`,
        err,
      );
      return {};
    }
  },
  ["github-menu-titles", branch],
  { revalidate: 300, tags: ["github-content"] },
);

// Directory listing for the case-insensitive fallback, cached.
//
// 37 of the 216 routed pages have a slug whose path transform does not
// reproduce the real filename casing (`How_Zcash_is_Organized` vs
// `How_Zcash_Is_Organized`, `confidentiality-compared` vs
// `Confidentiality_Compared`, …). Across 18 locales that is 666 URLs that
// reach this fallback, and `[...slug]/page.tsx` is force-dynamic — so before
// this was cached, each of those URLs cost a contents-API call on EVERY
// request, uncached, forever. Measured: 100 repeat views of one such page =
// 100 calls. That is the only remaining traffic-proportional drain, and under
// the ~17 AI crawlers robots.ts allow-lists it can reproduce the very outage
// this change exists to fix.
//
// Keyed on (dir, ref) like every sibling, so it moves with the content ref.
const listDirAtRefCached = unstable_cache(
  async (dir: string, ref: string): Promise<string[]> => {
    if (!assertRepoConfig()) return [];
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: dir,
        ref,
      });
      const entries = Array.isArray(res.data) ? res.data : [res.data];
      return entries
        .filter((e: any) => e.type === "file" && e.name.endsWith(".md"))
        .map((e: any) => e.path);
    } catch (err: any) {
      // A missing folder for this locale is a real answer; a 403/429/5xx is
      // not. The bare `catch {}` this replaces swallowed them identically,
      // with no log — the exact defect class this change exists to remove,
      // surviving in the one path it had not touched.
      if (isMissing(err)) return [];
      rethrowIfTransient(err, dir);
      return [];
    }
  },
  ["github-dir-listing", owner, repo, branch],
  // An hour, not five minutes. Freshness comes from the `github-content` tag,
  // which the content repo's push webhook clears; the TTL only bounds drift if
  // the webhook is ever missed. At 300s, ~297 live listing keys re-fetched
  // every five minutes is ~3,560 contents-API calls/hour against a 5,000/hour
  // budget — headroom too thin for the drain this change exists to remove.
  { revalidate: 3600, tags: ["github-content"] },
);

async function fuzzyLocalizedFile(
  itPath: string,
  ref: string,
): Promise<string | null> {
  if (!assertRepoConfig()) return null;
  const dir = cleanPath(itPath).split("/").slice(0, -1).join("/");
  const wantSlug = normalize(
    itPath.split("/").pop()?.replace(/\.md$/i, "") || "",
  );
  for (const path of await listDirAtRefCached(dir, ref)) {
    const name = (path.split("/").pop() ?? path).replace(/\.md$/i, "");
    if (normalize(name) === wantSlug) {
      return getTranslationProbeAtRefCached(path, ref).catch(() => null);
    }
  }
  return null;
}

const getEnglishSourceStatusAtRefCached = unstable_cache(
  async (path: string, ref: string): Promise<"present" | "absent"> => {
    if (!assertRepoConfig()) return "absent";
    const safePath = cleanPath(path);
    // HEAD, not GET: this asks only whether the English source still exists,
    // and runs once per localized page. Pulling 3,960 bodies to answer a
    // yes/no would waste the bandwidth the quota fix just saved.
    if ((await fetchRawFile(safePath, ref, "HEAD")) !== null) return "present";

    const folderPath = safePath.split("/").slice(0, -1).join("/");
    const wantSlug = normalize(
      safePath.split("/").pop()?.replace(/\.md$/i, "") || "",
    );
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: folderPath,
        // `ref`, not `branch`: this entry is KEYED under the resolved ref, so
        // reading at branch HEAD would store a branch-HEAD answer under an
        // immutable-SHA key. That misleads exactly when the memo is pinned to
        // an older SHA — which is the quota-exhaustion path, by design.
        ref,
      });
      const entries = Array.isArray(res.data) ? res.data : [res.data];
      for (const e of entries) {
        if (e.type !== "file" || !e.name.endsWith(".md")) continue;
        const n = normalize(e.name.replace(/\.md$/i, ""));
        if (n === wantSlug) return "present";
      }
      return "absent";
    } catch (err: any) {
      if (err?.status === 404) return "absent";
      throw err;
    }
  },
  ["github-english-source-status", owner, repo, branch],
  { revalidate: 300, tags: ["github-content"] },
);

/*
 * Public entry points.
 *
 * Each resolves the content ref FIRST, outside any cached callback, then hands
 * it to the cached reader as an argument. That ordering is load-bearing twice
 * over:
 *
 *   1. Next bypasses the cache of an unstable_cache invoked from inside
 *      another one — `!isNestedUnstableCache && …` in
 *      next/dist/server/web/spec-extension/unstable-cache.js. Resolving the
 *      ref inside a cached reader would therefore skip the ref cache and issue
 *      a contents-API getCommit on EVERY file read, which is the exact quota
 *      drain this change exists to remove.
 *   2. Passing the ref as an argument puts it in the cache key. A body read at
 *      SHA-A can never be served for SHA-B, and an entry cached during a
 *      branch-ref fallback is keyed separately, so it is simply never
 *      consulted again once SHA resolution recovers — rather than pinning
 *      stale content for the reader's full TTL.
 */

export async function getFileContentCached(path: string): Promise<string | null> {
  const ref = await resolveContentRef();
  return readFileAtRef(path, ref);
}

/**
 * Read a path at a ref, falling back to a case-insensitive sibling match.
 *
 * Every cache call here is top level, never nested inside another cached
 * callback, so each one actually caches.
 */
async function readFileAtRef(
  path: string,
  ref: string,
): Promise<string | null> {
  const safePath = cleanPath(path);
  // Degraded mode: when the SHA could not be resolved, `ref` is the BRANCH
  // name — a mutable key. Caching a 404 under it for the file TTL would
  // outlive the page being created: the next commit does not change the key,
  // so a real page renders empty for up to an hour. Read straight through
  // instead. Raw is unmetered, so the only cost is extra CDN requests during
  // an outage that is already degraded.
  if (ref === branch) return readFileAtRefUncached(safePath, ref);

  const direct = await readFileAtRefCached(safePath, ref);
  if (direct !== null) return direct;

  const folderPath = safePath.split("/").slice(0, -1).join("/");
  const realFiles = await listDirAtRefCached(folderPath, ref);
  const wantSlug = normalize(
    safePath.split("/").pop()?.replace(/\.md$/i, "") || "",
  );
  for (const file of realFiles) {
    // Compare basenames exactly. An earlier `includes()` test matched any
    // sibling whose name merely *contained* the slug, so `ai-tools` could
    // resolve to `AI_tools_for_offline.md` and cache the wrong article's body
    // under this path.
    const base = file.split("/").pop() ?? file;
    if (normalize(base) === wantSlug) {
      return readFileAtRefCached(cleanPath(file), ref);
    }
  }
  // Every lookup returned a clean 404: the page really does not exist.
  return null;
}

/** The degraded-mode read: same semantics, nothing cached. */
async function readFileAtRefUncached(
  safePath: string,
  ref: string,
): Promise<string | null> {
  const direct = await fetchRawFile(safePath, ref);
  if (direct !== null) return direct;
  const folderPath = safePath.split("/").slice(0, -1).join("/");
  const wantSlug = normalize(
    safePath.split("/").pop()?.replace(/\.md$/i, "") || "",
  );
  for (const file of await listDirAtRefCached(folderPath, ref)) {
    const base = file.split("/").pop() ?? file;
    if (normalize(base) === wantSlug) return fetchRawFile(cleanPath(file), ref);
  }
  return null;
}

async function getTranslationProbeCached(path: string): Promise<string | null> {
  return getTranslationProbeAtRefCached(path, await resolveContentRef());
}

async function getEnglishSourceStatusCached(
  path: string,
): Promise<"present" | "absent"> {
  return getEnglishSourceStatusAtRefCached(path, await resolveContentRef());
}

export async function getMenuTitlesCached(
  locale: string,
): Promise<Record<string, string>> {
  return getMenuTitlesAtRefCached(locale, await resolveContentRef());
}

export async function getLocalizedFileContentCached(
  filePath: string,
  locale: string,
): Promise<string | null> {
  const normalizedPath = cleanPath(filePath);
  // ONE ref for this whole read. Resolving separately per lookup let a request
  // straddle a TTL boundary during a push: the translation read at SHA-A, the
  // English-source probe at SHA-B where that source had been deleted, so a
  // perfectly good translation was discarded and the page rendered EMPTY at
  // HTTP 200 — the silent-blank-page class this module exists to prevent.
  //
  // Scope note: this guarantees consistency WITHIN this function, not across a
  // render. getFileContentCached and getMenuTitlesCached each resolve their
  // own, so a page that calls several wrappers across a TTL boundary can still
  // mix commits — menu titles from one, body from another. That is a cosmetic
  // skew, not the blank-page failure above, and fixing it properly means
  // threading a ref through the page components.
  const ref = await resolveContentRef();

  if (locale && locale !== "en") {
    const itPath = `translations/${locale}/${normalizedPath}`;
    const exact = await getTranslationProbeAtRefCached(itPath, ref).catch(
      () => null,
    );
    const fuzzy =
      exact !== null
        ? null
        : await fuzzyLocalizedFile(itPath, ref).catch(() => null);
    const translated = exact !== null ? exact : fuzzy;
    if (translated !== null) {
      let englishStatus: "present" | "absent" | "unknown";
      try {
        englishStatus = await getEnglishSourceStatusAtRefCached(filePath, ref);
      } catch {
        englishStatus = "unknown";
      }
      if (englishStatus === "absent") {
        return readFileAtRef(filePath, ref).catch(() => null);
      }
      return translated;
    }
  }
  return readFileAtRef(filePath, ref).catch(() => null);
}

export const getRootCached = unstable_cache(
  async (path: string) => {
    if (!assertRepoConfig()) return [];
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: toGithubPath(path),
        ref: branch,
      });
      const data = res.data;
      const elements = getFiles(data);
      return elements.filter((item: string) => item.endsWith(".md"));
    } catch (err: any) {
      rethrowIfTransient(err, toGithubPath(path));
      return [];
    }
  },
  ["github-root-md-cache", owner, repo, branch],
  // An hour, not 30 seconds. `[...slug]/page.tsx` calls this on the default
  // branch of a force-dynamic catch-all, BEFORE it decides whether the route
  // is a 404 — so every distinct first URL segment mints a key, and a scanner
  // walking /en/wp-admin, /en/.env, /en/qwerty mints one per novel path. At a
  // 30s TTL each key could be re-listed 120 times an hour; across just the 15
  // real top-level directories that is ~1,800 contents-API calls/hour, 36% of
  // the budget, which would leave this change removing the dominant drain
  // without clearing the outage. Freshness comes from the `github-content`
  // tag, which the content repo's push webhook clears.
  { revalidate: 3600, tags: ["github-content"] },
);

export async function getSiteFolders(path: string) {
  if (!assertRepoConfig()) return [];
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: cleanPath(path),
      ref: branch,
    });
    return getFiles(res.data);
  } catch {
    return [];
  }
}

export const getAllMarkdownRecursively = unstable_cache(
  async (initialPath: string): Promise<string[]> => {
    if (!assertRepoConfig()) return [];
    const results: string[] = [];
    const walk = async (currentPath: string, isInitial: boolean) => {
      try {
        const apiPath = isInitial
          ? toGithubPath(currentPath)
          : cleanPath(currentPath);
        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: apiPath,
          ref: branch,
        });
        const items = Array.isArray(res.data) ? res.data : [res.data];
        for (const item of items) {
          if (!item?.path) continue;
          if (item.type === "file" && item.path.endsWith(".md")) {
            results.push(item.path);
          } else if (item.type === "dir") {
            await walk(item.path, false);
          }
        }
      } catch {
        // ignore individual subdirectory failures
      }
    };
    await walk(initialPath, true);
    return results;
  },
  ["github-all-md-recursive-final"],
  { revalidate: 60, tags: ["github-content"] },
);
