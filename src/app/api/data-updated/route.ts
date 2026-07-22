import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for the GitHub "commits for a data file" call that charts
// use to show a "last updated" date. Previously the browser hit
// api.github.com directly (leaking which chart/data page was loaded, and
// burning GitHub's 60 req/hr/IP unauthenticated limit). This route uses the
// server-side GITHUB_TOKEN and caches aggressively (commit dates change rarely).
//
// The response is the GitHub commits array verbatim, so existing client parsing
// (helpers.getLastUpdatedDate) is unchanged.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

// Only allow reading commit history for in-repo data files.
const PATH_RE = /^public\/data\/[A-Za-z0-9._/-]+\.json$/;

function cached(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path || path.includes("..") || !PATH_RE.test(path)) {
    return NextResponse.json({ error: "invalid path" }, { status: 400 });
  }

  const url =
    `https://api.github.com/repos/ZecHub/zechub-wiki/commits` +
    `?path=${encodeURIComponent(path)}&per_page=1`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ZecHub-App",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const upstream = await fetch(url, { headers, next: { revalidate: 3600 } });
    if (!upstream.ok) {
      // Degrade gracefully: an empty array makes getLastUpdatedDate return "N/A".
      return cached([]);
    }
    return cached(await upstream.json());
  } catch {
    return cached([]);
  }
}
