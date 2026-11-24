import { TextDecoder, TextEncoder } from "util";
import {
  classifyZip321Address,
  formatZatoshis,
  inspectZip321Uri,
  zip321AmountToZatoshis,
} from "../zip321Inspect";
import { buildZip321Uri } from "../zip321";

if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder as typeof globalThis.TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}
if (typeof globalThis.btoa === "undefined") {
  globalThis.btoa = (data: string) => Buffer.from(data, "binary").toString("base64");
}
if (typeof globalThis.atob === "undefined") {
  globalThis.atob = (data: string) => Buffer.from(data, "base64").toString("binary");
}

// Addresses from the examples in ZIP 321 itself.
const SAPLING =
  "ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez";
const TRANSPARENT = "tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU";
const MAINNET_T = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";
const UNIFIED =
  "utest1qpsw0d7s6e5t7dv8x8yyw5e4v4jh8p5kux6g5v4kthh0nngwh2c5ue2x8p3wxy7qsqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq7egr7p";

const errors = (uri: string) =>
  inspectZip321Uri(uri)
    .issues.filter((i) => i.level === "error")
    .map((i) => i.message);

describe("inspectZip321Uri: valid examples from ZIP 321", () => {
  it("reads a single payment with a memo and a message", () => {
    const r = inspectZip321Uri(
      `zcash:${SAPLING}?amount=1&memo=VGhpcyBpcyBhIHNpbXBsZSBtZW1vLg&message=Thank%20you%20for%20your%20purchase`,
    );
    expect(r.valid).toBe(true);
    expect(r.issues).toEqual([]);
    expect(r.network).toBe("testnet");
    expect(r.payments).toHaveLength(1);
    const [p] = r.payments;
    expect(p).toMatchObject({
      index: 0,
      address: SAPLING,
      addressKind: "sapling",
      amount: "1",
      message: "Thank you for your purchase",
      memo: { text: "This is a simple memo.", bytes: 22 },
    });
    expect(p.zatoshis).toBe(BigInt(100_000_000));
  });

  it("reads a two-recipient request with a Unicode memo", () => {
    const r = inspectZip321Uri(
      `zcash:?address=${TRANSPARENT}&amount=123.456&address.1=${SAPLING}&amount.1=0.789&memo.1=VGhpcyBpcyBhIHVuaWNvZGUgbWVtbyDinKjwn6aE8J-PhvCfjok`,
    );
    expect(r.valid).toBe(true);
    expect(r.payments.map((p) => [p.index, p.addressKind, p.amount])).toEqual([
      [0, "transparent", "123.456"],
      [1, "sapling", "0.789"],
    ]);
    expect(r.payments[1].memo?.text).toBe("This is a unicode memo ✨🦄🏆🎉");
    expect(r.totalZatoshis).toBe(BigInt(12_424_500_000));
  });

  it("reads a req-asset payment and decodes the asset amount", () => {
    const r = inspectZip321Uri(
      `zcash:?address=${UNIFIED}&req-asset=AEcnAAAAAAAAAADerb7v3q2-796tvu_erb7v3q2-796tvu_erb7v3q2-7xEiM0RVZneImQCqu8zd7v8AESIzRFVmd4iZqrvM3e7_`,
    );
    expect(r.valid).toBe(true);
    expect(r.payments[0].asset).toMatchObject({ version: 0, units: "10055" });
    // The 66-byte encoded AssetId the spec's example is built from.
    expect(r.payments[0].asset?.assetIdHex).toBe(
      "0000deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef" +
        "11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff",
    );
    // The builder only writes ZEC payments, so there is no canonical form.
    expect(r.canonical).toBeUndefined();
  });

  it("normalises amounts the way the spec's examples do", () => {
    for (const [raw, normal] of [
      ["50.00", "50"],
      ["050", "50"],
      ["00.500", "0.5"],
      ["21000000", "21000000"],
      ["0.00000001", "0.00000001"],
    ]) {
      const r = inspectZip321Uri(`zcash:${TRANSPARENT}?amount=${raw}`);
      expect(r.valid).toBe(true);
      expect(r.payments[0].amount).toBe(normal);
    }
  });

  it("accepts an uppercase scheme, empty parameters and surrounding whitespace", () => {
    expect(inspectZip321Uri(`  ZCASH:${TRANSPARENT}?amount=1&&label=x  `).valid).toBe(true);
    expect(inspectZip321Uri(`zcash:${TRANSPARENT}`).valid).toBe(true);
  });
});

