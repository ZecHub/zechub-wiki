/**
 * Unit tests for the wallet directory's feature links.
 *
 * Every unmapped feature used to fall through to the Shielded Pools page, so
 * "Address Book", "Tor Support", "TEX Address" and the rest all opened the
 * same unrelated article.
 */

import {
  GLOSSARY_URL,
  getFeatureLink,
  getWikiFeatureLink,
} from "../walletFeatureLinks";

const WALLET = "https://zodl.com";

describe("getFeatureLink", () => {
  it.each([
    ["Shielded Memo", "/using-zcash/memos"],
    ["TEX Address", "/using-zcash/transparent-exchange-addresses"],
    ["Tor Support", "/privacy-tools/tor-and-i2p"],
    ["Spend before Sync", "/zcash-tech/zcash-wallet-syncing"],
    ["Payment Request", "/using-zcash/payment-request-uris"],
    ["MultiSignature", "/zcash-tech/frost"],
    ["Flexa Payments", "/using-zcash/payment-processors"],
    ["Near Intents", "/dex"],
    ["CrossPay", `${GLOSSARY_URL}#c`],
    ["Web App", "/web-wallets"],
  ])("links %s to its own page", (feature, expected) => {
    expect(getFeatureLink(feature, WALLET)).toBe(expected);
  });

  it("ignores case and extra whitespace", () => {
    expect(getFeatureLink("NEAR Intents", WALLET)).toBe("/dex");
    expect(getFeatureLink("  tex   address ", WALLET)).toBe(
      "/using-zcash/transparent-exchange-addresses",
    );
  });

  it("covers singular and plural spellings used in Wallets.md", () => {
    expect(getWikiFeatureLink("Payment Requests")).toBe(
      getWikiFeatureLink("Payment Request"),
    );
    expect(getWikiFeatureLink("Cross-chain Swaps")).toBe(
      getWikiFeatureLink("Cross-chain Swap"),
    );
    expect(getWikiFeatureLink("Testnet")).toBe(
      getWikiFeatureLink("Testnet Support"),
    );
  });

  it("does not send unrelated features to Shielded Pools", () => {
    for (const feature of ["Address Book", "CrossPay", "Shielded Memo", "TEX Address", "Tor Support"]) {
      expect(getFeatureLink(feature, WALLET)).not.toBe("/using-zcash/shielded-pools");
    }
  });

  it("falls back to the wallet's own site for wallet-specific features", () => {
    expect(getFeatureLink("Address Book", WALLET)).toBe(WALLET);
    expect(getFeatureLink("Beta", "https://example.com/wallet ")).toBe(
      "https://example.com/wallet",
    );
  });

  it("falls back to the glossary when the wallet link is missing or not a web URL", () => {
    expect(getFeatureLink("Address Book")).toBe(GLOSSARY_URL);
    expect(getFeatureLink("Address Book", "")).toBe(GLOSSARY_URL);
    expect(getFeatureLink("Address Book", "javascript:alert(1)")).toBe(GLOSSARY_URL);
  });
});
