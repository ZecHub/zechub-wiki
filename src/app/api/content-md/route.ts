import { NextRequest, NextResponse } from "next/server";
import {
  getLocalizedFileContentCached,
  getMenuTitlesCached,
} from "@/lib/authAndFetch";
import {
  SITE_DESCRIPTION,
  extractArticleMeta,
  getName,
  resolveContentPath,
} from "@/lib/helpers";
import { keyToWikiPath, toWikiUrl } from "@/lib/localeCoverage";
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

// Exact content-repo path for a wiki slug, read back out of the menu-titles
// manifest. Slug -> path resolution has to guess the original casing, and for
// irregularly-cased files it guesses wrong: `guides/coinholder_log_parser/
// help.md` and `tutorials/shieldedNewsletter/readme.md` both 404'd here while
// their HTML pages rendered fine. The manifest already holds the exact path,
// so consult it first and keep the slug resolver as the fallback for anything
// the manifest doesn't name.
async function manifestContentPath(slugArray: string[]): Promise<string | null> {
  try {
    const titles = await getMenuTitlesCached("en");
    const want = ("/" + slugArray.join("/")).toLowerCase();
    for (const key of Object.keys(titles ?? {})) {
      if (keyToWikiPath(key).toLowerCase() === want) return `/site/${key}`;
    }
  } catch {
    // Manifest unavailable — fall back to slug resolution, as before.
  }
  return null;
}

// Minimal YAML scalar: double-quoted, with backslashes and quotes escaped.
const yamlScalar = (s: string) =>
  `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

// Prepend title/url/locale front matter so a fetched .md is self-describing.
// Without it the body starts mid-content (wallets.md opens with "## [ZODL]")
// and an agent that fetched it has no title to cite and no canonical URL to
// link back to — the page is readable but not attributable.
//
// `last_updated` is deliberately absent: the app has no per-page date source,
// and the only way to get one is a GitHub commits-API call per page. Emitting
// the render time instead would be false precision, which is worse than the
// field being missing.
function withFrontMatter(
  markdown: string,
  locale: string,
  slugArray: string[],
): string {
  // A page that already carries front matter keeps its own — never wrap twice.
  if (/^﻿?---\r?\n/.test(markdown)) return markdown;

  const fallbackHeadline = getName(slugArray[slugArray.length - 1] ?? "");
  const meta = extractArticleMeta(markdown, fallbackHeadline);

  const fields = [
    `title: ${yamlScalar(meta.headline)}`,
    `url: ${yamlScalar(toWikiUrl(locale, "/" + slugArray.join("/")))}`,
    `locale: ${yamlScalar(locale)}`,
  ];
  // Omit rather than emit a generic stand-in: a description that describes the
  // site instead of the page misleads whatever is choosing between pages.
  if (meta.description && meta.description !== SITE_DESCRIPTION) {
    fields.push(`description: ${yamlScalar(meta.description)}`);
  }

  return `---\n${fields.join("\n")}\n---\n\n${markdown}`;
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
  const contentPath =
    (await manifestContentPath(slugArray)) ?? resolveContentPath(slugArray);
  const markdown = await getLocalizedFileContentCached(contentPath, locale).catch(
    () => null,
  );

  // `!== null` (not truthiness) so a legitimately empty page still serves as an
  // empty body rather than 404 — mirrors getLocalizedFileContentCached's own
  // empty-string handling.
  if (markdown === null) return notFound();

  return new NextResponse(withFrontMatter(markdown, locale, slugArray), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
