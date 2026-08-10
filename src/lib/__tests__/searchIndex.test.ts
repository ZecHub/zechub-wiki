import { buildSearchIndex } from "@/lib/searchIndex";
import { keyToWikiPath } from "@/lib/wikiPaths";
import { searchWiki } from "@/lib/wikiSearch";
import type { Searcher } from "@/types";

const staticEntries: Searcher[] = [
  {
    name: "Network upgrades",
    desc: "Curated explanation of Zcash upgrades.",
    url: "/zcash-tech/ironwood",
    aliases: ["NU"],
  },
  {
    name: "Wallets",
    desc: "Find a Zcash wallet.",
    url: "/wallets",
  },
];

const englishTitles = {
  "Zcash_Tech/Ironwood.md": "Ironwood Network Upgrade",
  "Zcash_Organizations/Sovright.md": "Sovright",
  "Privacy_Tools/VPN_and_DVPN.md": "VPN & dVPN",
};

describe("buildSearchIndex", () => {
  it("indexes every English manifest route and makes new pages searchable", () => {
    const index = buildSearchIndex({ englishTitles, staticEntries });

    for (const key of Object.keys(englishTitles)) {
      const url = keyToWikiPath(key);
      expect(index.filter((entry) => entry.url === url)).toHaveLength(1);
    }
    expect(
      searchWiki(index, "Ironwood").map((entry) => entry.url),
    ).toContain("/zcash-tech/ironwood");
    expect(
      searchWiki(index, "Sovright").map((entry) => entry.url),
    ).toContain("/zcash-organizations/sovright");
  });

  it("uses localized titles while falling back to English titles", () => {
    const index = buildSearchIndex({
      englishTitles,
      localizedTitles: {
        "Zcash_Tech/Ironwood.md": "Actualización de Ironwood",
      },
      staticEntries,
    });

    expect(index.find((entry) => entry.url === "/zcash-tech/ironwood")?.name).toBe(
      "Actualización de Ironwood",
    );
    expect(
      index.find((entry) => entry.url === "/zcash-organizations/sovright")
        ?.name,
    ).toBe("Sovright");
    expect(
      searchWiki(index, "Ironwood Network Upgrade").map((entry) => entry.url),
    ).toContain("/zcash-tech/ironwood");
  });

  it("keeps curated metadata, static-only routes, and only one copy of a URL", () => {
    const index = buildSearchIndex({
      englishTitles,
      staticEntries: [
        ...staticEntries,
        {
          name: "Duplicate wallet entry",
          desc: "This should not be included twice.",
          url: "/WALLETS/",
        },
      ],
    });
    const ironwood = index.filter(
      (entry) => entry.url === "/zcash-tech/ironwood",
    );

    expect(ironwood).toHaveLength(1);
    expect(ironwood[0]).toMatchObject({
      name: "Ironwood Network Upgrade",
      desc: "Curated explanation of Zcash upgrades.",
    });
    expect(ironwood[0].aliases).toEqual(
      expect.arrayContaining(["Network upgrades", "NU", "ironwood"]),
    );
    expect(index).toContainEqual(
      expect.objectContaining({ url: "/wallets", name: "Wallets" }),
    );
    expect(
      index.filter((entry) => entry.url.toLowerCase().startsWith("/wallets")),
    ).toHaveLength(1);
  });

  it("falls back to the usable static index when the English manifest is unavailable", () => {
    const index = buildSearchIndex({ englishTitles: {}, staticEntries });

    expect(index).toEqual(staticEntries);
  });

  it("treats punctuation as separators so all words in a title can match", () => {
    const index = buildSearchIndex({ englishTitles, staticEntries });

    expect(
      searchWiki(index, "VPN & dVPN").map((entry) => entry.url),
    ).toContain("/privacy-tools/vpn-and-dvpn");
  });

  it("matches localized titles regardless of accent marks", () => {
    const index = buildSearchIndex({
      englishTitles,
      localizedTitles: {
        "Zcash_Tech/Ironwood.md": "Actualización de Ironwood",
      },
      staticEntries,
    });

    expect(
      searchWiki(index, "Actualizacion").map((entry) => entry.url),
    ).toContain("/zcash-tech/ironwood");
  });
});
