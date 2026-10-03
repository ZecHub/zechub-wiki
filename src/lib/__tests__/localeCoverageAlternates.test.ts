jest.mock("@/lib/authAndFetch", () => ({ getMenuTitlesCached: jest.fn() }));
jest.mock("@/i18n/routing", () => ({
  routing: { locales: ["en", "de", "fr", "ja"], defaultLocale: "en" },
}));

import { buildAlternates } from "@/lib/localeCoverage";

describe("buildAlternates canonical", () => {
  it("is the current locale's URL when that locale carries the page", () => {
    const a = buildAlternates("/using-zcash/shielded-pools", "de", ["en", "de", "fr"]);
    expect(a?.canonical).toBe("https://zechub.wiki/de/using-zcash/shielded-pools");
    expect(a?.languages).toMatchObject({
      en: "https://zechub.wiki/using-zcash/shielded-pools",
      de: "https://zechub.wiki/de/using-zcash/shielded-pools",
      "x-default": "https://zechub.wiki/using-zcash/shielded-pools",
    });
  });

  it("points an untranslated locale at the English page it falls back to", () => {
    // Using_Zcash/Wallets.md is English-only; /de/... renders the English text.
    const a = buildAlternates("/using-zcash/wallets", "de", ["en"]);
    expect(a?.canonical).toBe("https://zechub.wiki/using-zcash/wallets");
  });

  it("does the same when other locales are translated but not this one", () => {
    const a = buildAlternates("/using-zcash/shielded-pools", "ja", ["en", "de", "fr"]);
    expect(a?.canonical).toBe("https://zechub.wiki/using-zcash/shielded-pools");
    expect(a?.languages).not.toHaveProperty("ja");
  });

  it("keeps English pages self-canonical", () => {
    expect(buildAlternates("/using-zcash/wallets", "en", ["en"])?.canonical).toBe(
      "https://zechub.wiki/using-zcash/wallets",
    );
  });
});
