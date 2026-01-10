
export type HashType =
  | "intro"
  | "integrity"
  | "irreversible"
  | "collision"
  | "properties";

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "welcome" | "hash";
  amount?: string;
  hashType?: HashType;
}

export const STAGES: Stage[] = [
  {
    id: 1,
    title: "Hash Functions",
    subtitle: "Cryptographic Fingerprints",
    description:
      "Hash functions are one-way mathematical transformations that create unique digital fingerprints of any data.",
    type: "hash",
    hashType: "intro",
  },
  {
    id: 2,
    title: "Integrity Verification",
    subtitle: "Detecting Tampering",
    description:
      "Hashes act as checksums — any modification to data produces a completely different hash, revealing tampering.",
    type: "hash",
    hashType: "integrity",
  },
  {
    id: 3,
    title: "Irreversibility",
    subtitle: "One-Way Functions",
    description:
      "Hash functions are computationally irreversible. You cannot derive the original input from a hash output.",
    type: "hash",
    hashType: "irreversible",
  },
  {
    id: 4,
    title: "Collision Resistance",
    subtitle: "Unique Outputs",
    description:
      "A secure hash function makes it practically impossible to find two different inputs that produce the same hash.",
    type: "hash",
    hashType: "collision",
  },
  {
    id: 5,
    title: "Hash Properties",
    subtitle: "Additional Characteristics",
    description:
      "Beyond the core properties, hash functions exhibit the avalanche effect, determinism, and fixed output size.",
    type: "hash",
    hashType: "properties",
  },
];
