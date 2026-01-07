// stages.ts
export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "welcome" | "intro" | "zashi" | "ywallet" | "categories";
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Welcome",
    subtitle: "Ready to explore Zcash wallets?",
    description:
      "Click play to learn how shielded Zcash wallets protect your privacy.",
    type: "welcome",
  },
  {
    id: 1,
    title: "Shielded Zcash Wallets",
    subtitle: "Privacy by default",
    description:
      "Zcash wallets enable shielded transactions, protecting sender, receiver, and amount. Different wallets emphasize different privacy and UX trade-offs.",
    type: "intro",
  },
  {
    id: 2,
    title: "Zashi Wallet",
    subtitle: "Privacy-first mobile wallet",
    description:
      "Zashi integrates Tor for network-level privacy and supports Near DEX swaps, combining shielded payments with DeFi access.",
    type: "zashi",
  },
  {
    id: 3,
    title: "Ywallet",
    subtitle: "Power-user Zcash wallet",
    description:
      "Ywallet supports multiple accounts, pool transfers, and advanced shielding controls for experienced Zcash users.",
    type: "ywallet",
  },
  {
    id: 4,
    title: "Wallet Categories",
    subtitle: "Choose your platform",
    description:
      "Zcash wallets are available across mobile, desktop, and web platforms—each with different trade-offs in custody, UX, and security.",
    type: "categories",
  },
];
