/**
 * Hero images for /research index cards (files in /public/research-covers/), matched to each
 * article’s topic from ZecHub/zechub site/Research/*.md. Falls back to explore/research.png when
 * a new article is added before this map is updated.
 */

export type ResearchCardCover = {
  src: string;
  alt: string;
};

/** `wikiSlug` is the path from transformGithubFilePathToWikiLink, e.g. `research/social-media-data-collection`. */
const COVERS: Record<string, ResearchCardCover> = {
  "research/cbdc": {
    src: "/research-covers/cbdc.webp",
    alt: "Central bank digital currency concept",
  },
  "research/dash-zcash-orchard-integration": {
    src: "/research-covers/dash-zcash-orchard.jpg",
    alt: "Team collaboration representing cross-chain integration",
  },
  "research/namadabestpractices": {
    src: "/research-covers/namada-best-practices.jpg",
    alt: "Mobile device and security concept for privacy practices",
  },
  "research/social-media-data-collection": {
    src: "/research-covers/social-media-data-collection.jpg",
    alt: "Social media apps and mobile screens",
  },
  "research/track-early-onchain-and-social-signals-for-zcash": {
    src: "/research-covers/track-onchain-social-zcash.jpg",
    alt: "Analytics dashboard and charts for on-chain metrics",
  },
  "research/zk-shielded-asset-platforms": {
    src: "/research-covers/zk-shielded-asset-platforms.jpg",
    alt: "Abstract cryptocurrency and blockchain technology",
  },
};

export function getResearchCardCover(wikiSlug: string): ResearchCardCover | null {
  const direct = COVERS[wikiSlug];
  if (direct) return direct;
  const entry = Object.entries(COVERS).find(
    ([k]) => k.toLowerCase() === wikiSlug.toLowerCase(),
  );
  return entry ? entry[1] : null;
}
