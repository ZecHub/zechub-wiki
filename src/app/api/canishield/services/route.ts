import { NextResponse } from "next/server";
import { CANISHIELD_ORIGIN, parseServiceList } from "@/lib/canishield";

// Same-origin proxy for the list of exchanges and swaps Can I Shield tracks, so
// the Deposit Check tool needs no new connect-src. Only slug, name and kind
// leave this route.
export async function GET() {
  let upstream: Response;
  try {
    upstream = await fetch(`${CANISHIELD_ORIGIN}/api/results.json`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 3600 },
    });
  } catch {
    return NextResponse.json({ error: "Can I Shield did not respond." }, { status: 502 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ error: `Can I Shield returned ${upstream.status}.` }, { status: 502 });
  }

  const services = parseServiceList(await upstream.json().catch(() => null));
  if (services.length === 0) {
    return NextResponse.json({ error: "Can I Shield returned an unexpected list." }, { status: 502 });
  }
  return NextResponse.json(
    { services },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}
