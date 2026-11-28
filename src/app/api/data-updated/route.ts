import { NextRequest, NextResponse } from "next/server";
import { DATA_URL, DATE_URL } from "@/lib/chart/data-url";

// Same-origin proxy for the GitHub "commits for a data file" call that charts
// use to show a "last updated" date. Previously the browser hit
// api.github.com directly (leaking which chart/data page was loaded, and
// burning GitHub's 60 req/hr/IP unauthenticated limit). This route uses the
// server-side GITHUB_TOKEN and caches aggressively (commit dates change rarely).
//
// The response is the GitHub commits array verbatim, so existing client parsing
// (helpers.getLastUpdatedDate) is unchanged.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

// Only proxy commit history for the specific data files the app itself asks
// about. DATA_URL/DATE_URL are the single source of every /api/data-updated
// request the client issues (via getCommitUrlForTab), so deriving the allowlist
// from them keeps the two in lockstep: add a chart's entry there and it is
// covered here. Anything else is rejected before it can spend a metered,
// GITHUB_TOKEN-authenticated call — otherwise any well-formed public/data/*.json
// path (existing or not) is one such call, cached per-URL only, so a flood of
// unique paths drains the shared 5,000/hour core quota.
const ALLOWED_PATHS: ReadonlySet<string> = new Set(
  [...Object.values(DATA_URL), ...Object.values(DATE_URL)].flatMap((u) => {
    const i = u.indexOf("path=");
    return i === -1 ? [] : [decodeURIComponent(u.slice(i + 5).split("&")[0])];
  }),
);

function cached(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path || !ALLOWED_PATHS.has(path)) {
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
