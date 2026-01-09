import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const ALLOWED_PATHS = [
  "wallets.md",
  "docs/wallets.md",
  `/site/Using_Zcash/Wallets.md`,
];

export const revalidate = 300; // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");

  if (!path || !ALLOWED_PATHS.includes(path)) {
    return NextResponse.json(
      { error: "Invalid or disallowed path" },
      { status: 400 }
    );
  }

  const { GITHUB_TOKEN, OWNER, REPO, BRANCH } = process.env;

  if (!GITHUB_TOKEN || !OWNER || !REPO) {
    return NextResponse.json(
      {
        error: "Missing env variables!",
      },
      { status: 5000 }
    );
  }

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  const res = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
    ref: BRANCH,
  });

  return NextResponse.json(res.data);
}
