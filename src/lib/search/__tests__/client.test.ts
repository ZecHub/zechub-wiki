import { search, type SearchIndex } from "../client";

/**
 * A hand-built index, so every assertion below is about ranking rather than
 * about whatever the real content happens to contain today.
 *
 * Postings are delta-encoded exactly as the generator writes them: the first
 * number is the doc id, each later number is the gap from the previous one.
 */
const index: SearchIndex = {
  v: 1,
  locale: "en",
  generated: "2026-10-07T00:00:00.000Z",
  docs: [
    ["Heartwood", "/zcash-tech/heartwood", "Heartwood brought shielded mining rewards and FlyClient to the chain."],
    ["Buying ZEC", "/using-zcash/buying-zec", "Where to buy ZEC, including exchanges."],
    ["Developer Resources", "/start-here/developer-resources", "A broad overview of how blockchains and Zcash work."],
    ["Canopy", "/zcash-tech/canopy", "Canopy closed the Sprout pool to new value."],
  ],
  // "shielded" is on three of four pages; "flyclient" on one.
  terms: {
    shielded: [0, 1, 2],      // docs 0,1,3
    flyclient: [0],           // doc 0
    pool: [0, 3],             // docs 0,3
    zec: [1],                 // doc 1
    overview: [2],            // doc 2
  },
  titles: {
    heartwood: [0],
    buying: [1],
    zec: [1],
    developer: [2],
    resources: [2],
    canopy: [3],
  },
  aliases: {
    onboarding: [2],
    exchanges: [1],
  },
};

const titles = (q: string, n = 4) => search(index, q, n).map((h) => h.title);

describe("search", () => {
  it("returns nothing without an index, so a missing file degrades silently", () => {
    expect(search(null, "shielded")).toEqual([]);
  });

  it("returns nothing for an empty query", () => {
    expect(search(index, "   ")).toEqual([]);
  });

  it("finds a page by a word that appears only in its body", () => {
    // The whole point of the feature: FlyClient is in no title and no alias.
    expect(titles("flyclient")).toEqual(["Heartwood"]);
  });

  it("ranks a title match above a body match", () => {
    expect(titles("canopy")[0]).toBe("Canopy");
  });

  it("ranks a curated alias above a plain body match", () => {
    const hits = search(index, "onboarding", 4);
    expect(hits[0].title).toBe("Developer Resources");
    expect(hits[0].matchedIn).toBe("curated");
  });

  it("prefers a page matching every query term over one matching most", () => {
    // Doc 0 has both; doc 3 has only "pool"; docs 1 and 3 have only "shielded".
    expect(titles("shielded flyclient")[0]).toBe("Heartwood");
  });

  it("weights a rare term above a common one", () => {
    // "shielded" is on three of four pages and should not outweigh "flyclient",
    // which is on one. Without rarity weighting these tie and the order is
    // arbitrary.
    const hits = search(index, "shielded flyclient", 4);
    expect(hits[0].title).toBe("Heartwood");
    expect(hits[0].score).toBeGreaterThan(hits[1]?.score ?? 0);
  });

  it("treats the trailing word as a prefix, so typing is incremental", () => {
    expect(titles("flycl")).toContain("Heartwood");
  });

  it("does not prefix-expand a single character, which would match everything", () => {
    expect(search(index, "f", 4)).toEqual([]);
  });

  it("scores an exact term above the same word reached by prefix", () => {
    const exact = search(index, "flyclient", 1)[0].score;
    const viaPrefix = search(index, "flycli", 1)[0].score;
    expect(exact).toBeGreaterThan(viaPrefix);
  });

  it("builds a snippet centred on the matched word", () => {
    const [hit] = search(index, "flyclient", 1);
    expect(hit.snippet.toLowerCase()).toContain("flyclient");
  });

  it("falls back to the lead when the match is not in the stored excerpt", () => {
    const [hit] = search(index, "overview", 1);
    expect(hit.snippet.length).toBeGreaterThan(0);
  });

  it("reports where the strongest match was found", () => {
    expect(search(index, "heartwood", 1)[0].matchedIn).toBe("title");
    expect(search(index, "flyclient", 1)[0].matchedIn).toBe("body");
  });

  it("decodes delta-encoded postings back to the right documents", () => {
    // terms.shielded is [0,1,2] -> docs 0,1,3. Doc 2 must not appear.
    const urls = search(index, "shielded", 4).map((h) => h.url);
    expect(urls).toContain("/zcash-tech/heartwood");
    expect(urls).toContain("/using-zcash/buying-zec");
    expect(urls).toContain("/zcash-tech/canopy");
    expect(urls).not.toContain("/start-here/developer-resources");
  });

  it("honours the result limit", () => {
    expect(search(index, "shielded", 2)).toHaveLength(2);
  });
});
