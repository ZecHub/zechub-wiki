/** @jest-environment node */
import fs from "fs";
import path from "path";

/**
 * Regression + parity tests for the ZIP-321 validation now enforced by the
 * standalone embed (public/zcash-payment-request-widget.embed.v2.js).
 *
 * Before this change, the embed built `zcash:` URIs directly from raw
 * host-supplied values with no equivalent to the validation PR #810 added
 * to src/lib/zip321.ts: memos were percent-encoded instead of base64url,
 * the 512-byte memo limit was not enforced, transparent addresses could
 * carry a memo, and amount formatting was not normalized.
 *
 * PR #810 is not merged (and its src/lib/zip321.ts does not exist on this
 * branch), so true "run the same inputs against #810's implementation"
 * parity isn't literally importable here. Instead, REFERENCE_ZIP321 below
 * is a frozen, verbatim copy of the relevant functions from #810's
 * src/lib/zip321.ts as of its commit 7b74f2371 (fetched via
 * `git show origin/pr-810:src/lib/zip321.ts`), used only to assert the
 * embed's local reimplementation makes the same accept/reject decisions
 * and produces the same output for the same input. Once #810 merges, this
 * fixture should be replaced with a real import.
 */

const EMBED_SCRIPT_PATH = path.join(
  process.cwd(),
  "public",
  "zcash-payment-request-widget.embed.v2.js",
);

const BEGIN_MARKER = "// ---------- ZIP-321 request validation ----------";
const END_MARKER = "// ---------- End ZIP-321 request validation ----------";

function loadEmbedZip321Helpers() {
  const source = fs.readFileSync(EMBED_SCRIPT_PATH, "utf8");
  const start = source.indexOf(BEGIN_MARKER);
  const end = source.indexOf(END_MARKER);
  if (start === -1 || end === -1) {
    throw new Error("Could not locate ZIP-321 validation markers in embed script");
  }
  const vendoredSource = source.slice(start, end);
  // eslint-disable-next-line no-new-func
  const factory = new Function(
    `${vendoredSource}\nreturn { formatZip321Amount, encodeZip321MemoLocal, isTransparentZcashAddress, isQrCapacityError };`,
  );
  return factory() as {
    formatZip321Amount: (amount: unknown) => string;
    encodeZip321MemoLocal: (memo: string, address?: string) => string;
    isTransparentZcashAddress: (address: string) => boolean;
    isQrCapacityError: (err: unknown) => boolean;
  };
}

// ---- Frozen reference copy of PR #810's src/lib/zip321.ts (commit 7b74f2371) ----
const MAX_ZEC_SUPPLY = 21_000_000;
const MAX_MEMO_BYTES = 512;
const ZATOSHI_DECIMALS = 8;

function referenceIsTransparentAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return (
    trimmed.startsWith("t1") || trimmed.startsWith("t3") || trimmed.startsWith("tm")
  );
}

function referenceFormatZecAmount(amount: number | string): string {
  if (amount === undefined || amount === null || amount === "") {
    throw new Error("Amount is required");
  }
  let str: string;
  if (typeof amount === "number") {
    if (isNaN(amount) || !isFinite(amount)) {
      throw new Error("Invalid amount: must be a finite number");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount: must be greater than zero");
    }
    str = amount.toFixed(8);
  } else {
    str = amount.trim();
    if (/e/i.test(str)) {
      const num = Number(str);
      if (isNaN(num) || !isFinite(num) || num <= 0) {
        throw new Error("Invalid amount: must be greater than zero");
      }
      str = num.toFixed(8);
    }
  }
  if (!/^\d+(\.\d+)?$/.test(str)) {
    throw new Error("Invalid amount format: must be a positive decimal number");
  }
  const parts = str.split(".");
  let intPart = parts[0];
  const fracPart = parts[1] || "";
  if (fracPart.length > ZATOSHI_DECIMALS) {
    throw new Error(
      `Invalid amount: exceeds maximum ${ZATOSHI_DECIMALS} decimal places (zatoshi precision)`,
    );
  }
  intPart = intPart.replace(/^0+(?=\d)/, "") || "0";
  const numVal = parseFloat(`${intPart}${fracPart ? "." + fracPart : ""}`);
  if (numVal <= 0) {
    throw new Error("Invalid amount: must be greater than zero");
  }
  if (numVal > MAX_ZEC_SUPPLY) {
    throw new Error(`Invalid amount: exceeds maximum ZEC supply (${MAX_ZEC_SUPPLY})`);
  }
  if (fracPart) {
    const trimmedFrac = fracPart.replace(/0+$/, "");
    return trimmedFrac ? `${intPart}.${trimmedFrac}` : intPart;
  }
  return intPart;
}

