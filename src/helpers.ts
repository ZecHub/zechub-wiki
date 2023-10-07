import { Octokit } from "octokit"
import { Path } from '@/types'
import type { MDXRemoteSerializeResult } from "next-mdx-remote/rsc"
const authUser = "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"

const owner = "ManyRios"
const repo = "zechub"

const octokit = new Octokit({
  auth: authUser,
});

export async function getFileContent(path: string) {
  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: owner,
        repo: repo,
        path: path,
      }
    );

    // @ts-ignore
    return atob(res.data?.content)
  } catch (error) {
    console.log(error);
  }
}

export async function getRoot(path: string) {
  try {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: owner,
        repo: repo,
        path: path,
      }
    );
    // @ts-ignore
    return atob(res.data?.content)

  } catch (error) {
    console.log(error);
  }
}

