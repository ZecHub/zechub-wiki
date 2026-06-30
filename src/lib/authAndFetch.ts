import { getFiles, transformUri } from "@/lib/helpers";
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";

const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env;

const authUser = GITHUB_TOKEN;
const owner = OWNER || "";
const repo = REPO || "";

const octokit = new Octokit({ auth: authUser });

function normalize(str: string): string {
  return str
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[-_ ]+/g, "");
}

export const getFileContentCached = unstable_cache(
  async (path: string) => {
    try {
      try {
        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: BRANCH,
        });
        // @ts-ignore
        return Buffer.from(res.data?.content || "", "base64").toString("utf-8");
      } catch (err: any) {
        console.log({ "Error! Status": err.status, Message: err.response?.data?.message });
      }

      const folderPath = path.split("/").slice(0, -1).join("/");
      const realFiles = await getRootCached(folderPath);
      if (realFiles?.length) {
        const slugPart = path.split("/").pop()?.replace(/\.md$/i, "") || "";
        const normalizedSlug = normalize(slugPart);
        for (const file of realFiles) {
          if (normalize(file) === normalizedSlug || normalize(file).includes(normalizedSlug)) {
            const res = await octokit.rest.repos.getContent({
              owner, repo, path: file, ref: BRANCH,
            });
            // @ts-ignore
            return Buffer.from(res.data?.content || "", "base64").toString("utf-8");
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  ["github-file-content-cache"],
  { revalidate: false, tags: ["github-content"] },
);

/**
 * Short-TTL variant of getFileContentCached used ONLY for the
 * `translations/<locale>/...` probe.
 *
 * getFileContentCached caches with `revalidate: false`, which means a MISSING
 * translation (the function returns null) would be cached forever — once a page
 * is requested in a locale before its translation exists, the null result would
 * never be re-fetched even after the translation is added. Giving the localized
 * probe a finite TTL lets newly-added translations appear without a redeploy or
 * manual cache purge. English `site/` fetches keep their long-lived cache via
 * getFileContentCached unchanged.
 */
const getTranslationProbeCached = unstable_cache(
  async (path: string) => {
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: BRANCH,
      });
      // @ts-ignore
      return Buffer.from(res.data?.content || "", "base64").toString("utf-8");
    } catch {
      return null;
    }
  },
  ["github-translation-probe-cache"],
  { revalidate: 300, tags: ["github-content"] },
);

/**
 * Locale-aware content fetch using a mirror-tree layout.
 *
 * For the default locale (`en`) this is identical to `getFileContentCached`.
 * For any other locale we first try the mirror path
 * `translations/<locale>/<filePath>` (e.g. `translations/it/site/start-here/...`)
 * and transparently fall back to the original (English) `filePath` when no
 * translation exists yet. The fallback keeps every page renderable while the
 * translated content tree is still being populated.
 */
async function fuzzyLocalizedFile(itPath: string): Promise<string | null> {
  // Direct fuzzy match within the localized folder. We must NOT route this
  // through getRootCached -> transformUri, which capitalizes the
  // "translations/<locale>" prefix (-> "Translations/It/...") and 404s. List
  // the folder with the path AS-IS, then slug-match the basename (handles
  // casing differences like ZODL.md vs the transformUri-derived "Zodl.md").
  const dir = itPath.split("/").slice(0, -1).join("/");
  const wantSlug = normalize(itPath.split("/").pop()?.replace(/\.md$/i, "") || "");
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: dir,
      ref: BRANCH,
    });
    const entries = Array.isArray(res.data) ? res.data : [res.data];
    for (const e of entries) {
      if (e.type !== "file" || !e.name.endsWith(".md")) continue;
      const n = normalize(e.name.replace(/\.md$/i, ""));
      // Exact normalized match only. normalize() already collapses casing and
      // -/_/space separators, so this still handles casing differences (e.g.
      // ZODL.md vs a "Zodl"-derived slug) without the substring `.includes()`
      // matching, which could return the WRONG file when one slug is a
      // substring of a sibling (e.g. "zcash" matching "zcashfoundation").
      if (n === wantSlug) {
        // Short-TTL probe: this is a translations/<locale>/... path, so a miss
        // must not be cached forever (see getTranslationProbeCached).
        return await getTranslationProbeCached(e.path).catch(() => null);
      }
    }
  } catch {
    // folder missing for this locale → fall back to English
  }
  return null;
}

export async function getLocalizedFileContentCached(
  filePath: string,
  locale: string,
): Promise<string | null> {
  const normalizedPath = filePath.replace(/^\/+/, "");

  if (locale && locale !== "en") {
    const itPath = `translations/${locale}/${normalizedPath}`;
    // Use the short-TTL probe so a not-yet-existing translation isn't cached as
    // a permanent miss; the English fallback below keeps its long-lived cache.
    const exact = await getTranslationProbeCached(itPath).catch(() => null);
    // Use `!== null` rather than truthiness so a legitimately empty translated
    // file ("") is still served instead of silently falling back to English.
    if (exact !== null) return exact;
    const fuzzy = await fuzzyLocalizedFile(itPath).catch(() => null);
    if (fuzzy !== null) return fuzzy;
  }

  return getFileContentCached(filePath).catch(() => null);
}

export const getRootCached = unstable_cache(
  async (path: string) => {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: transformUri(path).replace("/Site", "/site"),
      ref: BRANCH,
    });
    const data = res.data;
    const elements = getFiles(data);
    return elements.filter((item: string) => item.endsWith(".md"));
  },
  ["github-root-md-cache"],
  { revalidate: 30, tags: ["github-content"] },
);

export async function getSiteFolders(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({ owner, repo, path, ref: BRANCH });
    return getFiles(res.data);
  } catch {
    return [];
  }
}

export async function getRootFileName(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: transformUri(path).replace("/Site", "/site"),
      ref: BRANCH,
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

/**
 * Recursive version that preserves the exact same first-call transformation
 * as the original working getRootCached, then uses raw GitHub paths for subdirs.
 */
export const getAllMarkdownRecursively = unstable_cache(
  async (initialPath: string): Promise<string[]> => {
    const results: string[] = [];

    const walk = async (currentPath: string, isInitial: boolean) => {
      try {
        const apiPath = isInitial
          ? transformUri(currentPath).replace("/Site", "/site")
          : currentPath; // raw path from GitHub (correct casing)

        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: apiPath,
          ref: BRANCH,
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