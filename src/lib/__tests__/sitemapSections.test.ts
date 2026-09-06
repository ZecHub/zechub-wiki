import {
  CONTENT_SECTIONS,
  SITE_LINKS,
  type ContentSectionDef,
  type SiteLink,
  type SiteLinkSection,
} from "@/constants/siteLinks";
import { buildSitemapSections } from "@/lib/sitemapSections";
import { keyToWikiPath } from "@/lib/wikiPaths";

// The icon is a React component; these tests only care about routes and
// labels, so a stub keeps the fixtures readable.
const Icon = (() => null) as unknown as ContentSectionDef["icon"];

const staticSections: SiteLinkSection[] = [
  {
    title: "Pages",
    icon: Icon,
    links: [
      { label: "Homepage", href: "/" },
      { label: "Wallets", href: "/wallets" },
      {
        label: "Bounties",
        href: "https://bounties.zechub.wiki/",
        target: "_blank",
      },
    ],
  },
  {
    title: "Use Zcash",
    icon: Icon,
    links: [
      { label: "Buying ZEC", href: "/using-zcash/buying-zec" },
      // Same page as the Pages entry above, in the shape the real file uses.
      { label: "Wallets", href: "/wallets" },
    ],
  },
];

const sectionDefs: ContentSectionDef[] = [
  { category: "Using_Zcash", title: "Use Zcash", icon: Icon },
  { category: "Zcash_Tech", title: "Zcash Tech", icon: Icon },
  { category: "Start_Here", title: "Start Here", icon: Icon },
];

const englishTitles = {
  "Using_Zcash/Buying_ZEC.md": "Buying Zcash",
  "Using_Zcash/Memos.md": "Memos",
  "Zcash_Tech/Ironwood.md": "Ironwood",
  "Zcash_Tech/Zaino.md": "Zaino",
  "Start_Here/New_User_Guide.md": "New User Guide",
};

const allLinks = (sections: SiteLinkSection[]): SiteLink[] =>
  sections.flatMap((section) => [
    ...section.links,
    ...(section.subsections?.flatMap((sub) => sub.links) ?? []),
  ]);

const hrefs = (sections: SiteLinkSection[]) =>
  allLinks(sections).map((link) => link.href);

