import { getName, resolveContentPath } from "./helpers";

/**
 * Breadcrumb trail for a wiki page, derived from its URL slug.
 *
 * Research articles already render a hand-written "Wiki / Research / ..." trail
 * inside MdxContainer. Every other article got its content and side menu with
 * nothing saying where the page sits, which is a problem when someone arrives
 * on a deep page straight from search or a shared link.
 *
 * Labels come from the same source the side menu uses, so the trail and the
 * menu never disagree: the content repo's translated menu-titles manifest,
 * then the English manifest, then the curated `menuLabels` dictionary, then the
 * filename. Only leaf pages exist in the manifest (it is keyed by ".md" path),
 * so section segments fall through to `menuLabels`, which is where their
 * translations live anyway.
 */

export interface BreadcrumbItem {
  /** Display text, already localized. */
  label: string;
  /** Locale-less wiki path, e.g. "/using-zcash". The last item is the current page. */
  href: string;
}

export interface BuildBreadcrumbsInput {
  /** URL slug segments, e.g. ["using-zcash", "payment-processors"]. */
  slug: string[];
  /** Menu-titles manifest for the active locale, keyed "Using_Zcash/Payment_Processors.md". */
  titles?: Record<string, string>;
  /** English manifest, used when the active locale has no entry. */
  enTitles?: Record<string, string>;
  /** Dictionary `menuLabels`, keyed by the English display name. */
  menuLabels?: Record<string, string>;
  /** Label for the first crumb. Matches the research layout's wording by default. */
  rootLabel?: string;
}

/** The manifest key for a slug: its content path minus the "site/" prefix. */
export const manifestKey = (slug: string[]): string =>
  resolveContentPath(slug).replace(/^\/?site\//, "");

/**
 * Look a key up ignoring case.
 *
 * The manifest is keyed by the file's real name on disk ("NU5.md",
 * "What_a_Block_Explorer_Can_See.md") while the slug transform re-capitalises
 * every word ("Nu5.md", "What_A_Block_Explorer_Can_See.md"). page.tsx settles
 * the same difference by fuzzy-matching a fetched directory listing; this is
 * the pure equivalent. Without it 37 of the 205 English entries miss and those
 * pages show a filename instead of their real title.
 */
const findTitle = (
  manifest: Record<string, string>,
  key: string,
): string | undefined => {
  const exact = manifest[key];
  if (exact !== undefined) return exact;

  const wanted = key.toLowerCase();
  for (const name of Object.keys(manifest)) {
    if (name.toLowerCase() === wanted) return manifest[name];
  }
  return undefined;
};

export function buildBreadcrumbs({
  slug,
  titles = {},
  enTitles = {},
  menuLabels = {},
  rootLabel = "Wiki",
}: BuildBreadcrumbsInput): BreadcrumbItem[] {
  const segments = slug.filter((segment) => segment.trim() !== "");
  const trail: BreadcrumbItem[] = [{ label: rootLabel, href: "/" }];

  segments.forEach((_, i) => {
    const upTo = segments.slice(0, i + 1);
    const key = manifestKey(upTo);
    // Same call shape the side menu uses for its own labels: getName wants the
    // hyphenated slug with a leading capital, not the underscored content path.
    const segment = upTo[upTo.length - 1];
    const fallback = getName(segment.charAt(0).toUpperCase() + segment.slice(1));

    trail.push({
      label:
        findTitle(titles, key) ??
        findTitle(enTitles, key) ??
        menuLabels[fallback] ??
        fallback,
      href: `/${upTo.join("/")}`,
    });
  });

  return trail;
}
