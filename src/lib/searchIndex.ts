import type { Searcher } from "@/types";
import { keyToWikiPath } from "@/lib/wikiPaths";

export type MenuTitles = Record<string, string>;

type BuildSearchIndexOptions = {
  englishTitles: MenuTitles;
  localizedTitles?: MenuTitles;
  staticEntries: readonly Searcher[];
};

type ManifestEntry = {
  englishTitle: string;
  title: string;
  url: string;
};

const normalizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return "";

  const withoutTrailingSlash = trimmed.replace(/\/+$/, "");
  return (withoutTrailingSlash || "/").toLowerCase();
};

const uniqueNonEmpty = (values: readonly string[]): string[] => {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) continue;
    seen.add(key);
    unique.push(trimmed);
  }

  return unique;
};

const pathAliases = (url: string): string[] => {
  const parts = url.split("/").filter(Boolean);
  if (!parts.length) return [];

  const toWords = (value: string) => value.replace(/[-_]+/g, " ");
  return uniqueNonEmpty([
    toWords(parts.join(" ")),
    toWords(parts[parts.length - 1] ?? ""),
  ]);
};

const manifestDescription = (url: string): string => {
  const section = url
    .split("/")
    .filter(Boolean)[0]
    ?.replace(/[-_]+/g, " ");

  return section
    ? `Read this ${section} page on the ZecHub Wiki.`
    : "Read this page on the ZecHub Wiki.";
};

const manifestEntries = (
  englishTitles: MenuTitles,
  localizedTitles: MenuTitles,
): ManifestEntry[] => {
  const byUrl = new Map<string, ManifestEntry>();

  for (const [key, englishTitle] of Object.entries(englishTitles)) {
    const title = (localizedTitles[key] || englishTitle).trim();
    const url = keyToWikiPath(key);
    const normalizedUrl = normalizeUrl(url);
    if (!title || !normalizedUrl || byUrl.has(normalizedUrl)) continue;

    byUrl.set(normalizedUrl, { englishTitle, title, url });
  }

  return [...byUrl.values()];
};

const withAliases = (
  entry: Searcher,
  aliases: readonly string[],
): Searcher => {
  const nextAliases = uniqueNonEmpty(aliases).filter(
    (alias) => alias.toLowerCase() !== entry.name.toLowerCase(),
  );

  return nextAliases.length > 0 ? { ...entry, aliases: nextAliases } : entry;
};

/**
 * Merge the curated static search records with every English content route.
 *
 * Static records keep their descriptions and custom aliases. Manifest records
 * supply the canonical title for the active locale and add path aliases for
 * pages whose human title does not contain useful route terms. Empty manifests
 * return the static index unchanged, which is the safe production fallback for
 * a temporary manifest fetch failure.
 */
export function buildSearchIndex({
  englishTitles,
  localizedTitles = {},
  staticEntries,
}: BuildSearchIndexOptions): Searcher[] {
  const manifests = manifestEntries(englishTitles, localizedTitles);
  const manifestByUrl = new Map(
    manifests.map((entry) => [normalizeUrl(entry.url), entry] as const),
  );
  const seenUrls = new Set<string>();
  const index: Searcher[] = [];

  for (const staticEntry of staticEntries) {
    const normalizedUrl = normalizeUrl(staticEntry.url);
    if (!normalizedUrl || seenUrls.has(normalizedUrl)) continue;
    seenUrls.add(normalizedUrl);

    const manifest = manifestByUrl.get(normalizedUrl);
    if (!manifest) {
      index.push(withAliases(staticEntry, staticEntry.aliases ?? []));
      continue;
    }

    index.push(
      withAliases(
        {
          ...staticEntry,
          name: manifest.title,
        },
        [
          staticEntry.name,
          ...(staticEntry.aliases ?? []),
          manifest.englishTitle,
          ...pathAliases(manifest.url),
        ],
      ),
    );
  }

  for (const manifest of manifests) {
    const normalizedUrl = normalizeUrl(manifest.url);
    if (seenUrls.has(normalizedUrl)) continue;
    seenUrls.add(normalizedUrl);

    index.push(
      withAliases(
        {
          name: manifest.title,
          desc: manifestDescription(manifest.url),
          url: manifest.url,
        },
        [manifest.englishTitle, ...pathAliases(manifest.url)],
      ),
    );
  }

  return index;
}
