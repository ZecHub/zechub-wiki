/**
 * Regression tests for content-path resolution via transformUri.
 *
 * The bug these guard against: uppercaseWords used a plain `.includes()` +
 * `.replace()`, so the token "Zec" matched as a *prefix* of "Zecmap" /
 * "ZecHub" and rewrote the content path to a non-existent file
 * (`ZECmap.md` instead of `Zecmap.md`). The page then rendered the empty
 * "Browse the articles…" placeholder at HTTP 200.
 *
 * Fix: only rewrite whole path segments (bounded by start/end, `/`, or `_`).
 *
 * helpers.ts imports getRootCached from authAndFetch (for firstFileForFolders),
 * which pulls in next/cache. Mock that module so this pure unit test never
 * loads the Next server runtime (TextEncoder / unstable_cache).
 */

jest.mock("../authAndFetch", () => ({
  getRootCached: jest.fn(async () => []),
}));

import { transformUri, getDynamicRoute, resolveContentPath } from "../helpers";

describe("transformUri — whole-segment uppercase/lowercase words", () => {
  it("does not rewrite Zec inside Zecmap", () => {
    expect(transformUri("/using-zcash/zecmap")).toBe("/Using_Zcash/Zecmap");
  });

  it("still uppercases a standalone Zec segment to ZEC", () => {
    expect(transformUri("/using-zcash/buying-zec")).toBe(
      "/Using_Zcash/Buying_ZEC",
    );
  });

  it("uppercases Frost → FROST as a whole segment", () => {
    expect(transformUri("/zcash-tech/frost")).toBe("/Zcash_Tech/FROST");
  });

  it("uppercases Nft → NFT as a whole segment", () => {
    expect(transformUri("/zcash-community/cypherpunk-zero-nft")).toBe(
      "/Zcash_Community/Cypherpunk_Zero_NFT",
    );
  });

  it("maps Zechub → ZecHub via specialWordsMap (no greedy Zec prefix rewrite)", () => {
    // Capitalize → What_Is_Zechub; lowercase Is → What_is_Zechub;
    // whole-segment rules leave Zechub intact; specialWordsMap → ZecHub.
    expect(transformUri("/start-here/what-is-zechub")).toBe(
      "/Start_Here/What_is_ZecHub",
    );
  });

  it("handles ZEC_Use_Cases (standalone Zec segment)", () => {
    expect(transformUri("/start-here/zec-use-cases")).toBe(
      "/Start_Here/ZEC_Use_Cases",
    );
  });

  it("handles zk_SNARKS (Zk lowered + Snarks uppercased)", () => {
    expect(transformUri("/zcash-tech/zk-snarks")).toBe(
      "/Zcash_Tech/zk_SNARKS",
    );
  });

  it("maps contribute/zechub-dao to ZecHub_DAO", () => {
    expect(transformUri("/contribute/zechub-dao")).toBe(
      "/contribute/ZecHub_DAO",
    );
  });

  it("maps contribute/zecweekly-newsletter to ZecWeekly_Newsletter", () => {
    expect(transformUri("/contribute/zecweekly-newsletter")).toBe(
      "/contribute/ZecWeekly_Newsletter",
    );
  });
});

describe("getDynamicRoute / resolveContentPath", () => {
  it("resolves zecmap to the real content filename", () => {
    expect(getDynamicRoute(["using-zcash", "zecmap"])).toBe(
      "/site/Using_Zcash/Zecmap.md",
    );
    expect(resolveContentPath(["using-zcash", "zecmap"])).toBe(
      "/site/Using_Zcash/Zecmap.md",
    );
  });

  it("resolves buying-zec to Buying_ZEC.md", () => {
    expect(getDynamicRoute(["using-zcash", "buying-zec"])).toBe(
      "/site/Using_Zcash/Buying_ZEC.md",
    );
  });
});
