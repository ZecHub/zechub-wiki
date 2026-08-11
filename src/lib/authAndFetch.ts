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

function rethrowIfTransient(err: any, path: string): void {
  if (isMissing(err)) return;
  console.error(
    `[authAndFetch] transient GitHub failure for ${path} (status ${err?.status}): ${err?.response?.data?.message ?? err?.message}`,
  );
  throw err;
}

/**
 * Decode a contents-API response, or throw if it is not a readable file.
 *
 * `getContent` does not only return files: a directory comes back as an
 * array, and a blob over 1 MB comes back with `encoding: "none"` and an
 * empty `content`. Blindly decoding `res.data?.content || ""` turns both
 * into `""`, which `[...slug]/page.tsx` cannot tell apart from a missing
 * page — the same silent-blank failure this module is being hardened
 * against. Throwing routes them to the transient path instead, so nothing
 * is cached and the condition stays visible in the logs.
 */
function decodeFileContent(data: any, path: string): string {
  if (Array.isArray(data)) {
    throw new Error(`[authAndFetch] ${path} is a directory, not a file`);
  }
  if (data?.type !== "file") {
    throw new Error(`[authAndFetch] ${path} is not a file (type ${data?.type})`);
  }
  if (data?.encoding !== "base64" || !data?.content) {
    // Typically a >1MB blob: the API omits inline content in this case.
    throw new Error(
      `[authAndFetch] ${path} has no inline content (encoding ${data?.encoding}, size ${data?.size})`,
    );
  }
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export const getFileContentCached = unstable_cache(
  async (path: string) => {
    // Not `return null`: a missing OWNER/REPO is a deploy-configuration fault,
    // not evidence that the page is absent. Caching null here would blank every
    // page requested during a misconfigured window — the exact failure this
    // function is being hardened against.
    if (!assertRepoConfig()) throw new Error("[authAndFetch] repo not configured");
    const safePath = cleanPath(path);

    try {
      try {
        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: safePath,
          ref: branch,
        });
        return decodeFileContent(res.data, safePath);
      } catch (err: any) {
        // Only a genuine 404 may fall through to the case-insensitive folder
        // scan below; a transient failure must not be mistaken for "the file
        // is not at this exact path".
        rethrowIfTransient(err, safePath);
      }

      const folderPath = safePath.split("/").slice(0, -1).join("/");
      const realFiles = await getRootCached(folderPath);
      if (realFiles?.length) {
        const slugPart = safePath.split("/").pop()?.replace(/\.md$/i, "") || "";
        const normalizedSlug = normalize(slugPart);
        for (const file of realFiles) {
          // Compare basenames exactly. The previous `includes()` test matched
          // any sibling whose name merely *contained* the slug, so `ai-tools`
          // could resolve to `AI_tools_for_offline.md` and cache the wrong
          // article's body under this path.
          const base = file.split("/").pop() ?? file;
          if (normalize(base) === normalizedSlug) {
            const res = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: cleanPath(file),
              ref: branch,
            });
            return decodeFileContent(res.data, cleanPath(file));
          }
        }
      }
      // Every lookup returned a clean 404: the page really does not exist.
      // (Config faults and non-file responses throw above, so they cannot
      // reach this line and be cached as "missing".)
      return null;
    } catch (err: any) {
      if (isMissing(err)) return null;
      // Propagate. Every caller wraps this in a catch that degrades to an
      // empty render for this one request (`[...slug]/page.tsx` L440 + outer
      // try, `api/content-md` L63); the route is force-dynamic, so no build
      // path aborts. One recoverable empty render beats a cached blank page.
      throw err;
    }
  },
  // `owner`/`repo`/`branch` are closed over rather than passed as arguments,
  // so they must be part of the key — otherwise entries written under one
  // repo configuration are served after that configuration changes.
  ["github-file-content-cache", owner, repo, branch],
  // `revalidate: false` cached forever, so a single bad entry never healed.
  // A TTL bounds the damage of anything that still slips through.
  { revalidate: 3600, tags: ["github-content"] },
);

