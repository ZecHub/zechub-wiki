import {
  MAX_MEMO_BYTES,
  MAX_ZEC_SUPPLY,
  buildZip321Uri,
  decodeZip321Memo,
  encodeZip321Memo,
  formatZecAmount,
  isShieldedAddress,
  isTransparentAddress,
  parseZip321Uri,
  validateZip321Payment,
} from "../zip321";

describe("ZIP-321 Amount Boundaries & Formatting", () => {
  it("formats valid standard amounts preserving decimal precision", () => {
    expect(formatZecAmount("1")).toBe("1");
    expect(formatZecAmount("1.5")).toBe("1.5");
    expect(formatZecAmount(1.5)).toBe("1.5");
    expect(formatZecAmount("0.12345678")).toBe("0.12345678");
    expect(formatZecAmount("21000000")).toBe("21000000");
  });

  it("normalizes trailing and leading zeroes correctly", () => {
    expect(formatZecAmount("1.50000000")).toBe("1.5");
    expect(formatZecAmount("2.00000000")).toBe("2");
    expect(formatZecAmount("01.5")).toBe("1.5");
  });

  it("correctly handles one zatoshi and scientific notation without emitting '1e-8'", () => {
    expect(formatZecAmount(0.00000001)).toBe("0.00000001");
    expect(formatZecAmount(1e-8)).toBe("0.00000001");
    expect(formatZecAmount("1e-8")).toBe("0.00000001");
    expect(formatZecAmount("0.00000001")).toBe("0.00000001");
  });

  it("rejects amounts exceeding 8 decimal places (zatoshi precision)", () => {
    expect(() => formatZecAmount("0.123456789")).toThrow(
      /exceeds maximum 8 decimal places/i,
    );
    expect(() => formatZecAmount("0.000000001")).toThrow(
      /exceeds maximum 8 decimal places/i,
    );
  });

  it("rejects zero and negative amounts", () => {
    expect(() => formatZecAmount(0)).toThrow(/greater than zero/i);
    expect(() => formatZecAmount("0")).toThrow(/greater than zero/i);
    expect(() => formatZecAmount("0.00000000")).toThrow(/greater than zero/i);
    expect(() => formatZecAmount(-1)).toThrow(/greater than zero/i);
    expect(() => formatZecAmount("-0.5")).toThrow(/must be a positive decimal number/i);
  });

  it("rejects amounts exceeding maximum ZEC supply (21,000,000)", () => {
    expect(() => formatZecAmount(21000001)).toThrow(/exceeds maximum ZEC supply/i);
    expect(() => formatZecAmount("21000000.00000001")).toThrow(
      /exceeds maximum ZEC supply/i,
    );
  });

  it("rejects non-numeric amount strings", () => {
    expect(() => formatZecAmount("abc")).toThrow(/must be a positive decimal number/i);
    expect(() => formatZecAmount("")).toThrow(/Amount is required/i);
  });
});

describe("ZIP-321 Address Types & Memo Restrictions", () => {
  const transparentT1 = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";
  const transparentT3 = "t3VzFdEkhttkgfp2hkEvihnc8v5K8p8q35B";
  const shieldedSapling =
    "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
  const shieldedUnified =
    "u1p0906hsww2yq77l249qj4swj72n9q3t0a6k9d7a2y29g9mptfsq6f77q7c4v7p2p0n8x9f36h4j";

  it("distinguishes transparent and shielded addresses", () => {
    expect(isTransparentAddress(transparentT1)).toBe(true);
    expect(isTransparentAddress(transparentT3)).toBe(true);
    expect(isTransparentAddress(shieldedSapling)).toBe(false);
    expect(isTransparentAddress(shieldedUnified)).toBe(false);

    expect(isShieldedAddress(shieldedSapling)).toBe(true);
    expect(isShieldedAddress(shieldedUnified)).toBe(true);
    expect(isShieldedAddress(transparentT1)).toBe(false);
  });

  it("strictly rejects memos attached to transparent addresses", () => {
    expect(() => encodeZip321Memo("Invoice payment", transparentT1)).toThrow(
      /Memos are not supported for transparent addresses in ZIP 321/i,
    );
    expect(() => encodeZip321Memo("Test memo", transparentT3)).toThrow(
      /Memos are not supported for transparent addresses in ZIP 321/i,
    );

    const validation = validateZip321Payment({
      address: transparentT1,
      memo: "Transparent memo attempt",
    });
    expect(validation.valid).toBe(false);
    expect(validation.error).toMatch(/transparent addresses/i);
  });

  it("allows memos on shielded addresses", () => {
    expect(() => encodeZip321Memo("Shielded payment", shieldedSapling)).not.toThrow();
    const validation = validateZip321Payment({
      address: shieldedSapling,
      amount: "1.25",
      memo: "Valid shielded payment",
    });
    expect(validation.valid).toBe(true);
  });
});

