export type KeyType = 'intro' | 'transparent'|'shielded-overview' | 'sprout'| 'sapling' | 'orchard'

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | 'keys';
  keyType: KeyType
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Understanding Zcash Keys",
    subtitle: "Cryptographic Foundations",
    description:
      "Keys are the foundation of cryptocurrency ownership. Learn how Zcash generates and uses different key types.",
    type: "keys",
    keyType: "intro",
  },
  {
    id: 1,
    title: "Transparent Keys",
    subtitle: "Bitcoin-style Cryptography",
    description:
      "Private keys generate public keys which derive transparent addresses. Simple but fully visible on-chain.",
    type: "keys",
    keyType: "transparent",
  },
  {
    id: 2,
    title: "Shielded Key Architecture",
    subtitle: "Privacy Through Hierarchy",
    description:
      "Shielded protocols use a sophisticated key hierarchy with spending keys, viewing keys, and diversified addresses.",
    type: "keys",
    keyType: "shielded-overview",
  },
  {
    id: 3,
    title: "Sprout Keys",
    subtitle: "First Generation (Deprecated)",
    description:
      "The original shielded protocol. Historical importance but now deprecated in favor of modern protocols.",
    type: "keys",
    keyType: "sprout",
  },
  {
    id: 4,
    title: "Sapling Keys",
    subtitle: "Efficient Shielded Transactions",
    description:
      "Introduced diversified addresses and viewing keys. Enables efficient mobile wallet support.",
    type: "keys",
    keyType: "sapling",
  },
  {
    id: 5,
    title: "Orchard Keys",
    subtitle: "Unified Address Era",
    description:
      "Latest protocol with Unified Addresses. One address can receive to any pool type.",
    type: "keys",
    keyType: "orchard",
  },
];
