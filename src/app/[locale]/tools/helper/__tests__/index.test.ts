import { detectZcashNetwork } from "../index";

describe("detectZcashNetwork", () => {
  it("detects mainnet ZIP-320 TEX addresses", () => {
    expect(detectZcashNetwork("tex1s2rt77ggcyr4rn0kfktll9m9wsxlv4t6uhpldk")).toBe(
      "mainnet",
    );
  });

  it("detects testnet ZIP-320 TEX addresses", () => {
    expect(
      detectZcashNetwork("textest1s2rt77ggcyr4rn0kfktll9m9wsxlv4t6uhpldk"),
    ).toBe("testnet");
  });

  it("still detects existing testnet address prefixes", () => {
    expect(detectZcashNetwork("tm9iMLAuYMzJ6jtFLcA7rzUmfreCV2z6vys")).toBe(
      "testnet",
    );
    expect(
      detectZcashNetwork("utest1p0906hsww2yq77l249qj4swj72n9q3t0a6k9d7a2y29"),
    ).toBe("testnet");
    expect(
      detectZcashNetwork(
        "ztestsapling1knwqq0y5x0kf0jjyw6jswpzw7xjq0dt3wtcvguxr7v7t7cnv2cxnprqymvyjr8t7t9x0ny8t6ct",
      ),
    ).toBe("testnet");
  });

  it("still detects existing mainnet address prefixes", () => {
    expect(detectZcashNetwork("t1VpMigELggqi6TBghQNehqspAcBBDYvRQC")).toBe(
      "mainnet",
    );
    expect(
      detectZcashNetwork(
        "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd",
      ),
    ).toBe("mainnet");
    expect(
      detectZcashNetwork("u1p0906hsww2yq77l249qj4swj72n9q3t0a6k9d7a2y29"),
    ).toBe("mainnet");
  });

  it("returns unknown for unrecognized or empty input", () => {
    expect(detectZcashNetwork("")).toBe("unknown");
    expect(detectZcashNetwork("not-a-zcash-address")).toBe("unknown");
    expect(detectZcashNetwork("bc1qxyz")).toBe("unknown");
  });
});