const getTranslationProbeCached = unstable_cache(
  async (path: string) => {
    if (!assertRepoConfig()) throw new Error("[authAndFetch] repo not configured");
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: cleanPath(path),
        ref: branch,
      });
      return decodeFileContent(res.data, cleanPath(path));
    } catch (err: any) {
      if (isMissing(err)) return null;
      throw err;
    }
  },
  ["github-translation-probe-cache", owner, repo, branch],
  { revalidate: 300, tags: ["github-content"] },
);

export const getMenuTitlesCached = unstable_cache(
  async (locale: string): Promise<Record<string, string>> => {
    if (!assertRepoConfig()) return {};
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: `translation/menu-titles/${locale}.json`,
        ref: branch,
      });
      // @ts-ignore
      const raw = Buffer.from(res.data?.content || "", "base64").toString(
        "utf-8",
      );
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

async function fuzzyLocalizedFile(itPath: string): Promise<string | null> {
  if (!assertRepoConfig()) return null;
  const dir = cleanPath(itPath).split("/").slice(0, -1).join("/");
  const wantSlug = normalize(
    itPath.split("/").pop()?.replace(/\.md$/i, "") || "",
  );
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dir,
      ref: branch,
    });
    const entries = Array.isArray(res.data) ? res.data : [res.data];
    for (const e of entries) {
      if (e.type !== "file" || !e.name.endsWith(".md")) continue;
      const n = normalize(e.name.replace(/\.md$/i, ""));
      if (n === wantSlug) {
        return await getTranslationProbeCached(e.path).catch(() => null);
      }
    }
  } catch {
    // folder missing for this locale → fall back to English
  }
  return null;
}

const getEnglishSourceStatusCached = unstable_cache(
  async (path: string): Promise<"present" | "absent"> => {
    if (!assertRepoConfig()) return "absent";
    const safePath = cleanPath(path);
    try {
      await octokit.rest.repos.getContent({
        owner,
        repo,
        path: safePath,
        ref: branch,
      });
      return "present";
    } catch (err: any) {
      if (err?.status !== 404) throw err;
    }
    const folderPath = safePath.split("/").slice(0, -1).join("/");
    const wantSlug = normalize(
      safePath.split("/").pop()?.replace(/\.md$/i, "") || "",
    );
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: folderPath,
        ref: branch,
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

export async function getLocalizedFileContentCached(
  filePath: string,
  locale: string,
): Promise<string | null> {
  const normalizedPath = cleanPath(filePath);
  if (locale && locale !== "en") {
    const itPath = `translations/${locale}/${normalizedPath}`;
    const exact = await getTranslationProbeCached(itPath).catch(() => null);
    const fuzzy =
      exact !== null ? null : await fuzzyLocalizedFile(itPath).catch(() => null);
    const translated = exact !== null ? exact : fuzzy;
    if (translated !== null) {
      let englishStatus: "present" | "absent" | "unknown";
      try {
        englishStatus = await getEnglishSourceStatusCached(filePath);
      } catch {
        englishStatus = "unknown";
      }
      if (englishStatus === "absent") {
        return getFileContentCached(filePath).catch(() => null);
      }
      return translated;
    }
  }
  return getFileContentCached(filePath).catch(() => null);
}

export const getRootCached = unstable_cache(
  async (path: string) => {
    if (!assertRepoConfig()) return [];
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: cleanPath(transformUri(path).replace("/Site", "/site")),
      ref: branch,
    });
    const data = res.data;
    const elements = getFiles(data);
    return elements.filter((item: string) => item.endsWith(".md"));
  },
  ["github-root-md-cache"],
  { revalidate: 30, tags: ["github-content"] },
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

export async function getRootFileName(path: string) {
  if (!assertRepoConfig()) return [];
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: cleanPath(transformUri(path).replace("/Site", "/site")),
      ref: branch,
    });
    const data = res.data;
    const elements = getFiles(data);
    return elements
      .filter((item: string) => item.endsWith(".md"))
      .map((item: string) => item.split("/").pop()?.replace(/\.md$/, "") || "");
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
          ? cleanPath(transformUri(currentPath).replace("/Site", "/site"))
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
