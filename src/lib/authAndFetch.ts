import { getFiles, transformUri } from "@/lib/helpers";
import { unstable_cache } from "next/cache";
import { Octokit } from "octokit";

const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env;

const authUser = GITHUB_TOKEN;

const owner = OWNER || "";
const repo = REPO || "";

const octokit = new Octokit({
  auth: authUser,
});

type MdFetchResult = { content: string; etag?: string };

const memCache = new Map<
  string,
  { content: string; etag?: string; ts: number }
>();
const TTL_MS = 60_000; // This keep fresh for 60s, still 'runtime fresh' for most use case

// export async function getMarkdown(path:string):Promise<MdFetchResult|null> {
//   const key = `md:${path}`
//   const cached = memCache.get(key);
//   if(cached && Date.now()-cached.ts<TTL_MS){
//     return{content:cached.content, etag:cached.etag}
//   }

//   const url = path;
//   const headers:Record<string,string>={}
//   if(cached?.etag){
//     headers['If-None-Match'] = cached.etag
//   }

//       const res = await octokit.rest.repos.getContent({
//         owner: owner,
//         repo: repo,
//         path: path,
//         ref: BRANCH,
//       });

// }

export const getFileContentCached = unstable_cache(
  async (path: string) => {
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: BRANCH,
      });

      // @ts-ignore
      return atob(res.data?.content);
    } catch (err) {
      console.error("[getFileContent] failed:", err);
      return { error: err as Error };
    }
  },
  ["github-md-cache"],
  { revalidate: 60 * 5 } // cache for 5 min
);

export async function getFileContent(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: BRANCH,
    });

    // @ts-ignore
    return atob(res.data?.content);
  } catch (error) {
    console.log("getFileContent: ", error);
    return undefined;
  }
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
  ["github-md-cache"],
  { revalidate: 60 * 5 } // cache for 5 min
);

export async function getRoot(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: transformUri(path).replace("/Site", "/site"),
      ref: BRANCH,
    });

    const data = res.data;
    const elements = getFiles(data);
    return elements.filter((item: string) => item.endsWith(".md"));
  } catch (error) {
    console.log("getRoot: ", error);
    return undefined;
  }
}

export async function getSiteFolders(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: BRANCH,
    });

    const data = res.data;
    const elements = getFiles(data);
    return elements;
  } catch (error) {
    console.log("getSiteFolders: ", error);
    return undefined;
  }
}


export async function getRootFileName(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: transformUri(path).replace('/Site', '/site'),
      ref: BRANCH
    });

    const data = res.data;
    const elements = getFiles(data);

    return elements
      .filter((item: string) => item.endsWith(".md"))
      .map((item: string) => {
        const fileName = item.split("/").pop() || ""; // get last part of path
        return fileName.replace(/\.md$/, ""); // remove extension
      });
  } catch (error) {
    console.log("getRoot: ", error);
    return undefined;
  }
}

