import { Octokit } from "octokit"

const { GITHUB_TOKEN, OWNER, REPO } = process.env

const authUser = GITHUB_TOKEN

const owner = OWNER || ''
const repo = REPO || ''

const octokit = new Octokit({
  auth: authUser,
});

export async function getFileContent(path: string) {
  try {
    const res = await octokit.rest.repos.getContent({
      owner: owner,
      repo: repo,
      path: path,
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
      path: path,
    })

    const data = res.data
    const elements = getFiles(data)
    const items = elements.filter((item: string) => item.endsWith(".md"))

    return items

  } catch (error) {
    console.log(error);
  }
}


const getFiles = (data: any) => {
  const items = data.filter((e: any) => e.path).map((element: any) => element.path)
  return items
}


