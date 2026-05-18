export type ProtectedTranslationTerm = {
  term: string;
  category:
    | "brand"
    | "protocol"
    | "cryptography"
    | "network"
    | "wallet"
    | "community"
    | "addressing"
    | "organization"
    | "software"
    | "governance"
    | "service";
  note?: string;
};

export const PROTECTED_TRANSLATION_TERMS: ProtectedTranslationTerm[] = [
  { term: "Zcash", category: "brand" },
  { term: "ZEC", category: "brand" },
  { term: "ZecHub", category: "brand" },
  { term: "ZecHub Wiki", category: "brand" },
  { term: "ZecHub DAO", category: "brand" },

  { term: "ECC", category: "organization", note: "Electric Coin Company" },
  { term: "Electric Coin Company", category: "organization" },
  { term: "Zcash Foundation", category: "organization" },
  { term: "ZCG", category: "organization", note: "Zcash Community Grants" },
  { term: "Zcash Community Grants", category: "organization" },
  { term: "Financial Privacy Foundation", category: "organization" },
  { term: "Shielded Labs", category: "organization" },
  { term: "Zingo Labs", category: "organization" },
  { term: "ZKAV Club", category: "organization" },

  { term: "Arborist Calls", category: "community" },
  { term: "Zcash Community Forum", category: "community" },
  { term: "Zcash Global Ambassadors", category: "community" },
  { term: "Zcash Media", category: "community" },
  { term: "Zcash Podcasts", category: "community" },
  { term: "Zcash Ecosystem Security", category: "community" },
  { term: "Cypherpunk Zero NFT", category: "community" },
  { term: "Zcon", category: "community" },
  { term: "Zcon Archive", category: "community" },

  { term: "ZCAP", category: "governance", note: "Zcash Community Advisory Panel" },
  { term: "ZOMG", category: "governance", note: "Former Zcash Major Grants committee" },
  { term: "ZIP", category: "governance", note: "Zcash Improvement Proposal" },
  { term: "ZIPs", category: "governance", note: "Zcash Improvement Proposals" },
  { term: "Dev Fund", category: "governance" },

  { term: "zk-SNARK", category: "cryptography" },
  { term: "zk-SNARKs", category: "cryptography" },
  { term: "ZK-SNARKs", category: "cryptography" },
  { term: "Halo", category: "cryptography" },
  { term: "Halo 2", category: "cryptography" },
  { term: "FROST", category: "cryptography" },
  { term: "Pallas", category: "cryptography" },
  { term: "Vesta", category: "cryptography" },

  { term: "Overwinter", category: "protocol" },
  { term: "Blossom", category: "protocol" },
  { term: "Heartwood", category: "protocol" },
  { term: "Canopy", category: "protocol" },
  { term: "Orchard", category: "protocol" },
  { term: "Sapling", category: "protocol" },
  { term: "Sprout", category: "protocol" },
  { term: "NU5", category: "network" },
  { term: "NU6", category: "network" },
  { term: "NU6.1", category: "network" },
  { term: "NU7", category: "network" },

  { term: "Zebra", category: "network" },
  { term: "zebrad", category: "software" },
  { term: "zcashd", category: "software" },
  { term: "zcash-cli", category: "software" },
  { term: "lightwalletd", category: "software" },
  { term: "Zaino", category: "software" },
  { term: "zingolib", category: "software" },

  { term: "Unified Address", category: "addressing" },
  { term: "Unified Addresses", category: "addressing" },
  { term: "UA", category: "addressing", note: "Unified Address" },
  { term: "UAs", category: "addressing", note: "Unified Addresses" },
  { term: "Unified Viewing Key", category: "addressing" },
  { term: "Full Viewing Key", category: "addressing" },
  { term: "Incoming Viewing Key", category: "addressing" },
  { term: "Outgoing Viewing Key", category: "addressing" },
  { term: "Viewing Key", category: "addressing" },
  { term: "Spending Key", category: "addressing" },
  { term: "Diversified Address", category: "addressing" },
  { term: "TEX Address", category: "addressing" },
  { term: "t-address", category: "addressing" },
  { term: "z-address", category: "addressing" },
  { term: "u-address", category: "addressing" },

  { term: "YWallet", category: "wallet" },
  { term: "Ywallet", category: "wallet" },
  { term: "Zingo", category: "wallet" },
  { term: "Zingo!", category: "wallet" },
  { term: "Zashi", category: "wallet" },
  { term: "Zallet", category: "wallet" },
  { term: "Zecwallet", category: "wallet" },
  { term: "ZODL", category: "wallet" },
  { term: "Nighthawk", category: "wallet" },
  { term: "Brave Wallet", category: "wallet" },
  { term: "Keystone Zashi", category: "wallet" },
  { term: "MetaMask Snap", category: "wallet" },
  { term: "Metamask Snap", category: "wallet" },

  { term: "Free2Z", category: "service" },
  { term: "Free2z", category: "service" },
  { term: "Zcash.Me", category: "service" },
  { term: "Zcash.me", category: "service" },
  { term: "Zgo", category: "service" },
  { term: "ZGo", category: "service" },
  { term: "BTCPayServer", category: "service" },
  { term: "BTCPayServer Zcash Plugin", category: "service" },
  { term: "BTCPayServer Plugin", category: "service" },
  { term: "Maya Protocol", category: "service" },
  { term: "Nym VPN", category: "service" },
  { term: "Akash Network", category: "service" },
  { term: "Avalanche RedBridge", category: "service" },
  { term: "Zkool Multisig", category: "service" },
  { term: "Zenith", category: "service" },
  { term: "DAO DAO", category: "service" },
];

export const PROTECTED_TRANSLATION_TERM_SET = new Set(
  PROTECTED_TRANSLATION_TERMS.map(({ term }) => term)
);