describe("inspectZip321Uri: invalid examples from ZIP 321", () => {
  it("flags parameters without an index that have no address", () => {
    const r = inspectZip321Uri(
      `zcash:?amount=3491405.05201255&address.1=${SAPLING}&amount.1=5740296.87793245`,
    );
    expect(r.valid).toBe(false);
    expect(r.issues).toContainEqual(
      expect.objectContaining({ level: "error", index: 0, message: expect.stringMatching(/no address/) }),
    );
  });

  it("flags a payment index that has an amount but no address", () => {
    expect(
      errors(`zcash:?address=${TRANSPARENT}&amount=1&amount.1=2&address.2=${SAPLING}`),
    ).toEqual(["Payment 1 has parameters but no 'address.1='."]);
  });

  it("flags .0 and other indexes with leading zeros", () => {
    const msgs = errors(`zcash:?address.0=${SAPLING}&amount.0=2`);
    expect(msgs.filter((m) => /invalid index/.test(m))).toHaveLength(2);
    expect(errors(`zcash:?address=${TRANSPARENT}&address.01=${SAPLING}`).join()).toMatch(/invalid index/);
    expect(errors(`zcash:?address=${TRANSPARENT}&address.10000=${SAPLING}`).join()).toMatch(/invalid index/);
    expect(inspectZip321Uri(`zcash:?address=${TRANSPARENT}&address.9999=${SAPLING}`).valid).toBe(true);
  });

  it("flags duplicate parameters, with and without an index", () => {
    expect(errors(`zcash:?amount=1.234&amount=2.345&address=${TRANSPARENT}`)).toEqual([
      "'amount' repeats 'amount'; each parameter may appear once per payment.",
    ]);
    expect(errors(`zcash:?amount.1=1.234&amount.1=2.345&address.1=${TRANSPARENT}`).join()).toMatch(/repeats/);
    // A path address is the same parameter as address= (spec: the forms are equivalent).
    expect(errors(`zcash:${TRANSPARENT}?address=${SAPLING}`).join()).toMatch(/repeats 'address \(in the path\)'/);
  });

  it("flags percent-encoding outside label and message", () => {
    expect(errors(`zcash:${TRANSPARENT}?amount=1%30`).join()).toMatch(/amount is percent-encoded/);
    expect(errors(`zcash:${TRANSPARENT}?%61mount=1`).join()).toMatch(/name '%61mount' is percent-encoded/);
    expect(errors(`zcash:%74mEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=1`).join()).toMatch(
      /address is percent-encoded/,
    );
  });

  it("flags zcash:// URIs", () => {
    expect(errors(`zcash://${TRANSPARENT}?amount=1`).join()).toMatch(/no authority component/);
  });

  it("flags every problem in the invalid req-asset example at once", () => {
    const msgs = errors(`zcash:?address=${SAPLING}&amount=5&req-asset=not@valid!chars`);
    expect(msgs).toEqual(["req-asset is not base64url."]);
    const msgs2 = errors(`zcash:?address=${SAPLING}&amount=5&req-asset=AEcnAAAAAAAAAADerb7v`);
    expect(msgs2).toEqual(
      expect.arrayContaining([
        "'amount' and 'req-asset' cannot be used for the same payment.",
        "Custom-asset payments need a Unified Address with an Orchard receiver.",
      ]),
    );
  });

  it("rejects the amount forms the spec lists as invalid", () => {
    for (const bad of ["50,000.00", "50,00", "50.", ".5", "0.123456789", "-1", "1e-8", ""]) {
      const r = inspectZip321Uri(`zcash:${TRANSPARENT}?amount=${bad}`);
      expect(r.valid).toBe(false);
    }
    expect(errors(`zcash:${TRANSPARENT}?amount=0.123456789`)).toEqual([
      "The amount has 9 decimals; ZEC has at most 8 (1 zatoshi).",
    ]);
    expect(errors(`zcash:${TRANSPARENT}?amount=21000000.00000001`).join()).toMatch(/supply cap/);
  });
});

