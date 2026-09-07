export type ResearchSeriesId =
  | "zcash-foundations-series"
  | "zcash-formal-verification-series";

export type ResearchSeriesDef = {
  id: ResearchSeriesId;
  contentDir: string;
  href: string;
  wikiSlug: string;
  title: string;
  cardDescription: string;
  pageDescription: string;
  badge: string;
  emoji: string;
  tags: string[];
  cover?: { src: string; alt: string };
};

export const RESEARCH_SERIES: ResearchSeriesDef[] = [
  {
    id: "zcash-foundations-series",
    contentDir: "site/Research/zcash-foundations-series",
    href: "/research/zcash-foundations-series",
    wikiSlug: "research/zcash-foundations-series",
    title: "Zcash Foundations Series",
    cardDescription:
      "Foundational articles on shielded transactions, privacy models, and protocol design.",
    pageDescription:
      "A collection of foundational articles covering Zcash shielded transactions, privacy models, protocol design, and core concepts that power the network.",
    badge: "Core Series",
    emoji: "📚",
    tags: [
      "Shielded Transactions",
      "Privacy Models",
      "Protocol Design",
      "Zero Knowledge",
    ],
    cover: {
      src: "/research-covers/zcashfoundations.jpg",
      alt: "7 Articles learning Zcash from First Principles",
    },
  },
  {
    id: "zcash-formal-verification-series",
    contentDir: "site/Research/zcash-formal-verification-series",
    href: "/research/zcash-formal-verification-series",
    wikiSlug: "research/zcash-formal-verification-series",
    title: "Zcash Formal Verification Series",
    cardDescription:
      "What formal verification is, the 2026 Orchard soundness bug, and how Ironwood answered it with a machine-checked proof.",
    pageDescription:
      "A three-part series that explains formal verification from first principles, walks through the 2026 Orchard soundness bug, and shows how Ironwood answered it with a machine-checked mathematical proof.",
    badge: "New Series",
    emoji: "🔎",
    tags: [
      "Formal Verification",
      "Orchard",
      "Ironwood",
      "Protocol Security",
    ],
    cover: {
      src: "/research-covers/zcash-formal-verification.jpg",
      alt: "Formal verification of the Zcash shielded protocol",
    },
  },
];

export const RESEARCH_SERIES_IDS: ResearchSeriesId[] = RESEARCH_SERIES.map(
  (s) => s.id,
);

export function isResearchSeriesSlug(slug: string[] | undefined): boolean {
  return (
    !!slug &&
    slug.length === 2 &&
    slug[0] === "research" &&
    RESEARCH_SERIES_IDS.includes(slug[1] as ResearchSeriesId)
  );
}

export function getResearchSeries(id: string): ResearchSeriesDef | undefined {
  return RESEARCH_SERIES.find((s) => s.id === id);
}

export function isResearchSeriesPath(path: string): boolean {
  return RESEARCH_SERIES_IDS.some((id) => path.includes(id));
}
