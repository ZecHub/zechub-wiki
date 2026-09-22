import { Server, Database, Smartphone, Monitor, Globe, Layers } from 'lucide-react';
import { Stage, ComponentsMap } from './types';

export const STAGES: Stage[] = [
  {
    id: 0,
    title: "Welcome to Zcash Infrastructure",
    description: "Explore how Zcash's components work together to enable private, decentralized transactions across the entire network stack.",
    highlight: []
  },
  {
    id: 1,
    title: "Full Nodes: The Foundation",
    description: "Zebra nodes validate every transaction and maintain the complete Zcash blockchain, forming the decentralized backbone that ensures network security and consensus.",
    highlight: ["zebra"]
  },
  {
    id: 2,
    title: "Zaino Indexers: Modern Bridge",
    description: "Zaino indexers process blockchain data from Zebra nodes, providing optimized, fast access for light wallets without requiring full blockchain downloads.",
    highlight: ["zebra", "zaino"]
  },
  {
    id: 3,
    title: "Lightwalletd: Traditional Approach",
    description: "Lightwalletd servers offer an alternative, time-tested interface between full nodes and wallets, enabling lightweight client access with proven reliability.",
    highlight: ["zebra", "lightwalletd"]
  },
  {
    id: 4,
    title: "Mobile Wallets: Privacy On-The-Go",
    description: "Mobile wallets connect to indexers or light wallet servers, empowering users to send and receive shielded Zcash transactions securely from anywhere.",
    highlight: ["zaino", "lightwalletd", "mobile"]
  },
  {
    id: 5,
    title: "Desktop Wallets: Power User Tools",
    description: "Desktop wallets provide advanced features and granular control, connecting to indexers for enhanced privacy and comprehensive transaction management.",
    highlight: ["zaino", "lightwalletd", "desktop"]
  },
  {
    id: 6,
    title: "Web Wallets: Browser-Based Access",
    description: "Web wallets deliver convenient browser-based access to Zcash, connecting through indexers or servers for seamless, cross-platform transaction capabilities.",
    highlight: ["zaino", "lightwalletd", "web"]
  },
  {
    id: 7,
    title: "The Complete Ecosystem",
    description: "All layers working in harmony: Full nodes validate and secure, indexers optimize data access, and wallets provide intuitive interfaces for private, permissionless transactions.",
    highlight: ["zebra", "zaino", "lightwalletd", "mobile", "desktop", "web"]
  }
];

export const COMPONENTS: ComponentsMap = {
  zebra: {
    name: "Zebra Node",
    description: "Full node implementation that validates and stores the complete Zcash blockchain",
    color: "from-yellow-400 via-amber-400 to-yellow-500",
    borderColor: "border-yellow-400/50",
    glowColor: "shadow-[0_0_40px_rgba(251,191,36,0.4),0_0_80px_rgba(251,191,36,0.2)]",
    icon: Server,
    docs: "https://zechub.wiki/developers/quick-start#zebrad",
    layer: 1
  },
  zaino: {
    name: "Zaino Indexer",
    description: "Rust-based indexer that processes blockchain data for light clients",
    color: "from-emerald-400 via-green-400 to-emerald-500",
    borderColor: "border-emerald-400/50",
    glowColor: "shadow-[0_0_40px_rgba(52,211,153,0.4),0_0_80px_rgba(52,211,153,0.2)]",
    icon: Database,
    docs: "https://zechub.wiki/developers/quick-start#zaino",
    layer: 2
  },
  lightwalletd: {
    name: "Lightwalletd Server",
    description: "Lightweight server interface for mobile and desktop wallets",
    color: "from-cyan-400 via-blue-400 to-cyan-500",
    borderColor: "border-cyan-400/50",
    glowColor: "shadow-[0_0_40px_rgba(34,211,238,0.4),0_0_80px_rgba(34,211,238,0.2)]",
    icon: Layers,
    docs: "https://zechub.wiki/developers/quick-start#zebrad",
    layer: 2
  },
  mobile: {
    name: "Mobile Wallets",
    description: "iOS and Android apps for Zcash transactions on-the-go",
    color: "from-purple-400 via-pink-400 to-purple-500",
    borderColor: "border-purple-400/50",
    glowColor: "shadow-[0_0_30px_rgba(192,132,252,0.4),0_0_60px_rgba(192,132,252,0.2)]",
    icon: Smartphone,
    docs: "https://zechub.wiki/developers/quick-start",
    layer: 3
  },
  desktop: {
    name: "Desktop Wallets",
    description: "Full-featured desktop applications with advanced privacy controls",
    color: "from-violet-400 via-purple-400 to-violet-500",
    borderColor: "border-violet-400/50",
    glowColor: "shadow-[0_0_30px_rgba(167,139,250,0.4),0_0_60px_rgba(167,139,250,0.2)]",
    icon: Monitor,
    docs: "https://zechub.wiki/developers/quick-start#zingolib",
    layer: 3
  },
  web: {
    name: "Web Wallets",
    description: "Browser-based wallets for convenient Zcash access",
    color: "from-blue-400 via-indigo-400 to-blue-500",
    borderColor: "border-blue-400/50",
    glowColor: "shadow-[0_0_30px_rgba(96,165,250,0.4),0_0_60px_rgba(96,165,250,0.2)]",
    icon: Globe,
    docs: "https://zechub.wiki/developers/quick-start",
    layer: 3
  }
};