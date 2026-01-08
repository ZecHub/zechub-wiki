import { motion } from "framer-motion";
import { Stage, WalletType } from "./types";
import {
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Wallet,
  ExternalLink,
  Layers,
  Shuffle,
  Users,
  ArrowRightLeft,
  Info,
} from "lucide-react";

interface WalletContentProps {
  stage: Stage;
}

interface WalletInfo {
  name: string;
  features: string[];
  downloadUrl: string;
  logo?: string;
  color: string;
}

const MOBILE_WALLETS: WalletInfo[] = [
  {
    name: "Zashi",
    features: ["Tor Privacy", "Near DEX Swaps", "Unified Addresses"],
    downloadUrl: "https://electriccoin.co/zashi/",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Ywallet",
    features: ["Multiple Accounts", "Pool Transfers", "Sapling & Orchard"],
    downloadUrl: "https://ywallet.app/",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Nighthawk",
    features: ["Auto-shielding", "Memo Support", "Privacy Focused"],
    downloadUrl: "https://nighthawkwallet.com/",
    color: "from-purple-500 to-indigo-500",
  },
];

const DESKTOP_WALLETS: WalletInfo[] = [
  {
    name: "Zashi Desktop",
    features: ["Cross-platform", "Full Orchard Support", "Secure Key Storage"],
    downloadUrl: "https://electriccoin.co/zashi/",
    color: "from-amber-500 to-orange-500",
  },
  {
    name: "Ywallet Desktop",
    features: ["Cold Signing", "Multi-account", "Advanced Features"],
    downloadUrl: "https://ywallet.app/",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Zecwallet Lite",
    features: ["Lightweight", "Easy Setup", "Transparent & Shielded"],
    downloadUrl: "https://www.zecwallet.co/",
    color: "from-green-500 to-emerald-500",
  },
];

const WEB_WALLETS: WalletInfo[] = [
  {
    name: "ZecHub Wallet",
    features: ["Browser-based", "No Download", "Quick Access"],
    downloadUrl: "https://zechub.wiki/wallets",
    color: "from-violet-500 to-purple-500",
  },
  {
    name: "Dizzy Wallet",
    features: ["Web Interface", "Shielded Support", "Cross-platform"],
    downloadUrl: "https://dizzy.bot/",
    color: "from-pink-500 to-rose-500",
  },
];
