import { keyToWikiPath } from "@/lib/wikiPaths";

/**
 * Does a wiki URL name anything the content manifest knows about?
 *
 * The catch-all route falls back to a "browse the sidebar" view whenever it
 * finds no article file. That is right for a section root like /guides, but
 * wrong for a dead article URL like /zcash-tech/light-wallet-node, which
 * answers HTTP 200 with an empty placeholder instead of a 404.
 *
 * The menu-titles manifest lists every content file, so a URL is known if it
 * matches a file or any folder above one. That keeps two cases on their
 * current path: real folders such as /guides/frostdemo, and articles that the
 * route already fails to render for unrelated reasons (several nested ones
 * land on the browse view today). Only URLs the manifest has never heard of
 * are treated as missing.
 */

/** Manifest keys are Title_Case_With_Underscores, URLs are kebab-case. */
const norm = (segment: string): string =>
  segment.toLowerCase().replace(/[-_ ]/g, "");

export function isKnownContentPath(
  slug: readonly string[],
  manifestKeys: readonly string[],
): boolean {
  if (slug.length === 0) return false;

  // A section root is browsable on the strength of its folder listing, which
  // the caller has already checked.
  if (slug.length === 1) return true;

  // An empty manifest means the fetch failed, not that the content vanished.
  // Falling back to the old behaviour keeps an outage from turning the wiki
  // into 404s.
  if (manifestKeys.length === 0) return true;

  const target = slug.map(norm).join("/");

  return manifestKeys.some((key) => {
    const parts = key
      .replace(/\.mdx?$/i, "")
      .split("/")
      .filter(Boolean);
    // The file itself, then every folder above it.
    for (let i = parts.length; i >= 1; i--) {
      if (parts.slice(0, i).map(norm).join("/") === target) return true;
    }
    return false;
  });
}

/**
 * The content-repo file an article URL names, read from the manifest.
 *
 * The catch-all route otherwise derives the path by re-capitalising the URL
 * (getDynamicRoute), and the fetch only forgives a mismatch in the file name,
 * not in its folders. So articles whose folders don't follow the Title_Case
 * convention never load: /archive/... (the folder is `archive`), the ZFAV Club
 * guides (`Guides`, not `guides`), /tutorials/shieldednewsletter/readme
 * (`shieldedNewsletter`) and /tutorials/zenithserver/zenithbeta. The manifest
 * holds every file's real path, and the sitemap and search index already turn
 * those paths into these URLs, so matching the URL against it gives the exact
 * file.
 *
 * Returns a `/site/...md` path in the same form as getDynamicRoute, or null
 * when the manifest has no file for this URL (a section root, an unknown URL,
 * or an unavailable manifest), in which case the caller keeps deriving it.
 */
export function manifestContentPath(
  slug: readonly string[],
  manifestKeys: readonly string[],
): string | null {
  if (slug.length === 0) return null;
  const target = "/" + slug.map((s) => s.toLowerCase()).join("/");
  const key = manifestKeys.find(
    (k) => /\.md$/i.test(k) && keyToWikiPath(k) === target,
  );
  return key ? `/site/${key.replace(/^\/*(site\/)?/, "")}` : null;
}
