import { NextRequest, NextResponse } from "next/server";
import { resolveUri } from "../store";

// Short ids are produced by nanoid's default URL-safe alphabet
// (A-Za-z0-9_-). Reject anything else before touching storage.
const SHORT_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;

function notFound() {
  return NextResponse.json({ error: "Short link not found" }, { status: 404 });
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ shortId: string }> },
) {
  const { shortId } = await ctx.params;

  if (!SHORT_ID_RE.test(shortId)) {
    return notFound();
  }

  const uri = await resolveUri(shortId);
  if (!uri) {
    return notFound();
  }

  // Only redirect to the zcash: scheme we stored. Guards against the stored
  // value being abused as an open redirect to an arbitrary destination.
  if (!uri.toLowerCase().startsWith("zcash:")) {
    return notFound();
  }

  return NextResponse.redirect(uri, 302);
}
