import { StaticImageData } from "next/image";
import ZashiIconBlack from "../../../assets/brand/Wallets/Zashi/PNG/ZashiIconBlack.png";

export type WalletType = "intro" | "mobile" | "desktop" | "web" | "resources";

export interface Stage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  type: "welcome" | "intro" | "wallet";
  icon?: StaticImageData | undefined;
  walletType?: WalletType;
}

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Welcome",
    subtitle: "Ready to explore Zcash wallets?",
    description: `Zcash wallets enable shielded transactions, protecting sender, receiver, and amount. Different wallets emphasize different privacy and UX trade-offs.`,
    type: "welcome",
  },
  {
    id: 1,
    title: "Zcash Wallets",
    subtitle: "Shielded Functionality",
    description:
      "Wallets provide different features for managing your ZEC. From Tor privacy to DEX swaps, choose the right tool for your needs.",
    type: "wallet",
    walletType: "intro",
    icon: ZashiIconBlack,
  },
  {
    id: 2,
    title: "Mobile Wallets",
    subtitle: "Privacy On-the-Go",
    description:
      "iOS and Android wallets for everyday transactions. Full shielded support in your pocket.",
    type: "wallet",
    walletType: "mobile",
    icon: ZashiIconBlack,
  },
  {
    id: 3,
    title: "Desktop Wallets",
    subtitle: "Full-Featured Experience",
    description:
      "Windows, macOS, and Linux applications with advanced features and secure key storage.",
    type: "wallet",
    walletType: "desktop",
    icon: ZashiIconBlack,
  },
  {
    id: 4,
    title: "Web Wallets",
    subtitle: "Browser-Based Access",
    description:
      "Access your ZEC from any device without installing software. Quick and convenient.",
    type: "wallet",
    walletType: "web",
    icon: ZashiIconBlack,
  },
  {
    id: 5,
    title: "Learn More",
    subtitle: "ZecHub Resources",
    description:
      "Visit zechub.wiki/wallets for comprehensive wallet comparisons, guides, and the latest updates.",
    type: "wallet",
    walletType: "resources",
    icon: ZashiIconBlack,
  },
];