function referenceEncodeZip321Memo(memo: string, address?: string): string {
  if (!memo) return "";
  if (address && referenceIsTransparentAddress(address)) {
    throw new Error("Memos are not supported for transparent addresses in ZIP 321");
  }
  const bytes = new TextEncoder().encode(memo);
  if (bytes.length > MAX_MEMO_BYTES) {
    throw new Error(
      `Memo exceeds ${MAX_MEMO_BYTES}-byte limit (actual: ${bytes.length} bytes)`,
    );
  }
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
// ---- End frozen reference copy ----

function decodeBase64url(encoded: string): string {
  let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) b64 += "=";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function outcome(fn: () => unknown): { ok: true; value: unknown } | { ok: false; error: string } {
  try {
    return { ok: true, value: fn() };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

describe("embed ZIP-321 validation vs. PR #810 reference", () => {
  const helpers = loadEmbedZip321Helpers();
  const shieldedAddress =
    "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
  const transparentAddress = "t1VpMigELggqi6TBghQNehqspAcBBDYvRQC";

  describe("amount parity", () => {
    const cases: Array<number | string> = [
      1, "1.5", "0.00000001", "1e-8", 0, -1, "abc", "", "21000001", "0.123456789",
      "01.50000000",
    ];

    it.each(cases)("formatZip321Amount(%p) matches the #810 reference", (input) => {
      const embedResult = outcome(() => helpers.formatZip321Amount(input));
      const referenceResult = outcome(() => referenceFormatZecAmount(input as number | string));
      expect(embedResult).toEqual(referenceResult);
    });
  });

  describe("memo parity", () => {
    const memoCases: Array<[string, string | undefined]> = [
      ["hello", shieldedAddress],
      ["hello", transparentAddress],
      ["a".repeat(512), shieldedAddress],
      ["a".repeat(513), shieldedAddress],
      ["🛡️".repeat(200), shieldedAddress],
      ["", shieldedAddress],
    ];

    it.each(memoCases)("encodeZip321MemoLocal(%p, %p) matches the #810 reference", (memo, address) => {
      const embedResult = outcome(() => helpers.encodeZip321MemoLocal(memo, address));
      const referenceResult = outcome(() => referenceEncodeZip321Memo(memo, address));
      expect(embedResult).toEqual(referenceResult);
    });
  });

  describe("transparent-address detection parity", () => {
    const addresses = [transparentAddress, "t3VzFdEkhttkgfp2hkEvihnc8v5K8p8q35B", shieldedAddress, "u1p0906hsww2yq77l249qj4swj72n9q3t0"];
    it.each(addresses)("isTransparentZcashAddress(%p) matches the #810 reference", (addr) => {
      expect(helpers.isTransparentZcashAddress(addr)).toBe(referenceIsTransparentAddress(addr));
    });
  });

  // ---- Explicit requested scenarios ----

  it("1. exactly 512 ASCII memo bytes is accepted", () => {
    const memo = "a".repeat(512);
    expect(() => helpers.encodeZip321MemoLocal(memo, shieldedAddress)).not.toThrow();
  });

  it("2. 513 ASCII memo bytes is rejected before QR generation", () => {
    const memo = "a".repeat(513);
    expect(() => helpers.encodeZip321MemoLocal(memo, shieldedAddress)).toThrow(/512-byte limit/);
  });

  it("3. a Unicode memo whose UTF-8 encoding is exactly 512 bytes is accepted", () => {
    const memo = "€".repeat(170) + "a".repeat(2); // 170*3 + 2 = 512 bytes
    expect(new TextEncoder().encode(memo).length).toBe(512);
    expect(() => helpers.encodeZip321MemoLocal(memo, shieldedAddress)).not.toThrow();
  });

  it("4. a Unicode memo whose UTF-8 encoding is >512 bytes is rejected", () => {
    const memo = "€".repeat(171); // 513 bytes
    expect(new TextEncoder().encode(memo).length).toBe(513);
    expect(() => helpers.encodeZip321MemoLocal(memo, shieldedAddress)).toThrow(/512-byte limit/);
  });

  it("5 & 6. a valid memo becomes unpadded base64url and decodes back to the original UTF-8 memo", () => {
    const memo = "Thanks for your order! 🛡️";
    const encoded = helpers.encodeZip321MemoLocal(memo, shieldedAddress);
    expect(encoded).not.toContain("=");
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    expect(/^[A-Za-z0-9_-]*$/.test(encoded)).toBe(true);
    expect(decodeBase64url(encoded)).toBe(memo);
  });

  it("7. transparent address + memo is rejected", () => {
    expect(() => helpers.encodeZip321MemoLocal("hi", transparentAddress)).toThrow(
      /not supported for transparent addresses/,
    );
  });

  it("8. shielded/UA address + valid memo produces a valid ZIP-321 memo value", () => {
    expect(() => helpers.encodeZip321MemoLocal("hi", shieldedAddress)).not.toThrow();
    const uaAddress = "u1p0906hsww2yq77l249qj4swj72n9q3t0a6k9d7a2y29g9mptfsq6f77q7c4v7p2p0n8x9f36h4j";
    expect(() => helpers.encodeZip321MemoLocal("hi", uaAddress)).not.toThrow();
  });

  it("9. invalid/unsupported amounts are rejected consistently with #810", () => {
    for (const bad of [0, -1, "abc", "", "1e400", "0.123456789", 21_000_001]) {
      const embedResult = outcome(() => helpers.formatZip321Amount(bad));
      const referenceResult = outcome(() => referenceFormatZecAmount(bad as number | string));
      expect(embedResult.ok).toBe(false);
      expect(embedResult).toEqual(referenceResult);
    }
  });

  it("10. a huge host-supplied memo is rejected by byte-length before any QR step could see it", () => {
    const huge = "a".repeat(100_000);
    expect(() => helpers.encodeZip321MemoLocal(huge, shieldedAddress)).toThrow(/512-byte limit/);
  });

  it("11. isQrCapacityError recognizes the QR encoder's own RangeError distinctly from a ZIP-321 error", () => {
    expect(helpers.isQrCapacityError(new RangeError("Data too long"))).toBe(true);
    expect(helpers.isQrCapacityError(new Error("Data too long"))).toBe(false);
    expect(helpers.isQrCapacityError(new Error("Memo exceeds 512-byte limit"))).toBe(false);
    expect(helpers.isQrCapacityError(undefined)).toBe(false);
  });
});
