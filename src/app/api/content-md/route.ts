import { NextRequest, NextResponse } from "next/server";
import { getLocalizedFileContentCached } from "@/lib/authAndFetch";
import { resolveContentPath } from "@/lib/helpers";
import { routing } from "@/i18n/routing";

// Raw-markdown endpoint for LLM/crawler discovery. Every content page is also
// reachable at its `.md` URL (wired via a rewrite in next.config.mjs), e.g.
// /using-zcash/shielded-pools.md and /es/using-zcash/shielded-pools.md. This
// returns the SAME localized markdown the HTML page renders from
// (getLocalizedFileContentCached), served as text/markdown, so bots get clean
// text instead of the JS-rendered page.
const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";
// Short negative-cache for misses. Without it, a flood of random `.md` paths
// (crawlers probing, link rot) would each miss the CDN and hit the shared
// GITHUB_TOKEN-backed fetch. 300s lets the edge absorb repeats cheaply while
// still letting a newly-added page appear within a few minutes.
const NOT_FOUND_CACHE_CONTROL = "public, s-maxage=300";

// Light backstop only — the underlying GitHub fetches are themselves cached
// (unstable_cache), so this route's own recompute cadence can stay coarse.
export const revalidate = 3600;

function notFound() {
  // Plain-text 404 (never HTML) so a crawler that follows a stale `.md` link
  // gets an unambiguous miss.
  return new NextResponse("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": NOT_FOUND_CACHE_CONTROL,
    },
  });
}

export async function GET(req: NextRequest) {
  // The `*.md` rewrite (next.config.mjs) is transparent, so the handler still
  // sees the ORIGINAL request path (e.g. "/using-zcash/x.md" or
  // "/es/using-zcash/x.md"). Derive the full pre-`.md` path from it; a bare
  // `?slug=` query is also honored (direct calls / tests). The locale prefix,
  // if any, is peeled off below so one handler serves every locale.
  const pathname = req.nextUrl.pathname;
  const fromPath = /\.md$/i.test(pathname)
    ? pathname.replace(/\.md$/i, "").replace(/^\/+/, "")
    : "";
  const raw = fromPath || (req.nextUrl.searchParams.get("slug") ?? "");
  const segments = raw.split("/").filter(Boolean);
  if (segments.length === 0) return notFound();

  // Only treat the first segment as a locale when it's a real supported locale
  // (routing.locales). English is served unprefixed, so a bare path is "en".
  let locale: string = routing.defaultLocale;
  let slugArray = segments;
  if ((routing.locales as readonly string[]).includes(segments[0])) {
    locale = segments[0];
    slugArray = segments.slice(1);
  }
  if (slugArray.length === 0) return notFound();

  // resolveContentPath (not getDynamicRoute) so research-series articles resolve
  // to the same one-folder-deeper, case-preserving path the HTML page renders
  // from — otherwise their `.md` URL 404s while the page serves 200.
  const contentPath = resolveContentPath(slugArray);
  const markdown = await getLocalizedFileContentCached(contentPath, locale).catch(
    () => null,
  );

  // `!== null` (not truthiness) so a legitimately empty page still serves as an
  // empty body rather than 404 — mirrors getLocalizedFileContentCached's own
  // empty-string handling.
  if (markdown === null) return notFound();

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
