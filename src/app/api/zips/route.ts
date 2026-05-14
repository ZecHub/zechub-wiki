import { loadZips } from "@/lib/zips/load-zips";

// Same cadence as /zips-grants — refresh from zips.z.cash at most once per
// hour. Clients that can't SSR (e.g. the Dashboard's dynamic-imported
// ZIPs tab) fetch this endpoint and get the same live data + fallback
// behavior as the server-rendered page.
export const revalidate = 3600;

export async function GET() {
  const data = await loadZips();
  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