describe("inspectZip321Uri: memos", () => {
  it("rejects plain base64 characters in a memo", () => {
    expect(errors(`zcash:${SAPLING}?memo=ab+/`).join()).toMatch(/not base64url/);
    expect(errors(`zcash:${SAPLING}?memo=YQ==`).join()).toMatch(/not base64url/);
  });

  it("rejects a memo on transparent and TEX addresses", () => {
    expect(errors(`zcash:${TRANSPARENT}?memo=YQ`).join()).toMatch(/transparent address/);
    expect(errors(`zcash:tex1s2rt77ggcyr4rn0kfktll9m9wsxlv4t6uhpldk?memo=YQ`).join()).toMatch(
      /transparent address/,
    );
    // Both problems are reported, not just the first.
    expect(errors(`zcash:${TRANSPARENT}?memo=YQ==`)).toHaveLength(2);
  });

  it("counts memo bytes and rejects more than 512", () => {
    const ok = Buffer.alloc(512, "a").toString("base64url");
    const big = Buffer.alloc(513, "a").toString("base64url");
    expect(inspectZip321Uri(`zcash:${SAPLING}?memo=${ok}`).payments[0].memo?.bytes).toBe(512);
    expect(errors(`zcash:${SAPLING}?memo=${big}`)).toEqual(["The memo is 513 bytes; the limit is 512."]);
  });

  it("shows binary (ZIP 302 non-text) memos as hex", () => {
    const memo = Buffer.from([0xf6, 0x01, 0x02]).toString("base64url");
    const r = inspectZip321Uri(`zcash:${SAPLING}?memo=${memo}`);
    expect(r.valid).toBe(true);
    expect(r.payments[0].memo).toEqual({ raw: memo, bytes: 3, hex: "f60102" });
    expect(r.canonical).toBeUndefined();
  });

  it("rejects a memo length no base64url text can have", () => {
    expect(errors(`zcash:${SAPLING}?memo=abcde`).join()).toMatch(/cannot be decoded/);
  });
});

