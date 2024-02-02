import { Octokit } from "octokit"
import { getFiles, transformUri } from "@/lib/helpers"

const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env

const authUser = GITHUB_TOKEN

const owner = OWNER || ''
const repo = REPO || ''

const octokit = new Octokit({
  auth: authUser
});

export async function getFileContent(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: BRANCH
    })

    // @ts-ignore
    return atob(res.data?.content)
  } catch (error) {
    console.log(error);
  }
}

export async function getRoot(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: transformUri(path).replace('/Site', '/site'),
      ref: BRANCH
    })

    const data = res.data
    const elements = getFiles(data)
    return elements.filter((item: string) => item.endsWith(".md"))
 
  } catch (error) {
    console.log(error);
  }
}

export async function getSiteFolders(path: string){
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
      ref: BRANCH
    })

    const data = res.data
    const elements = getFiles(data)
    return elements
 
  } catch (error) {
    console.log(error);
  }
}



