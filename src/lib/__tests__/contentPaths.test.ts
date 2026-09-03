import { isKnownContentPath } from "../contentPaths";

// A slice of the real manifest: flat section files plus the nested folders.
const keys = [
  "Zcash_Tech/Lightwallet_Nodes.md",
  "Zcash_Tech/NU5.md",
  "Using_Zcash/Payment_Processors.md",
  "Using_Zcash/Spend_Zcash/Top_10_Places_to_spend_ZEC.md",
  "guides/frostdemo/ywallet-frost-demo.md",
  "ZFAV_Club/Guides_for_Creators/AI_tools.md",
  "Research/zcash-foundations-series/article-0/article-0-shielded-transaction.md",
];

describe("isKnownContentPath", () => {
  it("treats a section root as browsable", () => {
    expect(isKnownContentPath(["zcash-tech"], keys)).toBe(true);
    expect(isKnownContentPath(["anything-at-all"], keys)).toBe(true);
  });

  it("recognises a nested folder that files live under", () => {
    expect(isKnownContentPath(["guides", "frostdemo"], keys)).toBe(true);
    expect(isKnownContentPath(["using-zcash", "spend-zcash"], keys)).toBe(true);
    expect(isKnownContentPath(["zfav-club", "guides-for-creators"], keys)).toBe(
      true,
    );
  });

  it("recognises a folder several levels down", () => {
    expect(
      isKnownContentPath(["research", "zcash-foundations-series"], keys),
    ).toBe(true);
    expect(
      isKnownContentPath(
        ["research", "zcash-foundations-series", "article-0"],
        keys,
      ),
    ).toBe(true);
  });

  it("rejects a dead article URL under a real section", () => {
    // The bounty's example: a near-miss for Zcash_Tech/Lightwallet_Nodes.md.
    expect(isKnownContentPath(["zcash-tech", "light-wallet-node"], keys)).toBe(
      false,
    );
    expect(
      isKnownContentPath(["using-zcash", "payment-procesors"], keys),
    ).toBe(false);
  });

  it("recognises the article files themselves", () => {
    // Several nested articles land on the browse view today for unrelated
    // reasons. They are real content, so they keep that behaviour rather than
    // becoming 404s.
    expect(isKnownContentPath(["zcash-tech", "lightwallet-nodes"], keys)).toBe(
      true,
    );
    expect(
      isKnownContentPath(["guides", "frostdemo", "ywallet-frost-demo"], keys),
    ).toBe(true);
    expect(
      isKnownContentPath(
        ["using-zcash", "spend-zcash", "top-10-places-to-spend-zec"],
        keys,
      ),
    ).toBe(true);
  });

  it("rejects a made-up subfolder of a real nested folder", () => {
    expect(isKnownContentPath(["guides", "frostdemo", "nope"], keys)).toBe(
      false,
    );
    expect(
      isKnownContentPath(["research", "zcash-foundations-series", "article-9"], keys),
    ).toBe(false);
  });

  it("keeps the old behaviour when the manifest is unavailable", () => {
    // An empty manifest means the fetch failed; 404ing every browse page on a
    // content-repo outage would be worse than serving the old placeholder.
    expect(isKnownContentPath(["guides", "frostdemo"], [])).toBe(true);
    expect(isKnownContentPath(["zcash-tech", "light-wallet-node"], [])).toBe(
      true,
    );
  });

  it("returns false for an empty slug", () => {
    expect(isKnownContentPath([], keys)).toBe(false);
  });
});
