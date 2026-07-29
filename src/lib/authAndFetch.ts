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

export const getFileContentCached = unstable_cache(
  async (path: string) => {
    if (!assertRepoConfig()) return null;
    const safePath = cleanPath(path);

    try {
      try {
        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: safePath,
          ref: branch,
        });
        // @ts-ignore
        return Buffer.from(res.data?.content || "", "base64").toString("utf-8");
      } catch (err: any) {
        console.log({
          "Error! Status": err.status,
          Message: err.response?.data?.message,
        });
      }

      const folderPath = safePath.split("/").slice(0, -1).join("/");
      const realFiles = await getRootCached(folderPath);
      if (realFiles?.length) {
        const slugPart = safePath.split("/").pop()?.replace(/\.md$/i, "") || "";
        const normalizedSlug = normalize(slugPart);
        for (const file of realFiles) {
          if (
            normalize(file) === normalizedSlug ||
            normalize(file).includes(normalizedSlug)
          ) {
            const res = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: cleanPath(file),
              ref: branch,
            });
            // @ts-ignore
            return Buffer.from(res.data?.content || "", "base64").toString(
              "utf-8",
            );
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

const getTranslationProbeCached = unstable_cache(
  async (path: string) => {
    if (!assertRepoConfig()) return null;
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: cleanPath(path),
        ref: branch,
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
