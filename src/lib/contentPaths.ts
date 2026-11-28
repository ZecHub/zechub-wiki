/**
 * Does a wiki URL name anything the content manifest knows about?
 *
 * The catch-all route falls back to a "browse the sidebar" view whenever it
 * finds no article file. That is right for a section root like /guides, but
 * wrong for a dead article URL like /zcash-tech/light-wallet-node, which
 * answers HTTP 200 with an empty placeholder instead of a 404.
 *
 * The menu-titles manifest lists every content file, so a URL is known if it
 * matches a file or any folder above one. When the English manifest is loaded,
 * it decides whether any route (articles, nested folders, or section landings)
 * is known content. That allows known section landings to keep rendering even
 * when directory listings fail during an upstream GitHub outage or rate limit.
 *
 * Only URLs the manifest has never heard of are treated as missing.
 */

/** Manifest keys are Title_Case_With_Underscores, URLs are kebab-case. */
const norm = (segment: string): string =>
  segment.toLowerCase().replace(/[-_ ]/g, "");

export function isKnownContentPath(
  slug: readonly string[],
  manifestKeys: readonly string[],
): boolean {
  if (slug.length === 0) return false;

  // An empty manifest means the fetch failed, not that the content vanished.
  // Falling back to the old behaviour keeps an outage from turning the wiki
  // into 404s.
  if (manifestKeys.length === 0) return true;

  const target = slug.map(norm).join("/");

  return manifestKeys.some((key) => {
    const parts = key
      .replace(/^site\//i, "")
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
 * Could this URL be served without guessing? Like isKnownContentPath, but a
 * page whose parent folder is known also passes.
 *
 * The manifest omits a few live files. Glossary_and_FAQs/Gallery/
 * Infographics.md is one: it sits in a folder beside the manifest's
 * Gallery.md, so its exact path is unknown while its parent is. Requiring the
 * parent rather than the page keeps those pages rendering and still rejects
 * made-up folders, which are what cost GitHub listings.
 */
export function isServableContentPath(
  slug: readonly string[],
  manifestKeys: readonly string[],
): boolean {
  if (isKnownContentPath(slug, manifestKeys)) return true;
  return slug.length > 1 && isKnownContentPath(slug.slice(0, -1), manifestKeys);
}