describe("ZIP-321 Memo Byte Limits & Unicode Encoding", () => {
  it("encodes and decodes ASCII memos using base64url without '=' padding", () => {
    const memo = "Thanks for the coffee!";
    const encoded = encodeZip321Memo(memo);
    expect(encoded).not.toContain("=");
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(decodeZip321Memo(encoded)).toBe(memo);
  });

  it("correctly preserves multi-byte Unicode characters and emojis", () => {
    const unicodeMemo = "🛡️ Zcash Privacy 🔐 - ありがとうございます - Café €100";
    const encoded = encodeZip321Memo(unicodeMemo);
    expect(encoded).not.toContain("=");
    expect(decodeZip321Memo(encoded)).toBe(unicodeMemo);
  });

  it("accepts exactly 512 UTF-8 bytes", () => {
    const exact512 = "A".repeat(MAX_MEMO_BYTES);
    expect(new TextEncoder().encode(exact512).length).toBe(512);
    const encoded = encodeZip321Memo(exact512);
    expect(decodeZip321Memo(encoded)).toBe(exact512);
  });

  it("rejects memos exceeding 512 UTF-8 bytes", () => {
    const tooLong = "A".repeat(MAX_MEMO_BYTES + 1);
    expect(() => encodeZip321Memo(tooLong)).toThrow(/exceeds 512-byte limit/i);

    const validation = validateZip321Payment({
      address:
        "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd",
      memo: tooLong,
    });
    expect(validation.valid).toBe(false);
    expect(validation.error).toMatch(/exceeds 512-byte limit/i);
  });

  it("calculates byte length for multi-byte characters accurately", () => {
    // '€' is 3 UTF-8 bytes. 170 * 3 = 510 bytes (valid). 171 * 3 = 513 bytes (invalid).
    const validEuro = "€".repeat(170);
    expect(new TextEncoder().encode(validEuro).length).toBe(510);
    expect(() => encodeZip321Memo(validEuro)).not.toThrow();

    const invalidEuro = "€".repeat(171);
    expect(new TextEncoder().encode(invalidEuro).length).toBe(513);
    expect(() => encodeZip321Memo(invalidEuro)).toThrow(/exceeds 512-byte limit/i);
  });
});

describe("ZIP-321 URI Generation & Parsing (Single and Multi-recipient)", () => {
  const sapling1 =
    "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
  const sapling2 =
    "zs1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqp9h7z8";
  const transparent1 = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";

  it("builds and parses a standard single-recipient URI", () => {
    const uri = buildZip321Uri([
      {
        address: sapling1,
        amount: "0.5",
        memo: "Coffee payment",
        label: "Alice",
        message: "Order #1234",
      },
    ]);

    expect(uri.startsWith(`zcash:${sapling1}?`)).toBe(true);
    expect(uri).toContain("amount=0.5");
    expect(uri).toContain("label=Alice");

    const parsed = parseZip321Uri(uri);
    expect(parsed.length).toBe(1);
    expect(parsed[0].address).toBe(sapling1);
    expect(parsed[0].amount).toBe("0.5");
    expect(parsed[0].memo).toBe("Coffee payment");
    expect(parsed[0].label).toBe("Alice");
    expect(parsed[0].message).toBe("Order #1234");
  });

  it("builds a single recipient transparent URI without memo", () => {
    const uri = buildZip321Uri([
      {
        address: transparent1,
        amount: "10",
        label: "Exchange",
      },
    ]);

    expect(uri).toBe(`zcash:${transparent1}?amount=10&label=Exchange`);
    const parsed = parseZip321Uri(uri);
    expect(parsed[0].address).toBe(transparent1);
    expect(parsed[0].amount).toBe("10");
    expect(parsed[0].memo).toBeUndefined();
  });

  it("builds and parses multi-recipient payment requests with indexed parameters", () => {
    const payments = [
      {
        address: sapling1,
        amount: "0.25",
        memo: "Split 1",
      },
      {
        address: sapling2,
        amount: "0.75",
        memo: "Split 2",
      },
      {
        address: transparent1,
        amount: "1.5",
      },
    ];

    const uri = buildZip321Uri(payments);
    expect(uri.startsWith("zcash:?")).toBe(true);
    expect(uri).toContain(`address=${encodeURIComponent(sapling1)}`);
    expect(uri).toContain("amount=0.25");
    expect(uri).toContain(`address.1=${encodeURIComponent(sapling2)}`);
    expect(uri).toContain("amount.1=0.75");
    expect(uri).toContain(`address.2=${encodeURIComponent(transparent1)}`);
    expect(uri).toContain("amount.2=1.5");

    const parsed = parseZip321Uri(uri);
    expect(parsed.length).toBe(3);
    expect(parsed[0].address).toBe(sapling1);
    expect(parsed[0].amount).toBe("0.25");
    expect(parsed[0].memo).toBe("Split 1");

    expect(parsed[1].address).toBe(sapling2);
    expect(parsed[1].amount).toBe("0.75");
    expect(parsed[1].memo).toBe("Split 2");

    expect(parsed[2].address).toBe(transparent1);
    expect(parsed[2].amount).toBe("1.5");
    expect(parsed[2].memo).toBeUndefined();
  });

  it("rejects multi-recipient URI construction if any recipient is invalid", () => {
    expect(() =>
      buildZip321Uri([
        { address: sapling1, amount: "1.0" },
        { address: transparent1, amount: "0.5", memo: "Invalid transparent memo" },
      ]),
    ).toThrow(/Memos are not supported for transparent addresses/i);

    expect(() =>
      buildZip321Uri([
        { address: sapling1, amount: "-5" },
        { address: sapling2, amount: "1.0" },
      ]),
    ).toThrow(/Recipient 1: Invalid amount/i);
  });
});