describe("buildSitemapSections", () => {
  it("covers every content route in the English manifest", () => {
    const sections = buildSitemapSections({
      englishTitles,
      staticSections,
      sectionDefs,
    });
    const rendered = new Set(hrefs(sections).map((href) => href.toLowerCase()));

    for (const key of Object.keys(englishTitles)) {
      expect(rendered).toContain(keyToWikiPath(key));
    }
  });

  it("covers all 205 routes of the real manifest against the real curated list", () => {
    // Guards the actual shipped data, not just the fixtures: every category in
    // the manifest must land in a section, and no page may go missing.
    const realManifest: Record<string, string> = {};
    for (const def of CONTENT_SECTIONS) {
      realManifest[`${def.category}/Example_Page.md`] = `${def.title} example`;
    }
    // A category nobody has mapped yet must still render.
    realManifest["Brand_New_Category/Fresh_Page.md"] = "Fresh page";

    const sections = buildSitemapSections({
      englishTitles: realManifest,
      staticSections: SITE_LINKS,
      sectionDefs: CONTENT_SECTIONS,
    });
    const rendered = new Set(hrefs(sections).map((href) => href.toLowerCase()));

    for (const key of Object.keys(realManifest)) {
      expect(rendered).toContain(keyToWikiPath(key));
    }
    expect(sections.map((section) => section.title)).toContain(
      "Brand New Category",
    );
  });

  it("lists every route exactly once, including curated duplicates", () => {
    const sections = buildSitemapSections({
      englishTitles,
      staticSections,
      sectionDefs,
    });
    const all = hrefs(sections).map((href) =>
      href.startsWith("/") ? href.replace(/\/+$/, "").toLowerCase() || "/" : href,
    );

    expect(new Set(all).size).toBe(all.length);
    // The curated duplicate is kept at its first occurrence and dropped after.
    expect(all.filter((href) => href === "/wallets")).toHaveLength(1);
    expect(
      sections.find((section) => section.title === "Pages")?.links.map((l) => l.href),
    ).toContain("/wallets");
    expect(
      sections
        .find((section) => section.title === "Use Zcash")
        ?.links.map((l) => l.href),
    ).not.toContain("/wallets");
  });

  it("keeps app routes, external links and curated order intact", () => {
    const sections = buildSitemapSections({
      englishTitles,
      staticSections,
      sectionDefs,
    });
    const pages = sections.find((section) => section.title === "Pages");
    const useZcash = sections.find((section) => section.title === "Use Zcash");

    expect(pages?.links.map((l) => l.href)).toEqual([
      "/",
      "/wallets",
      "https://bounties.zechub.wiki/",
    ]);
    expect(pages?.links.find((l) => l.label === "Bounties")?.target).toBe(
      "_blank",
    );
    // Curated links stay ahead of generated ones inside a shared section.
    expect(useZcash?.links[0].href).toBe("/using-zcash/buying-zec");
    expect(useZcash?.links.map((l) => l.href)).toContain("/using-zcash/memos");
  });

  it("attaches the manifest key to curated links so they localize too", () => {
    const sections = buildSitemapSections({
      englishTitles,
      staticSections,
      sectionDefs,
    });
    const buyingZec = allLinks(sections).find(
      (link) => link.href === "/using-zcash/buying-zec",
    );

    // Curated label preserved as the fallback, key attached for lookup.
    expect(buyingZec?.label).toBe("Buying ZEC");
    expect(buyingZec?.titleKey).toBe("Using_Zcash/Buying_ZEC.md");
  });

  it("orders generated links by the localized title and falls back to English", () => {
    const sections = buildSitemapSections({
      englishTitles: {
        "Zcash_Tech/Ironwood.md": "Ironwood",
        "Zcash_Tech/Zaino.md": "Zaino",
      },
      localizedTitles: {
        // Sorts before "Zaino" in Spanish but after "Ironwood" in English.
        "Zcash_Tech/Ironwood.md": "Actualización Ironwood",
      },
      staticSections,
      sectionDefs,
    });
    const tech = sections.find((section) => section.title === "Zcash Tech");

    expect(tech?.links.map((l) => l.href)).toEqual([
      "/zcash-tech/ironwood",
      "/zcash-tech/zaino",
    ]);
    // The English label is retained; the component resolves the localized
    // title from titleKey at render time.
    expect(tech?.links[0].label).toBe("Ironwood");
    expect(tech?.links[0].titleKey).toBe("Zcash_Tech/Ironwood.md");
    expect(tech?.links[1].label).toBe("Zaino");
  });

  it("falls back to the curated sections when the manifest fails to load", () => {
    // getMenuTitlesCached resolves to {} when credentials are missing or the
    // GitHub fetch fails — the page must still render its navigation.
    const sections = buildSitemapSections({
      englishTitles: {},
      staticSections,
      sectionDefs,
    });

    expect(sections.map((section) => section.title)).toEqual([
      "Pages",
      "Use Zcash",
    ]);
    expect(hrefs(sections)).toEqual([
      "/",
      "/wallets",
      "https://bounties.zechub.wiki/",
      "/using-zcash/buying-zec",
    ]);
    expect(allLinks(sections).every((link) => !link.titleKey)).toBe(true);
  });

  it("ignores manifest entries that are empty or collide on a route", () => {
    const sections = buildSitemapSections({
      englishTitles: {
        "Zcash_Tech/Ironwood.md": "Ironwood",
        // Same route after case-folding — only the first survives.
        "Zcash_Tech/IRONWOOD.md": "Ironwood duplicate",
        "Zcash_Tech/Blank.md": "   ",
      },
      staticSections,
      sectionDefs,
    });
    const tech = sections.find((section) => section.title === "Zcash Tech");

    expect(tech?.links.map((l) => l.href)).toEqual(["/zcash-tech/ironwood"]);
    expect(tech?.links[0].titleKey).toBe("Zcash_Tech/Ironwood.md");
  });
});
