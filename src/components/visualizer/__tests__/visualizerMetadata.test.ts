jest.mock("@/i18n/routing", () => ({
  routing: {
    defaultLocale: "en",
    locales: ["en", "de", "es"],
  },
}));

jest.mock("@/lib/localeCoverage", () => ({
  buildAlternatesAllLocales: (path: string, locale: string) => ({
    canonical:
      locale === "en"
        ? `https://zechub.wiki${path}`
        : `https://zechub.wiki/${locale}${path}`,
  }),
}));

jest.mock("@/lib/helpers", () => ({
  genMetadata: ({
    title,
    description,
    image,
    url,
    locale,
    alternates,
  }: {
    title: string;
    description: string;
    image: string;
    url: string;
    locale: string;
    alternates: unknown;
  }) => ({
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      images: image,
      url,
      locale,
    },
  }),
  getBanner: () => "/content-banners/bannertech.jpg",
}));

import { buildVisualizerMetadata } from "../visualizerMetadata";

function openGraphUrl(metadata: ReturnType<typeof buildVisualizerMetadata>) {
  return metadata.openGraph?.url?.toString();
}

describe("buildVisualizerMetadata", () => {
  it("uses module-specific metadata for the FROST visualizer", () => {
    const metadata = buildVisualizerMetadata({
      dictionary: {},
      locale: "en",
      searchParams: { module: "frost-multisig" },
    });

    expect(metadata.title).toBe(
      "FROST & Private Multi Signatures | ZecHub Visualizer",
    );
    expect(metadata.description).toBe(
      "Secure multisig without a single point of failure",
    );
    expect(openGraphUrl(metadata)).toBe(
      "https://zechub.wiki/visualizer?module=frost-multisig",
    );
  });

  it("uses localized module copy for Open Source Repositories", () => {
    const metadata = buildVisualizerMetadata({
      dictionary: {
        visualizer: {
          openSource: {
            title: "Repositorios de código abierto",
            description: "Contribuye a proyectos de código abierto de Zcash",
          },
        },
      },
      locale: "es",
      searchParams: { module: "open-source-repos" },
    });

    expect(metadata.title).toBe(
      "Repositorios de código abierto | ZecHub Visualizer",
    );
    expect(metadata.description).toBe(
      "Contribuye a proyectos de código abierto de Zcash",
    );
    expect(openGraphUrl(metadata)).toBe(
      "https://zechub.wiki/es/visualizer?module=open-source-repos",
    );
  });

  it("keeps the hub metadata for an invalid module", () => {
    const metadata = buildVisualizerMetadata({
      dictionary: {
        pages: {
          visualizer: {
            title: "Zcash Visualizers",
            description: "Explore the Zcash visualizer hub",
          },
        },
      },
      locale: "en",
      searchParams: { module: "not-a-real-module" },
    });

    expect(metadata.title).toBe("Zcash Visualizers | ZecHub");
    expect(metadata.description).toBe("Explore the Zcash visualizer hub");
    expect(openGraphUrl(metadata)).toBe("https://zechub.wiki/visualizer");
  });

  it("keeps the locale prefix in module OpenGraph URLs", () => {
    const metadata = buildVisualizerMetadata({
      dictionary: {},
      locale: "de",
      searchParams: { module: "frost-multisig" },
    });

    expect(openGraphUrl(metadata)).toBe(
      "https://zechub.wiki/de/visualizer?module=frost-multisig",
    );
  });
});
