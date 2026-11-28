import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { timingSafeEqual } from "node:crypto";

// Constant-time secret check. Returns false (never throws) when either side is
// missing, so an unconfigured REVALIDATE_SECRET fails closed.
function secretMatches(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // Run a same-length compare so the branch does not leak length via timing.
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

// Read the secret from the Authorization header ("Bearer <secret>") rather than a
// query string, so it is never written to access logs, browser history, or the
// Referer header of links on a page that triggered revalidation.
function bearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  if (!secretMatches(bearerToken(request), process.env.REVALIDATE_SECRET)) {
    return new Response("Invalid secret", { status: 401 });
  }

  await revalidateTag("github-content", { expire: 0 });

  return Response.json({
    success: true,
    message: "All markdown cache cleared!",
  });
}
