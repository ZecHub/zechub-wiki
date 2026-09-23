/**
 * Where each wallet feature pill on the wallet directory links to.
 *
 * Feature names come from the `- Features:` lines in Using_Zcash/Wallets.md.
 * Keys are normalized (lowercase, single spaces) so spelling variants such as
 * "NEAR Intents" / "Near Intents" resolve to the same page.
 *
 * Features ZecHub has a page for link to that page. Anything else is specific
 * to one wallet (release stage, bots, integrations), so it links to that
 * wallet's own site rather than to an unrelated wiki page.
 */

const MEMOS = "/using-zcash/memos";
const TESTNET = "/using-zcash/testnet";
const SYNCING = "/zcash-tech/zcash-wallet-syncing";
const PAYMENT_REQUESTS = "/using-zcash/payment-request-uris";
const DEX = "/dex";
const DEFI = "/guides/using-zec-in-defi";
const SHIELDED_POOLS = "/using-zcash/shielded-pools";
const TOR_I2P = "/privacy-tools/tor-and-i2p";
const SAPLING = "/zcash-tech/sapling";
const FROST = "/zcash-tech/frost";
const PAYMENT_PROCESSORS = "/using-zcash/payment-processors";

export const GLOSSARY_URL = "/glossary-and-faqs/zcash-library";

const featureLinks: Record<string, string> = {
  // Pools
  orchard: SHIELDED_POOLS,
  sapling: SHIELDED_POOLS,
  transparent: SHIELDED_POOLS,
  shielded: SHIELDED_POOLS,
  "shielded zec": SHIELDED_POOLS,
  "shielded transactions": SHIELDED_POOLS,
  "shielded transaction default": SHIELDED_POOLS,
  "encrypted shielded transaction": SHIELDED_POOLS,
  "automatic shielding": SHIELDED_POOLS,
  "pool transfer": SHIELDED_POOLS,

  // Platforms
  mobile: "/mobile-wallets",
  desktop: "/desktop-wallets",
  "desktop app": "/desktop-wallets",
  "graphical interface": "/desktop-wallets",
  web: "/web-wallets",
  "web app": "/web-wallets",
  "browser extension": "/web-wallets",
  "cold storage": "/hardware-wallets",

  // Memos
  "shielded memo": MEMOS,
  "encrypted memo": MEMOS,

  // Addresses
  "tex address": "/using-zcash/transparent-exchange-addresses",
  "diversified address": SAPLING,
  "address rotation": SAPLING,
  "address check": "/zcash-social-media/zcash-addresses",

  // Keys, recovery and records
  "viewing key": "/zcash-tech/viewing-keys",
  "seed recovery": "/zcash-social-media/mnemonic-seed-phrases",
  "wallet recovery": "/using-zcash/recovering-funds",
  "transaction history": "/zcash-use-cases/keeping-records-with-shielded-zec",
  "transaction export": "/guides/viewing-key-transaction-export",

  // Multisig
  frost: FROST,
  "frost multisig": FROST,
  multisignature: FROST,

  // Sync
  "spend before sync": SYNCING,
  warpsync: SYNCING,
  "multi-account sync": SYNCING,
  "local witness derivation": SYNCING,
  peppersync: "/zcash-tech/pepper-sync",

  // Payments
  "payment request": PAYMENT_REQUESTS,
  "payment requests": PAYMENT_REQUESTS,
  "flexa payments": PAYMENT_PROCESSORS,
  cipherpay: PAYMENT_PROCESSORS,
  crosspay: `${GLOSSARY_URL}#c`,

  // Swaps and DeFi
  "dex swaps": DEX,
  "cross-chain swap": DEX,
  "cross-chain swaps": DEX,
  "near intents": DEX,
  "maya dex": "/guides/maya-protocol",
  "lending & borrowing": DEFI,
  "dapp connections": DEFI,

  // Network
  "testnet support": TESTNET,
  testnet: TESTNET,
  "tor support": TOR_I2P,
  "i2p support": TOR_I2P,
  "dynamic fee (zip-317)": "/using-zcash/transactions",
  "zebra/zebrad integration": "/zcash-tech/zebra-full-node",
  "nu6.2 compatibility": "/zcash-tech/nu6-2",
  "nu6.3 migration support": "/zcash-tech/ironwood",

  "end-to-end encrypted messenger": "/privacy-tools/secure-messengers",
};

const normalize = (feature: string) =>
  feature.trim().replace(/\s+/g, " ").toLowerCase();

/** The ZecHub page for a feature, or undefined if there isn't one. */
export const getWikiFeatureLink = (feature: string): string | undefined =>
  featureLinks[normalize(feature)];

/**
 * Link for a feature pill. Falls back to the wallet's own site, and to the
 * glossary if the wallet has no usable link.
 */
export const getFeatureLink = (feature: string, walletLink?: string): string => {
  const wikiLink = getWikiFeatureLink(feature);
  if (wikiLink) return wikiLink;
  if (walletLink && /^https?:\/\//i.test(walletLink.trim())) {
    return walletLink.trim();
  }
  return GLOSSARY_URL;
};
