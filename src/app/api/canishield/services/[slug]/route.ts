import { NextRequest, NextResponse } from "next/server";
import { CANISHIELD_ORIGIN, SLUG_RE, parseRecord } from "@/lib/canishield";

// Same-origin proxy for one exchange's deposit record from Can I Shield. The
// slug is checked before anything is fetched, and the reply is rebuilt from a
// fixed set of fields rather than passed through.
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "Unknown service." }, { status: 400 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${CANISHIELD_ORIGIN}/api/services/${slug}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
      next: { revalidate: 300 },
    });
  } catch {
    return NextResponse.json({ error: "Can I Shield did not respond." }, { status: 502 });
  }
  if (upstream.status === 404) {
    return NextResponse.json({ error: "Can I Shield has no deposit record for this service." }, { status: 404 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ error: `Can I Shield returned ${upstream.status}.` }, { status: 502 });
  }

  const record = parseRecord(await upstream.json().catch(() => null), slug);
  if (!record) {
    return NextResponse.json({ error: "Can I Shield returned an unexpected record." }, { status: 502 });
  }
  return NextResponse.json(record, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" },
  });
}
