import { NextRequest, NextResponse } from "next/server";
import { urlStore } from "../route";

// nanoid(8) ids from the POST handler.
const ID_RE = /^[A-Za-z0-9_-]{8}$/;

/**
 * Resolves a short link from POST /api/payment-request-uri/shorten by
 * redirecting to the stored zcash: URI, which hands it to the visitor's
 * wallet. Links live in the POST route's in-memory store, so they last only
 * as long as the server instance that created them.
 */
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const uri = ID_RE.test(id) ? urlStore.get(id) : undefined;

  if (!uri) {
    return NextResponse.json(
      { error: "Short link not found or expired" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const res = NextResponse.redirect(uri, 307);
  res.headers.set("Cache-Control", "no-store");
  return res;
}
