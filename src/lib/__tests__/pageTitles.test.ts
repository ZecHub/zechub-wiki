// These routes used to fall back to the site-wide "ZecHub Wiki" title.
jest.mock("@/i18n/routing", () => ({ routing: { defaultLocale: "en", locales: ["en", "es"] } }));
jest.mock("@/lib/localeCoverage", () => ({
  buildAlternatesAllLocales: (path: string, locale: string) => ({ canonical: path, locale }),
}));
jest.mock("@/lib/helpers", () => ({
  genMetadata: (opts: Record<string, unknown>) => opts,
  getBanner: () => "",
}));

// The page bodies are not under test.
jest.mock("@/components/Charts/Zcash/ChainState/ChainStatePage", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/Gallery/Gallery", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/Hackathon/Hackathon", () => ({ __esModule: true, default: () => null }));
jest.mock("@/lib/fetchHackathonGithubProjects", () => ({ fetchHackathonGithubProjects: jest.fn() }));
jest.mock("@/components/NewsLetter/NewsLetter", () => ({ __esModule: true, default: () => null }));
jest.mock("../../app/[locale]/zebra/ZebraComponent", () => ({ __esModule: true, default: () => null }));
jest.mock("../../app/[locale]/research/zec-pool-migration/view/PoolMigrationViewer", () => ({
  __esModule: true,
  default: () => null,
}));

type Meta = { title?: string; description?: string; url?: string; alternates?: unknown };
type RouteModule = {
  generateMetadata: (props: { params: Promise<{ locale: string }> }) => Promise<Meta>;
};

const ROUTES: Array<[string, () => RouteModule]> = [
  ["/chain-stats", () => require("../../app/[locale]/chain-stats/page")],
  ["/gallery", () => require("../../app/[locale]/gallery/page")],
  ["/hackathon", () => require("../../app/[locale]/hackathon/page")],
  ["/newsletter", () => require("../../app/[locale]/newsletter/page")],
  ["/protocol-parameters", () => require("../../app/[locale]/protocol-parameters/layout")],
  ["/research/zec-pool-migration/view", () => require("../../app/[locale]/research/zec-pool-migration/view/page")],
  ["/zebra", () => require("../../app/[locale]/zebra/page")],
  ["/zechub-tutorial", () => require("../../app/[locale]/zechub-tutorial/layout")],
];

const metadataFor = (load: () => RouteModule, locale = "en") =>
  load().generateMetadata({ params: Promise.resolve({ locale }) });

describe("page titles", () => {
  it.each(ROUTES)("%s has its own title, description and canonical URL", async (route, load) => {
    const meta = await metadataFor(load);

    expect(meta.title).toMatch(/\S \| ZecHub$/);
    expect(meta.description).toEqual(expect.any(String));
    expect(meta.url).toBe(`https://zechub.wiki${route}`);
    expect(meta.alternates).toEqual({ canonical: route, locale: "en" });
  });

  it("gives every page a different title", async () => {
    const titles = await Promise.all(ROUTES.map(async ([, load]) => (await metadataFor(load)).title));

    expect(new Set(titles).size).toBe(ROUTES.length);
  });

  it("prefixes the URL with a non-default locale", async () => {
    const [, load] = ROUTES.find(([route]) => route === "/zebra")!;
    const meta = await metadataFor(load, "es");

    expect(meta.url).toBe("https://zechub.wiki/es/zebra");
    expect(meta.alternates).toEqual({ canonical: "/zebra", locale: "es" });
  });
});
