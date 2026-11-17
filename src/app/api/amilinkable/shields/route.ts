import { NextResponse } from "next/server";
import { AMILINKABLE_ORIGIN, parseSnapshot } from "@/lib/amilinkable/snapshot";

// Same-origin proxy for Am I Linkable's public snapshot of the last 30 days of
// shield (transparent -> shielded) deposits. Everyone gets the same file, and
// the amount a visitor checks never leaves their browser: the matching runs in
// the Linkability Check tool, not here.
export async function GET() {
  let upstream: Response;
  try {
    upstream = await fetch(`${AMILINKABLE_ORIGIN}/api/v1/shields`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 300 },
    });
  } catch {
    return NextResponse.json({ error: "Am I Linkable did not respond." }, { status: 502 });
  }
  if (!upstream.ok) {
    return NextResponse.json({ error: `Am I Linkable returned ${upstream.status}.` }, { status: 502 });
  }
  const snapshot = parseSnapshot(await upstream.json().catch(() => null));
  if (!snapshot) {
    return NextResponse.json({ error: "Am I Linkable returned an unexpected snapshot." }, { status: 502 });
  }
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
