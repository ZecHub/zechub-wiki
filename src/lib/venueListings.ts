import { getLocalizedFileContentCached } from "@/lib/authAndFetch";
import { parseVenueMarkdown, type Venue } from "@/lib/parseVenueMarkdown";

export const VENUE_CONTENT_PATHS = {
  custodial: "site/Using_Zcash/Custodial_Exchanges.md",
  dex: "site/Using_Zcash/DEX.md",
  centralizedSwaps: "site/Using_Zcash/Centralized_Swaps.md",
} as const;

export type VenueKind = keyof typeof VENUE_CONTENT_PATHS;

export async function getVenuesFromMarkdown(
  kind: VenueKind,
  locale: string,
  fallback: Venue[] = [],
): Promise<Venue[]> {
  try {
    const markdown = await getLocalizedFileContentCached(
      VENUE_CONTENT_PATHS[kind],
      locale,
    );
    if (!markdown) return fallback;
    const parsed = parseVenueMarkdown(markdown);
    return parsed.length ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function exchangesToVenues(
  rows: Array<{
    name: string;
    url: string;
    pairs: string;
    support: string;
    depositTime: string;
    logo: string;
    altText: string;
  }>,
): Venue[] {
  return rows.map((row) => ({
    name: row.name,
    url: row.url,
    pairs: row.pairs,
    support: row.support,
    depositTime: row.depositTime,
    logo: row.logo,
    altText: row.altText,
  }));
}

export function cardsToVenues(
  rows: Array<{
    title: string;
    description: string;
    url: string;
    image: string;
  }>,
): Venue[] {
  return rows.map((row) => ({
    name: row.title,
    url: row.url,
    description: row.description,
    logo: row.image,
    altText: row.title,
  }));
}
