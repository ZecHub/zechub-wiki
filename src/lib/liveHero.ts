export const LIVE_HERO_IDS = [
  "start-here",
  "using-zcash",
  "guides",
  "zcash-tech",
  "organizations",
  "ecosystem",
  "zfav",
  "privacy-tools",
  "research",
  "glossary",
  "contribute",
  "tutorials",
] as const;

export type LiveHeroId = (typeof LIVE_HERO_IDS)[number];

const LIVE_HERO_BY_SLUG: Record<string, LiveHeroId> = {
  "start-here": "start-here",
  "using-zcash": "using-zcash",
  "zcash-use-cases": "using-zcash",
  guides: "guides",
  "zcash-tech": "zcash-tech",
  "zcash-organizations": "organizations",
  "zcash-community": "ecosystem",
  "zcash-social-media": "ecosystem",
  "zfav-club": "zfav",
  "privacy-tools": "privacy-tools",
  research: "research",
  "glossary-and-faqs": "glossary",
  contribute: "contribute",
  tutorials: "tutorials",
};

export function getLiveHero(slugSegment?: string | null): LiveHeroId | undefined {
  if (!slugSegment) return undefined;
  const key = slugSegment.replace(/_/g, "-").toLowerCase();
  return LIVE_HERO_BY_SLUG[key];
}
