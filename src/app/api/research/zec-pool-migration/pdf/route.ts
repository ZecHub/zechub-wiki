import { NextResponse } from "next/server";

const PDF_PATH =
  "site/Research/zec-pool-migration/zcash_pool_migration_guide_zechub_v1_1_2026-09-18.pdf";

export async function GET() {
  const owner = process.env.OWNER;
  const repo = process.env.REPO;
  const branch = process.env.BRANCH || "main";
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo) {
    return new NextResponse("OWNER or REPO missing", { status: 500 });
  }

  const url =
    `https://api.github.com/repos/${owner}/${repo}/contents/${PDF_PATH}` +
    `?ref=${encodeURIComponent(branch)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.raw+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return new NextResponse(`PDF fetch failed: ${response.status}`, {
      status: response.status,
    });
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'inline; filename="zcash_pool_migration_guide_zechub_v1_1_2026-09-18.pdf"',
    },
  });
}
