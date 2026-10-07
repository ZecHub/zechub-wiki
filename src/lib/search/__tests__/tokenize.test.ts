import { tokenize, tokenSet, markdownToText } from "../tokenize";

describe("tokenize", () => {
  it("lowercases and splits on punctuation", () => {
    expect(tokenize("Unified Address (ZIP-316)")).toEqual([
      "unified",
      "address",
      "zip",
      "316",
    ]);
  });

  it("drops single characters, which cost a postings list and carry no signal", () => {
    expect(tokenize("a shielded z pool")).toEqual(["shielded", "pool"]);
  });

  it("keeps apostrophes inside words", () => {
    expect(tokenize("builder's guide")).toEqual(["builder's", "guide"]);
  });

  it("caps absurdly long tokens so an address or hash cannot bloat the index", () => {
    const long = "u1" + "q".repeat(80);
    const [only] = tokenize(long);
    expect(only).toHaveLength(32);
  });

  it("emits CJK as overlapping bigrams, because those languages are not space-delimited", () => {
    // Without this, a Japanese paragraph indexes as one enormous token and
    // Japanese search matches nothing at all.
    expect(tokenize("屏蔽交易")).toEqual(["屏蔽", "蔽交", "交易"]);
  });

  it("handles CJK and Latin in the same string", () => {
    const out = tokenize("Zcash の屏蔽 pool");
    expect(out).toContain("zcash");
    expect(out).toContain("pool");
    expect(out).toContain("の屏");
    expect(out).toContain("屏蔽");
  });

  it("keeps a lone CJK character rather than dropping it", () => {
    expect(tokenize("円")).toEqual(["円"]);
  });

  it("tokenSet is tokenize without duplicates, order preserved", () => {
    expect(tokenSet("block block height")).toEqual(["block", "height"]);
  });

  it("returns nothing for empty input", () => {
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("markdownToText", () => {
  it("drops fenced code, which is not prose a reader scans for", () => {
    expect(markdownToText("before\n```\nzcash-cli getinfo\n```\nafter")).toBe(
      "before after",
    );
  });

  it("keeps link text but drops the target", () => {
    expect(markdownToText("see [the guide](https://example.com/x)")).toBe(
      "see the guide",
    );
  });

  it("drops images entirely, alt text included", () => {
    expect(markdownToText("a ![a diagram](x.png) b")).toBe("a b");
  });

  it("drops html tags", () => {
    expect(markdownToText('<a href="x"><img src="y"/></a> text')).toBe("text");
  });

  it("drops heading markers but keeps heading words", () => {
    expect(markdownToText("## FlyClient\n\nbody")).toBe("FlyClient body");
  });

  it("drops frontmatter", () => {
    expect(markdownToText("---\ntitle: X\n---\nbody")).toBe("body");
  });

  it("drops inline code", () => {
    expect(markdownToText("run `zcashd -daemon` now")).toBe("run now");
  });
});
