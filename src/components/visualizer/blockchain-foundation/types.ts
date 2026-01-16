export type BlockchainType =
  | "intro"
  | "digital-signature"
  | "anatomy"
  | "transaction-lifecycle"
  | "mining"
  | "miners"
  | "difficulty";

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "intro" | "blockchain";
  blockchainType?: BlockchainType;
}

export const stages: Stage[] = [
  {
    id: 0,
    title: "What is a Blockchain?",
    subtitle: "Distributed Ledger Technology",
    description:
      "A decentralized, append-only database where blocks of transactions are cryptographically linked together.",
    type: "blockchain",
    blockchainType: "intro",
  },
  {
    id: 1,
    title: "Digital Signatures",
    subtitle: "Proving Ownership Cryptographically",
    description:
      "Digital signatures use asymmetric cryptography to prove you authorized a transaction without revealing your private key.",
    type: "blockchain",
    blockchainType: "digital-signature",
  },
  {
    id: 2,
    title: "Anatomy of a Block",
    subtitle: "Inside the Building Blocks",
    description:
      "Each block contains a header with metadata and a body with transactions, linked by cryptographic hashes.",
    type: "blockchain",
    blockchainType: "anatomy",
  },
  {
    id: 3,
    title: "Transaction Lifecycle",
    subtitle: "From Broadcast to Confirmation",
    description:
      "Follow a transaction's journey from creation through the mempool to final inclusion in a mined block.",
    type: "blockchain",
    blockchainType: "transaction-lifecycle",
  },
  {
    id: 4,
    title: "Block Mining",
    subtitle: "Proof of Work (Equihash)",
    description:
      "Miners compete to find a valid nonce that produces a hash meeting the network's difficulty target.",
    type: "blockchain",
    blockchainType: "mining",
  },
  {
    id: 5,
    title: "Miners & Block Rewards",
    subtitle: "Incentivizing Security",
    description:
      "Miners secure the network by expending computational resources and receive newly minted ZEC as reward.",
    type: "blockchain",
    blockchainType: "miners",
  },
  {
    id: 6,
    title: "Block Time & Difficulty",
    subtitle: "Maintaining Consistency",
    description:
      "Zcash targets 75-second blocks. Difficulty adjusts automatically to maintain this rate regardless of hashrate.",
    type: "blockchain",
    blockchainType: "difficulty",
  },
];
