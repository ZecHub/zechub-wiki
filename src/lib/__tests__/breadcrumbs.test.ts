/**
 * Unit tests for the article breadcrumb trail.
 *
 * breadcrumbs.ts imports helpers.ts, which imports getRootCached from
 * authAndFetch (for firstFileForFolders) and so pulls in next/cache. Mock that
 * module, the same way transformUri.test.ts does, to keep this a pure test.
 */

jest.mock("../authAndFetch", () => ({
  getRootCached: jest.fn(async () => []),
}));

import { buildBreadcrumbs, manifestKey } from "../breadcrumbs";

const titles = {
  "Using_Zcash/Payment_Processors.md": "Zcash Payment Processors",
  "Glossary_and_FAQs/FAQ.md": "Frequently Asked Questions",
};

describe("manifestKey", () => {
  it("maps a slug to its content path without the site/ prefix", () => {
    expect(manifestKey(["using-zcash", "payment-processors"])).toBe(
      "Using_Zcash/Payment_Processors.md",
    );
  });

  it("maps a section segment to the folder's own key", () => {
    expect(manifestKey(["using-zcash"])).toBe("Using_Zcash.md");
  });

  it("keeps the hand-mapped contribute path", () => {
    expect(manifestKey(["contribute", "community-infrastructure"])).toBe(
      "contribute/Community_Infrastructure.md",
    );
  });
});

describe("buildBreadcrumbs", () => {
  it("puts the wiki root first, linked to /", () => {
    const [root] = buildBreadcrumbs({ slug: ["using-zcash"] });
    expect(root).toEqual({ label: "Wiki", href: "/" });
  });

  it("builds the trail the bounty asks for", () => {
    const trail = buildBreadcrumbs({
      slug: ["using-zcash", "payment-processors"],
    });
    expect(trail.map((c) => c.label)).toEqual([
      "Wiki",
      "Using Zcash",
      "Payment Processors",
    ]);
  });

  it("links each crumb to its own section, locale-less", () => {
    const trail = buildBreadcrumbs({
      slug: ["zcash-tech", "what-a-block-explorer-can-see"],
    });
    expect(trail.map((c) => c.href)).toEqual([
      "/",
      "/zcash-tech",
      "/zcash-tech/what-a-block-explorer-can-see",
    ]);
  });

  it("ends on the page itself", () => {
    const trail = buildBreadcrumbs({
      slug: ["start-here", "who-can-see-your-zcash-payment"],
    });
    expect(trail[trail.length - 1].href).toBe(
      "/start-here/who-can-see-your-zcash-payment",
    );
  });

  it("prefers the menu-titles manifest over the filename", () => {
    const trail = buildBreadcrumbs({
      slug: ["using-zcash", "payment-processors"],
      titles,
    });
    expect(trail[2].label).toBe("Zcash Payment Processors");
  });

  it("falls back to the English manifest when the locale has no entry", () => {
    const trail = buildBreadcrumbs({
      slug: ["using-zcash", "payment-processors"],
      titles: {},
      enTitles: titles,
    });
    expect(trail[2].label).toBe("Zcash Payment Processors");
  });

  it("prefers the localized manifest over the English one", () => {
    const trail = buildBreadcrumbs({
      slug: ["using-zcash", "payment-processors"],
      titles: { "Using_Zcash/Payment_Processors.md": "Procesadores de pago" },
      enTitles: titles,
    });
    expect(trail[2].label).toBe("Procesadores de pago");
  });

  it("translates section segments through menuLabels", () => {
    const trail = buildBreadcrumbs({
      slug: ["using-zcash", "payment-processors"],
      menuLabels: { "Using Zcash": "Usar Zcash" },
    });
    expect(trail[1].label).toBe("Usar Zcash");
  });

  it("keeps the curated Glossary name", () => {
    const trail = buildBreadcrumbs({
      slug: ["glossary-and-faqs", "faq"],
      titles,
    });
    expect(trail.map((c) => c.label)).toEqual([
      "Wiki",
      "Glossary & FAQ's",
      "Frequently Asked Questions",
    ]);
  });

  it("matches manifest keys whose file is cased differently on disk", () => {
    // The manifest calls it NU5.md; the slug transform produces Nu5.md.
    const trail = buildBreadcrumbs({
      slug: ["zcash-tech", "nu5"],
      titles: { "Zcash_Tech/NU5.md": "Network Upgrade 5" },
    });
    expect(trail[2].label).toBe("Network Upgrade 5");
  });

  it("still prefers an exact key over a differently cased one", () => {
    const trail = buildBreadcrumbs({
      slug: ["zcash-tech", "nu5"],
      titles: {
        "Zcash_Tech/NU5.md": "wrong case",
        "Zcash_Tech/Nu5.md": "exact match",
      },
    });
    expect(trail[2].label).toBe("exact match");
  });

  it("uses the filename when nothing is translated", () => {
    const trail = buildBreadcrumbs({
      slug: ["privacy-tools", "secure-messengers"],
    });
    expect(trail[2].label).toBe("Secure Messengers");
  });

  it("handles a deep path one crumb per segment", () => {
    const trail = buildBreadcrumbs({
      slug: ["research", "zcash-foundations-series", "part-one"],
    });
    expect(trail).toHaveLength(4);
    expect(trail[3].href).toBe("/research/zcash-foundations-series/part-one");
  });

  it("accepts an overridden root label", () => {
    const trail = buildBreadcrumbs({ slug: ["guides"], rootLabel: "ZecHub" });
    expect(trail[0].label).toBe("ZecHub");
  });

  it("returns just the root for an empty slug", () => {
    expect(buildBreadcrumbs({ slug: [] })).toEqual([
      { label: "Wiki", href: "/" },
    ]);
  });

  it("ignores blank segments", () => {
    const trail = buildBreadcrumbs({ slug: ["using-zcash", "", "  "] });
    expect(trail.map((c) => c.href)).toEqual(["/", "/using-zcash"]);
  });
});
