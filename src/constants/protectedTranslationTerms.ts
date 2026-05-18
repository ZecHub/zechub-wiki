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
    | "ecosystem";
  note?: string;
};

export const PROTECTED_TRANSLATION_TERMS: ProtectedTranslationTerm[] = [
  { term: "Zcash", category: "brand" },
  { term: "ZEC", category: "brand" },
  { term: "ZecHub", category: "brand" },
  { term: "ECC", category: "ecosystem", note: "Electric Coin Co." },
  { term: "Zcash Foundation", category: "ecosystem" },
  { term: "ZCG", category: "ecosystem", note: "Zcash Community Grants" },

  { term: "Arborist Calls", category: "community" },
  { term: "Zcash Community Forum", category: "community" },
  { term: "Zcash Global Ambassadors", category: "community" },

  { term: "ZK-SNARKs", category: "cryptography" },
  { term: "zk-SNARKs", category: "cryptography" },
  { term: "Halo", category: "cryptography" },
  { term: "FROST", category: "cryptography" },
  { term: "Zero-Knowledge Proofs", category: "cryptography" },

  { term: "Orchard", category: "protocol" },
  { term: "Sapling", category: "protocol" },
  { term: "Sprout", category: "protocol" },
  { term: "NU5", category: "network" },
  { term: "ZIP", category: "protocol", note: "Zcash Improvement Proposal" },
  { term: "Zebra", category: "network" },
  { term: "lightwalletd", category: "network" },

  { term: "Unified Address", category: "addressing" },
  { term: "Viewing Key", category: "addressing" },
  { term: "Spending Key", category: "addressing" },
  { term: "TEX Address", category: "addressing" },
  { term: "Shielded", category: "protocol" },
  { term: "Transparent", category: "protocol" },
  { term: "Memo", category: "protocol" },

  { term: "YWallet", category: "wallet" },
  { term: "Zingo", category: "wallet" },
  { term: "Zashi", category: "wallet" },
  { term: "Zallet", category: "wallet" },
  { term: "Zecwallet", category: "wallet" },
  { term: "ZODL", category: "wallet" },
];

export const PROTECTED_TRANSLATION_TERM_SET = new Set(
  PROTECTED_TRANSLATION_TERMS.map(({ term }) => term)
);