describe("inspectZip321Uri: other parameters, networks and warnings", () => {
  it("rejects unknown req- parameters and keeps unknown optional ones as warnings", () => {
    expect(errors(`zcash:${TRANSPARENT}?amount=1&req-unknown=x`).join()).toMatch(/must reject/);
    const r = inspectZip321Uri(`zcash:${TRANSPARENT}?amount=1&foo=bar%20baz`);
    expect(r.valid).toBe(true);
    expect(r.payments[0].other).toEqual([{ name: "foo", value: "bar baz" }]);
    expect(r.issues).toEqual([expect.objectContaining({ level: "warning", param: "foo" })]);
  });

  it("warns that + in a label is a literal plus sign", () => {
    const r = inspectZip321Uri(`zcash:${TRANSPARENT}?label=Coffee+shop`);
    expect(r.valid).toBe(true);
    expect(r.payments[0].label).toBe("Coffee+shop");
    expect(r.issues[0]).toMatchObject({ level: "warning", param: "label" });
  });

  it("rejects label characters that must be percent-encoded", () => {
    expect(errors(`zcash:${TRANSPARENT}?label=50%`).join()).toMatch(/percent-encoded/);
    expect(errors(`zcash:${TRANSPARENT}?message=a/b`).join()).toMatch(/percent-encoded/);
  });

  it("rejects Sprout addresses and mixed networks", () => {
    expect(errors("zcash:zcU1Cd6zYyZCd2VJF8yKgmzjxdiiU1rgTTjEwoN1CGUWCziPkUTXUjXmX7TMqdMNsTfuiGN1jQoVN4kGxUR4sAPN4XZ7pxb").join()).toMatch(/Sprout/);
    expect(errors(`zcash:?address=${MAINNET_T}&address.1=${SAPLING}`).join()).toMatch(/mixes mainnet and testnet/);
  });

  it("warns on zero amounts and unknown address formats without failing", () => {
    expect(inspectZip321Uri(`zcash:${TRANSPARENT}?amount=0`)).toMatchObject({ valid: true, canonical: undefined });
    expect(inspectZip321Uri("zcash:bc1qxyz").issues[0]).toMatchObject({ level: "warning" });
  });

  it("explains input that is not a zcash: URI", () => {
    expect(errors("")).toEqual(["Paste a zcash: payment URI to inspect it."]);
    expect(errors("bitcoin:bc1qxyz")).toEqual(["A ZIP 321 URI starts with 'zcash:'."]);
    expect(errors("zcash:").join()).toMatch(/no recipient/);
    expect(errors("zcash:?").join()).toMatch(/no recipient/);
  });
});

describe("inspectZip321Uri: round trip with the Payment Request builder", () => {
  const cases = [
    [{ address: SAPLING, amount: "1.5", label: "Coffee shop", message: "Thanks!", memo: "Order #42 ✨" }],
    [
      { address: TRANSPARENT, amount: "0.1" },
      { address: SAPLING, amount: "0.25", memo: "second" },
      { address: UNIFIED, label: "tip (optional)" },
    ],
  ];

  it.each(cases)("reads back what the builder writes (%#)", (...payments) => {
    const uri = buildZip321Uri(payments);
    const r = inspectZip321Uri(uri);
    expect(r.valid).toBe(true);
    expect(r.issues).toEqual([]);
    expect(
      r.payments.map((p) => ({
        address: p.address,
        ...(p.amount && { amount: p.amount }),
        ...(p.label && { label: p.label }),
        ...(p.message && { message: p.message }),
        ...(p.memo && { memo: p.memo.text }),
      })),
    ).toEqual(payments);
    expect(r.canonical).toBe(uri);
  });

  it("gives sparse indexes a canonical, renumbered form", () => {
    const r = inspectZip321Uri(`zcash:?address=${TRANSPARENT}&address.7=${SAPLING}&amount.7=2`);
    expect(r.payments.map((p) => p.index)).toEqual([0, 7]);
    expect(r.canonical).toBe(`zcash:?address=${TRANSPARENT}&address.1=${SAPLING}&amount.1=2`);
  });
});

describe("amount helpers", () => {
  it("converts without floating point error", () => {
    expect(zip321AmountToZatoshis("0.1")).toBe(BigInt(10_000_000));
    expect(zip321AmountToZatoshis("20999999.99999999")).toBe(BigInt("2099999999999999"));
    expect(formatZatoshis(BigInt(1))).toBe("0.00000001");
    expect(formatZatoshis(BigInt(150_000_000))).toBe("1.5");
  });

  it("classifies address prefixes", () => {
    expect(classifyZip321Address(SAPLING)).toEqual({ kind: "sapling", network: "testnet" });
    expect(classifyZip321Address("zs1abc")).toEqual({ kind: "sapling", network: "mainnet" });
    expect(classifyZip321Address("u1abc")).toEqual({ kind: "unified", network: "mainnet" });
    expect(classifyZip321Address("t3abc")).toEqual({ kind: "transparent", network: "mainnet" });
    expect(classifyZip321Address("textest1abc")).toEqual({ kind: "tex", network: "testnet" });
    expect(classifyZip321Address("ztabc")).toEqual({ kind: "sprout", network: "testnet" });
  });
});
