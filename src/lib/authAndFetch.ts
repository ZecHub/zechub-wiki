import { getFiles, transformUri } from "@/lib/helpers";
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";

const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env;

const authUser = GITHUB_TOKEN;
const owner = OWNER || "";
const repo = REPO || "";

const octokit = new Octokit({ auth: authUser });

// Normalize string for fuzzy matching
function normalize(str: string): string {
  return str.replace(/\.md$/i, "").toLowerCase().replace(/[-_ ]+/g, "");
}

export const getFileContentCached = unstable_cache(
  async (path: string) => {
    try {
      // Try the exact transformed path first
      try {
        const res = await octokit.rest.repos.getContent({
          owner,
          repo,
          path,
          ref: BRANCH,
        });
        // @ts-ignore
        return atob(res.data?.content || "");
      } catch {
        // Direct path failed → fuzzy fallback
      }

      // Fuzzy fallback: list real files in the folder and match by slug
      const folderPath = path.split("/").slice(0, -1).join("/");
      const realFiles = await getRootCached(folderPath);

      if (realFiles && realFiles.length > 0) {
        const slugPart = path.split("/").pop()?.replace(/\.md$/i, "") || "";
        const normalizedSlug = normalize(slugPart);

        for (const file of realFiles) {
          if (normalize(file) === normalizedSlug || normalize(file).includes(normalizedSlug)) {
            const res = await octokit.rest.repos.getContent({
              owner,
              repo,
              path: file,
              ref: BRANCH,
            });
            // @ts-ignore
            return atob(res.data?.content || "");
          }
        }
      }

      return null;
    } catch {
      return null;
    }
  },
  ["github-file-content-cache"],
  { 
    revalidate: false,          // ← FIXED: This is what Next.js accepts
    tags: ["github-content"] 
  }
);

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
  { 
    revalidate: 30, 
    tags: ["github-content"] 
  }
);

export async function getSiteFolders(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({ owner, repo, path, ref: BRANCH });
    const data = res.data;
    const elements = getFiles(data);
    return elements;
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
      .map((item: string) => {
        const fileName = item.split("/").pop() || "";
        return fileName.replace(/\.md$/, "");
      });
  } catch {
    return [];
  }
}
