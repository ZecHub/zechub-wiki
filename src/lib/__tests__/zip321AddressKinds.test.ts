/** @jest-environment node */
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import {
  buildZip321Uri,
  isSproutAddress,
  isTransparentAddress,
  parseZip321Uri,
  validateZip321Payment,
} from "../zip321";
import { detectZcashNetwork } from "@/app/[locale]/tools/helper";

// Sprout payment addresses: Base58Check, 95 characters.
const SPROUT_MAINNET =
  "zcU1Cd6zYyZCd2VJF8yKgmzjxdiiU1rgTTjEwoN1CGUWCziPkUTXUjXmX7TMqdMNsTfuiGN1jQoVN4kGxUR4sAPN4XZ7pxb";
const SPROUT_TESTNET =
  "ztJ1EWLKcGwF2S4NA17pAJVdco8Sdkz4AQPxt1cLTEfNuyNswJJc2BbBqYrsRZsp31xbVZwhF7c7a2L9jsF3p3ZTRYp5aPZ";
const SAPLING =
  "zs1znewaqucqpc372x6ajmfnmkmxsafnc3fuxmg6g5kq3mkvkv8ufx9hgx9vgcrqncqm3umz56a7pd";
const SAPLING_TESTNET =
  "ztestsapling1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const P2SH_MAINNET = "t3VzFdEkhttkgfp2hkEvihnc8v5K8p8q35B";
const P2SH_TESTNET = "t2UNzUUx8mWBCRYPRezvA363EYXyEpHokyi";

describe("ZIP 321: Sprout addresses MUST NOT be supported", () => {
  it("recognises Mainnet and Testnet Sprout addresses only", () => {
    expect(isSproutAddress(SPROUT_MAINNET)).toBe(true);
    expect(isSproutAddress(SPROUT_TESTNET)).toBe(true);
    expect(isSproutAddress(SAPLING)).toBe(false);
    expect(isSproutAddress(SAPLING_TESTNET)).toBe(false);
    expect(isSproutAddress(P2SH_MAINNET)).toBe(false);
  });

  it("rejects a Sprout recipient in validation, building and parsing", () => {
    expect(validateZip321Payment({ address: SPROUT_MAINNET, amount: "1" })).toEqual({
      valid: false,
      error: "Sprout addresses are not supported in ZIP 321 payment requests",
    });
    expect(() => buildZip321Uri([{ address: SPROUT_MAINNET, amount: "1" }])).toThrow(
      /Sprout/,
    );
    expect(() => parseZip321Uri(`zcash:${SPROUT_TESTNET}?amount=1`)).toThrow(/Sprout/);
  });

  it("rejects a Sprout address among several recipients", () => {
    expect(() =>
      buildZip321Uri([
        { address: SAPLING, amount: "1" },
        { address: SPROUT_MAINNET, amount: "2" },
      ]),
    ).toThrow(/Recipient 2: Sprout/);
  });
});

describe("ZIP 321: memos are invalid for every transparent address", () => {
  it("treats Testnet P2SH (t2) as transparent", () => {
    expect(isTransparentAddress(P2SH_TESTNET)).toBe(true);
  });

  it("refuses a memo to a Testnet P2SH address when building and parsing", () => {
    expect(() =>
      buildZip321Uri([{ address: P2SH_TESTNET, amount: "1", memo: "hi" }]),
    ).toThrow(/transparent/);
    expect(() => parseZip321Uri(`zcash:${P2SH_TESTNET}?amount=1&memo=aGk`)).toThrow(
      /transparent/,
    );
  });
});

describe("detectZcashNetwork: P2SH addresses", () => {
  it("labels t3 as Mainnet and t2 as Testnet", () => {
    expect(detectZcashNetwork(P2SH_MAINNET)).toBe("mainnet");
    expect(detectZcashNetwork(P2SH_TESTNET)).toBe("testnet");
  });
});

describe("standalone embed: address kinds", () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), "public", "zcash-payment-request-widget.embed.v2.js"),
    "utf8",
  );
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    errorSpy.mockRestore();
  });

  function render(opts: Record<string, unknown>) {
    const dom = new JSDOM(`<!doctype html><body><div id="t"></div></body>`, {
      runScripts: "outside-only",
      url: "https://merchant.example/",
    });
    const w = dom.window as unknown as Window & {
      renderZcashButton: (s: string, o: Record<string, unknown>) => Promise<unknown>;
      eval: (src: string) => unknown;
    };
    (w as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
    w.eval(source);
    return { w, inst: w.renderZcashButton("#t", { amount: 1, zecUsdRate: 1, ...opts }) };
  }

  it("renders no button for a Sprout address", async () => {
    const { w, inst } = render({ address: SPROUT_MAINNET });
    expect(await inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining("Sprout"));
  });

  it("renders no button for a memo to a Testnet P2SH address", async () => {
    const { w, inst } = render({ address: P2SH_TESTNET, memo: "hi" });
    expect(await inst).toBeFalsy();
    expect(w.document.querySelector(".zwg-btn")).toBeNull();
  });

  it("still renders for a Sapling address", async () => {
    const { w, inst } = render({ address: SAPLING, memo: "hi" });
    expect(await inst).toBeTruthy();
    expect(w.document.querySelector(".zwg-btn")).not.toBeNull();
  });
});
