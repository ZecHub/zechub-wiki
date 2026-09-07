/**
 * Unit tests for the 404 page's recovery suggestions.
 *
 * The index is built through buildSearchIndex from a small manifest, the same
 * pipeline the nav search box uses, so the scores these assertions rely on are
 * the scores production produces.
 */

import { buildSearchIndex } from "../searchIndex";
import {
  MIN_SUGGESTION_SCORE,
  pathToQuery,
  suggestPages,
} from "../notFoundSuggestions";

const englishTitles = {
  "Zcash_Tech/Lightwallet_Nodes.md": "Zcash Lightwallet Nodes",
  "Zcash_Tech/NU5.md": "NU5",
  "Zcash_Tech/NU6.md": "NU6",
  "Zcash_Tech/NU6_1.md": "NU6.1",
  "Zcash_Tech/Crosslink_Protocol.md": "Crosslink Protocol",
  "Using_Zcash/Payment_Processors.md": "Zcash Payment Processors",
  "Privacy_Tools/GrapheneOS.md": "Graphene OS",
  "Start_Here/Who_Can_See_Your_Zcash_Payment.md":
    "Who Can See Your Zcash Payment?",
};

const index = buildSearchIndex({ englishTitles, staticEntries: [] });

const locales = ["en", "es", "fr"] as const;

describe("pathToQuery", () => {
  it("turns the last path segment into words", () => {
    expect(pathToQuery("/zcash-tech/light-wallet-node")).toBe(
      "light wallet node",
    );
  });

  it("treats underscores as word breaks too", () => {
    expect(pathToQuery("/zcash_tech/light_wallet_node")).toBe(
      "light wallet node",
    );
  });

  it("ignores the section, which only adds noise", () => {
    expect(pathToQuery("/using-zcash/aaaaaaa")).toBe("aaaaaaa");
  });

  it("strips a locale prefix when the locales are known", () => {
    expect(pathToQuery("/es/zcash-tech/light-wallet-node", locales)).toBe(
      "light wallet node",
    );
  });

  it("keeps a first segment that is not a locale", () => {
    expect(pathToQuery("/guides/light-wallet-node", locales)).toBe(
      "light wallet node",
    );
  });

  it("returns nothing for a path that is only a locale", () => {
    expect(pathToQuery("/es", locales)).toBe("");
  });

  it("drops an extension an old bookmark still carries", () => {
    expect(pathToQuery("/using-zcash/payment-processors.html")).toBe(
      "payment processors",
    );
  });

  it("ignores a trailing slash", () => {
    expect(pathToQuery("/zcash-tech/nu-5/")).toBe("nu 5");
  });

  it("drops a query string and hash", () => {
    expect(pathToQuery("/zcash-tech/nu-5?ref=x#top")).toBe("nu 5");
  });

  it("decodes a percent-encoded segment", () => {
    expect(pathToQuery("/zcash-tech/light%20wallet")).toBe("light wallet");
  });

  it("survives a malformed percent escape", () => {
    expect(() => pathToQuery("/zcash-tech/%zz")).not.toThrow();
  });

  it("returns nothing for the root", () => {
    expect(pathToQuery("/")).toBe("");
    expect(pathToQuery("")).toBe("");
  });
});

describe("suggestPages", () => {
  it("offers the page the bounty's example URL was reaching for", () => {
    const [first] = suggestPages(index, "/zcash-tech/light-wallet-node");
    expect(first).toMatchObject({
      name: "Zcash Lightwallet Nodes",
      url: "/zcash-tech/lightwallet-nodes",
    });
  });

  it("recovers from a spelling error", () => {
    const [first] = suggestPages(index, "/using-zcash/payment-procesors");
    expect(first?.url).toBe("/using-zcash/payment-processors");
  });

  it("recovers from a shortened or renamed slug", () => {
    const [first] = suggestPages(index, "/start-here/who-can-see-payment");
    expect(first?.url).toBe("/start-here/who-can-see-your-zcash-payment");
  });

  it("works through a locale prefix", () => {
    const [first] = suggestPages(index, "/es/privacy-tools/graphene", {
      locales,
    });
    expect(first?.url).toBe("/privacy-tools/grapheneos");
  });

  it("offers nothing for a URL that resembles no page", () => {
    expect(suggestPages(index, "/qwerty-nonsense")).toEqual([]);
    expect(suggestPages(index, "/asdfghjkl")).toEqual([]);
  });

  it("offers nothing for the root or an empty path", () => {
    expect(suggestPages(index, "/")).toEqual([]);
    expect(suggestPages(index, "")).toEqual([]);
  });

  it("withholds a match that does not clear the score floor", () => {
    // "protokol" scores 399 against Crosslink Protocol, so the same path is
    // answered or withheld purely on where the floor sits.
    const path = "/zcash-tech/protokol";
    expect(suggestPages(index, path, { minScore: 0 })).toHaveLength(1);
    expect(suggestPages(index, path, { minScore: 500 })).toEqual([]);
  });

  it("offers nothing at all for a path that matches nothing", () => {
    expect(suggestPages(index, "/qwerty-nonsense")).toEqual([]);
    expect(suggestPages(index, "/zcash-tech/asdfghjkl")).toEqual([]);
  });

  it("honours the limit", () => {
    const limited = suggestPages(index, "/zcash-tech/payment", {
      limit: 1,
      minScore: 0,
      relativeFloor: 0,
    });
    expect(limited).toHaveLength(1);
  });

  it("drops matches far weaker than the best one", () => {
    const all = suggestPages(index, "/zcash-tech/nu-5", {
      relativeFloor: 0,
      limit: 50,
    });
    const trimmed = suggestPages(index, "/zcash-tech/nu-5", {
      relativeFloor: 0.99,
      limit: 50,
    });
    expect(trimmed.length).toBeLessThan(all.length);
    expect(trimmed[0]?.url).toBe("/zcash-tech/nu5");
  });

  it("returns suggestions best first", () => {
    const results = suggestPages(index, "/zcash-tech/light-wallet-node", {
      minScore: 0,
      relativeFloor: 0,
      limit: 50,
    });
    expect(results[0]?.url).toBe("/zcash-tech/lightwallet-nodes");
  });

  it("keeps the floor inside the calibrated band", () => {
    // Measured against the live index: noise tops out at "baz" 334, and the
    // weakest typo worth answering is "glosary" 365. Moving the floor outside
    // that band starts either suggesting junk or dropping real near-misses.
    expect(MIN_SUGGESTION_SCORE).toBeGreaterThan(334);
    expect(MIN_SUGGESTION_SCORE).toBeLessThanOrEqual(365);
  });

  it("keeps near-miss variants of the same upgrade together", () => {
    // NU5 668, NU6 570, NU6.1 569 - all worth offering for /nu-5.
    const urls = suggestPages(index, "/zcash-tech/nu-5").map((i) => i.url);
    expect(urls).toContain("/zcash-tech/nu5");
    expect(urls.length).toBeGreaterThan(1);
  });

  it("returns an empty list for an empty index", () => {
    expect(suggestPages([], "/zcash-tech/light-wallet-node")).toEqual([]);
  });
});
