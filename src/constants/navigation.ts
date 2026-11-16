import { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";
import { BsPlay, BsDiscord as Discord } from "react-icons/bs";

import { MdOutlinePointOfSale as PointOfSale, MdOutlinePrivacyTip as PrivacyTip } from "react-icons/md";
import { LuFileKey as FileKey } from "react-icons/lu";
import { GrGroup as Group } from "react-icons/gr";
import { FaJarWheat as Jar } from "react-icons/fa6";
import { BsFillArrowUpRightCircleFill as ArrowUp } from "react-icons/bs";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import {
  MdOutlineOndemandVideo as AudioVideo,
  MdForum as Forum,
  MdDeveloperMode,
} from "react-icons/md";

import {
  Wrench,
  Map,
  Gem,
  KeyRound,
  LayoutDashboard,
  SlidersHorizontal,
  Network,
  Layers,
  Eye,
  FileText,
  BookOpen,
  ShieldCheck,
  Info,
  Presentation,
  GraduationCap,
  Users,
  Building2,
  Activity,
  Cpu,
  ShieldCheck as PrivacyShield,
  FlaskConical,
} from "lucide-react";
import { FaUserAstronaut } from "react-icons/fa";

import {
  RiGithubFill as Github,
  RiCommunityLine,
  RiGovernmentLine,
  RiTwitterXFill as Twitter,
  RiYoutubeFill as Youtube,
} from "react-icons/ri";
import { SiBrandfolder as BrandIcon, SiHomeassistant } from "react-icons/si";

export type NavigationItem = {
  name: string;
  label?: string;
  path?: string;
  icon?: IconType | LucideIcon | string;
  newTab?: boolean;
  links?: Array<NavigationItem>;
};

// Organizations now live inside the Ecosystem menu (nested), see below.
const organizationLinks: Array<NavigationItem> = [
  {
    name: "ZODL",
    path: "/zcash-organizations/ZODL",
  },
  {
    name: "Electric Coin Company",
    path: "/zcash-organizations/electric-coin-company",
  },
  {
    name: "Zcash Foundation",
    path: "/zcash-organizations/zcash-foundation",
  },
  {
    name: "Zcash Community Grants",
    path: "/zcash-organizations/zcash-community-grants",
  },
  {
    name: "Financial Privacy Foundation",
    path: "/zcash-organizations/financial-privacy-foundation",
  },
  {
    name: "Shielded Labs",
    path: "/zcash-organizations/shielded-labs",
  },
  {
    name: "Valar Group",
    path: "/zcash-organizations/valar-group",
  },
  {
    name: "Zcash Labs",
    path: "/zcash-organizations/zcash-labs",
  },
  {
    name: "CoinHolder Directed Retroactive Grants",
    path: "/zcash-organizations/coinholder-directed-retroactive-grants",
  },
  {
    name: "Sovright",
    path: "/zcash-organizations/sovright",
  },
  {
    name: "Obscura Labs",
    path: "/zcash-organizations/obscura-labs",
  },
  {
    name: "Zingo Labs",
    path: "/zcash-organizations/zingo-labs",
  },
  {
    name: "Brand",
    path: "/zcash-organizations/brand",
    icon: BrandIcon,
  },
  {
    name: "ZKAV Club",
    path: "/zcash-organizations/zkav",
    icon: "zkav-club.png",
  },
];

export const navigations: Array<NavigationItem> = [
  {
    name: "Learn Zcash",
    label: "Learn Zcash",
    links: [
      { name: "Zcash Basics", path: "/start-here/what-is-zec-and-zcash", icon: Info },
      { name: "Who Can See Your Payment?", path: "/start-here/who-can-see-your-zcash-payment", icon: Eye },
      { name: "New User Guide", path: "/start-here/new-user-guide", icon: Users },
      { name: "Monetary Policy", path: "/start-here/zcash-monetary-policy", icon: Gem },
      { name: "How Zcash Is Organized", path: "/start-here/how-zcash-is-organized", icon: Building2 },
      { name: "Zcash Evolution", path: "/zcash-evolution", icon: Activity },
      { name: "Ironwood", path: "/zcash-tech/ironwood", icon: ShieldCheck },
      { name: "Crosslink Protocol", path: "/zcash-tech/crosslink-protocol", icon: SlidersHorizontal },
      { name: "Project Tachyon", path: "/zcash-tech/project-tachyon", icon: Cpu },
      { name: "Zcash Library", path: "/glossary-and-faqs/zcash-library", icon: BookOpen },
      { name: "FAQ", path: "/glossary-and-faqs/faq", icon: Info },
      { name: "Zcash Tech", path: "/zcash-tech", icon: Cpu },
      { name: "Full Nodes", path: "/zcash-tech/full-nodes", icon: Network },
      { name: "Privacy Tools", path: "/privacy-tools", icon: PrivacyShield },
      { name: "Visualizer", path: "/visualizer", icon: BsPlay },
      { name: "Research", path: "/research", icon: FlaskConical },
      { name: "Visualizing the Zcash Network", path: "/guides/visualizing-the-zcash-network", icon: Network },
      { name: "Visualizing Zcash Addresses", path: "/guides/visualizing-zcash-addresses", icon: Map },
      { name: "Zero to Zero Knowledge", path: "/zero-to-zero-knowledge/zero-to-zero-knowledge", icon: GraduationCap },
      { name: "Shielded Pools", path: "/using-zcash/shielded-pools", icon: Layers },
      { name: "Zero-Knowledge vs Decoys", path: "/guides/zero-knowledge-vs-decoys", icon: Eye },
      { name: "My First Zcash Workbook", path: "/guides/my-first-zcash-workbook", icon: BookOpen },
    ],
  },
  {
    name: "Using Zcash",
    label: "Use Zcash",
    links: [
      {
        name: "Use Cases",
        path: "/zcash-use-cases/",
        icon: FaUserAstronaut,
        links: [
          {
            name: "Start Here",
            path: "/zcash-use-cases/about",
            icon: Info,
          },
          {
            name: "Accept Payments",
            path: "/zcash-use-cases/accept-payments-as-a-merchant",
            icon: PointOfSale,
          },
          {
            name: "Freelance Privacy",
            path: "/zcash-use-cases/freelance-privacy-setup",
            icon: PrivacyTip,
          },
          {
            name: "Journalist Privacy",
            path: "/zcash-use-cases/journalist-privacy-setup",
            icon: PrivacyTip,
          },
          {
            name: "Keeping Records",
            path: "/zcash-use-cases/keeping-records-with-shielded-zec",
            icon: FileKey,
          },
          {
            name: "Private Community Treasury",
            path: "/zcash-use-cases/private-community-treasury",
            icon: Group,
          },
          {
            name: "Donations",
            path: "/zcash-use-cases/receive-donations-privately",
            icon: Jar,
          },
          {
            name: "Send Money Privately",
            path: "/zcash-use-cases/send-money-without-linking-identity",
            icon: ArrowUp,
          },
          {
            name: "Zcash Login",
            path: "/zcash-use-cases/sign-in-with-zcash",
            icon: KeyRound,
          },
          {
            name: "Pay for AI",
            path: "/zcash-use-cases/pay-for-ai-with-shielded-zec",
            icon: MdDeveloperMode,
          },
        ],
      },
      {
        name: "Wallets",
        path: "/wallets",
      },
      {
        name: "Zallet Quick Reference Guide",
        path: "/using-zcash/zallet-quick-reference-guide",
      },
      {
        name: "MetaMask Snap",
        path: "/using-zcash/metamask-snap",
      },
      {
        name: "Buying ZEC",
        path: "/using-zcash/buying-zec",
      },
      {
        name: "Faucets",
        path: "/using-zcash/faucets",
      },
      {
        name: "Exchanges",
        path: "/dex",
      },
      {
        name: "Spend Zcash",
        path: "/using-zcash/spend-zcash/top-10-places-to-spend-zec",
        icon: PointOfSale,
        links: [
          {
            name: "Places to Spend ZEC",
            path: "/using-zcash/spend-zcash/top-10-places-to-spend-zec",
            icon: PointOfSale,
          },
        ],
      },
      {
        name: "Payment Processors",
        path: "/payment-processors",
      },
      {
        name: "Mobile Top Ups",
        path: "/using-zcash/mobile-top-ups",
      },
      {
        name: "Payment Request URIs",
        path: "/using-zcash/payment-request-uris",
      },
      {
        name: "Transactions",
        path: "/using-zcash/transactions",
      },
      {
        name: "Memos",
        path: "/using-zcash/memos",
      },
      {
        name: "Transparent Exchange Addresses",
        path: "/using-zcash/transparent-exchange-addresses",
      },
      {
        name: "Blockchain Explorers",
        label: "Block Explorers",
        path: "/using-zcash/blockchain-explorers",
      },
      {
        name: "Recovering Funds",
        path: "/using-zcash/recovering-funds",
      },
      {
        name: "Tools",
        path: "/tools",
        icon: Wrench,
      },
      {
        name: "Testnet",
        path: "/using-zcash/testnet",
      },
    ],
  },
  {
    name: "Zcash Community",
    label: "Ecosystem",
    links: [
      {
        name: "Zcash Organizations",
        label: "Organizations",
        path: "/zcash-organizations",
        icon: Building2,
        links: organizationLinks,
      },
      {
        name: "Arborist Calls",
        path: "/zcash-community/arborist-calls",
      },
      {
        name: "Zcash Governance",
        path: "/zcash-community/zcash-governance",
      },
      {
        name: "Community Blogs",
        path: "/zcash-community/community-blogs",
      },
      {
        name: "Community Links",
        path: "/zcash-community/community-links",
      },
      {
        name: "Community Forum",
        path: "https://forum.zcashcommunity.com/",
        icon: Forum,
        newTab: true,
      },
      {
        name: "Community Building",
        path: "/zcash-community/building",
        icon: Users,
      },
      {
        name: "Community Projects",
        path: "/zcash-community/community-projects",
      },
      {
        name: "Zcash Global Ambassadors",
        path: "/zcash-global-ambassadors",
      },
      {
        name: "Zcash Media",
        path: "/zcash-community/zcash-media",
      },
      {
        name: "ZCAP",
        path: "/zcash-community/zcap",
      },
      {
        name: "Zcash Podcasts",
        path: "/zcash-community/zcash-podcasts",
      },
      {
        name: "Zcash Ecosystem Security",
        path: "/zcash-community/zcash-ecosystem-security",
      },
      {
        name: "Cypherpunk Zero NFT",
        path: "/zcash-community/cypherpunk-zero-nft",
      },
      {
        name: "Zcon Archive",
        path: "/zcash-community/zcon-archive",
      },
      {
        name: "Zcon Vozes Archive",
        path: "/zcash-community/zcon-vozes",
        icon: Presentation,
      },
      {
	name: "Zcash Engineering Office Hours",
	path: "/zcash-community/zcash-engineering-office-hours",
      },
    ],
  },
  {
    name: "Guides",
    label: "Guides",
    links: [
      {
        name: "Zgo Payment Processor",
        path: "/guides/zgo-payment-processor",
      },
      {
        name: "Free2z Live",
        path: "/guides/free2z-live",
      },
      {
        name: "ZKAV Club",
        path: "/zfav-club/guides-for-creators",
        icon: AudioVideo,
      },
      {
        name: "Keystone Zodl (Zashi)",
        path: "/guides/keystone-zashi",
      },
      {
        name: "Maya Protocol",
        path: "/guides/maya-protocol",
      },
      {
        name: "Nym VPN",
        path: "/guides/nym-vpn",
      },
      {
        name: "Nym Mixnet Wallet Setup",
        path: "/guides/nym-mixnet-wallet-setup",
        icon: "/Logo/nym.svg",
      },
      {
        name: "Using ZEC in DeFi",
        path: "/guides/using-zec-in-defi",
      },
      {
        name: "Using ZEC Privately",
        path: "/guides/using-zec-privately",
      },
      {
        name: "Raspberry Pi 4 Full Node",
        label: "Zebra + Zallet on Raspberry Pi 4",
        path: "/guides/raspberry-pi-4-full-node",
      },
      {
        name: "Raspberry pi5 Zebra Lightwalletd Zingo",
        path: "/guides/raspberry-pi5-zebra-lightwalletd-zingo",
      },
      {
        name: "Hardened Zebrad",
        path: "/guides/hardened-zebrad",
      },
      {
        name: "Akash Network Zebra",
        path: "/guides/akash-network-zebra",
      },
      {
        name: "Zakura on Akash",
        path: "/guides/akash-network-zakura",
      },
      {
        name: "Avalanche RedBridge",
        path: "/guides/avalanche-redbridge",
      },
      {
        name: "Zkool Multisig",
        path: "/guides/zkool-multisig",
      },
      {
        name: "Ywallet FROST Demo",
        path: "/guides/ywallet-frost-demo",
      },
      {
        name: "Brave Wallet Guide",
        path: "/guides/brave-wallet-guide",
      },
      {
        name: "ShapeShift Zcash",
        path: "/guides/shapeshift-zcash",
      },
      {
        name: "Migration Guide Zcashd To Zebrad Zallet",
        path: "/guides/migration-guide-zcashd-to-zebrad-zallet",
      },
      {
        name: "Verifying Zcash Releases",
        path: "/guides/verifying-zcash-releases",
      },
      {
        name: "Viewing Key Transaction Export",
        path: "/guides/viewing-key-transaction-export",
      },
      {
        name: "BTCPayServer Zcash Plugin",
        path: "/guides/btcpayserver-zcash-plugin",
      },
      {
        name: "Zcash Devtool",
        path: "/guides/zcash-devtool",
      },
      {
        name: "Zingolib and Zaino Tutorial",
        path: "/guides/zingolib-and-zaino-tutorial",
      },
      {
        name: "Zenith Installation",
        path: "/guides/zenith-installation",
      },
    ],
  },
  {
    name: "Data",
    label: "Network",
    icon: LayoutDashboard,
    links: [
      { name: "Ecosystem Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { name: "Chain State Explorer", path: "/chain-stats", icon: Activity },
      {
        name: "Protocol Parameters",
        path: "/protocol-parameters",
        icon: SlidersHorizontal,
      },
      {
        name: "Network & Infrastructure",
        path: "/zcash-infrastructure-visualizer",
        icon: Network,
      },
      { name: "Value Pools", path: "/zcash-pool-visualizer", icon: Layers },
      { name: "Network Upgrades", path: "/start-here/network-upgrades", icon: Cpu },
      { name: "Zcash Improvement Proposals", path: "/guides/zcash-improvement-proposals", icon: FileText },
      { name: "zk-SNARKs", path: "/zcash-tech/zk-snarks" },
      { name: "Halo", path: "/zcash-tech/halo" },
      { name: "Unified Addresses", path: "/zcash-tech/unified-addresses" },
      { name: "Viewing Keys", path: "/zcash-tech/viewing-keys" },
      { name: "FROST Threshold Signatures", path: "/zcash-tech/frost" },
      { name: "Shielded Assets (ZSAs)", path: "/zcash-tech/zcash-shielded-assets" },
      { name: "Post-Quantum Security", path: "/zcash-tech/post-quantum-security", icon: ShieldCheck },
    ],
  },
  {
    name: "Governance",
    label: "Governance",
    icon: RiGovernmentLine,
    links: [
      {
        name: "How to Participate",
        path: "/governance-howto",
      },
      {
        name: "ZIPs & Grants",
        path: "/zips-grants",
      },
    ],
  },
  {
    name: "DAO",
    path: "/dao",
    icon: RiCommunityLine,
  },
  {
    name: "Tutorials",
    path: "/zechub-tutorial",
    icon: LiaChalkboardTeacherSolid,
  },
  {
    name: "Developers",
    path: "/developers",
    icon: MdDeveloperMode,
  },
  {
    name: "Contribute",
    path: "/contribute/help-build-zechub",
    icon: SiHomeassistant,
  },
  {
    name: "Sitemap",
    path: "/sitemap",
    icon: Map,
  },
  {
    name: "Visual Identity",
    path: "/visual-identity",
    icon: Gem,
  },
];

export const socialNav = [
  { name: "Discord", url: "https://discord.gg/zcash", icon: Discord },
  {
    name: "YouTube",
    url: "https://www.youtube.com/channel/UC3-KM00kjCUheRzO5cq3PAA",
    icon: Youtube,
  },
  { name: "X", url: "https://x.com/zechub", icon: Twitter },
  { name: "GitHub", url: "https://github.com/ZecHub/zechub", icon: Github },
];

export const socialMedia = [
  { name: "Youtube", link: "https://youtube.com/@zechub" },
  { name: "Newsletter", link: "https://zechub.substack.com/" },
  {
    name: "Podcast",
    link: "https://www.youtube.com/watch?v=ILdMTGtVOD4&list=PL6_epn0lASLHlNCMtUErX8UfaJK6N9K5O",
  },
  { name: "Extras", link: "https://extras.zechub.xyz/" },
  { name: "DAO", link: "https://vote.zechub.xyz/" },
  { name: "Store", link: "https://zechub.store/" },
];

// Desktop dropdown grouping. Purely presentational: the flat `links` arrays
// above stay the single source of truth (mobile menu, search and translations
// keep using them). Names must match `name` in `navigations`. Any link not
// listed here is shown under a trailing "More" group, so nothing disappears
// when a new page is added to `navigations`.
export type MenuSection = { title: string; items: string[] };

export const menuSections: Record<string, MenuSection[]> = {
  "Learn Zcash": [
    {
      title: "Start here",
      items: [
        "Zcash Basics",
        "Who Can See Your Payment?",
        "New User Guide",
        "Zero to Zero Knowledge",
        "My First Zcash Workbook",
      ],
    },
    {
      title: "How Zcash works",
      items: ["Zcash Tech", "Full Nodes", "Shielded Pools", "Zero-Knowledge vs Decoys", "Monetary Policy", "How Zcash Is Organized"],
    },
    {
      title: "Go deeper",
      items: ["Zcash Evolution", "Ironwood", "Crosslink Protocol", "Project Tachyon", "Research"],
    },
    { title: "Visualize", items: ["Visualizer", "Visualizing the Zcash Network", "Visualizing Zcash Addresses"] },
    { title: "Reference", items: ["Zcash Library", "FAQ", "Privacy Tools"] },
  ],
  "Using Zcash": [
    {
      title: "Get started",
      items: ["Buying ZEC", "Wallets", "Exchanges", "Faucets", "Recovering Funds"],
    },
    {
      title: "Spend & pay",
      items: [
        "Use Cases",
        "Spend Zcash",
        "Payment Processors",
        "Mobile Top Ups",
        "Payment Request URIs",
      ],
    },
    {
      title: "Understand",
      items: ["Transactions", "Memos", "Transparent Exchange Addresses", "Blockchain Explorers"],
    },
    {
      title: "Tools",
      items: ["Tools", "MetaMask Snap", "Zallet Quick Reference Guide", "Testnet"],
    },
  ],
  "Zcash Community": [
    {
      title: "Community",
      items: [
        "Community Links",
        "Community Forum",
        "Community Blogs",
        "Community Projects",
        "Zcash Global Ambassadors",
        "Community Building",
        "Cypherpunk Zero NFT",
      ],
    },
    {
      title: "Media & events",
      items: [
        "Zcash Media",
        "Zcash Podcasts",
        "Arborist Calls",
        "Zcash Engineering Office Hours",
        "Zcon Archive",
        "Zcon Vozes Archive",
      ],
    },
    {
      title: "Organizations & governance",
      items: ["Zcash Organizations", "Zcash Governance", "ZCAP", "Zcash Ecosystem Security"],
    },
  ],
  Data: [
    {
      title: "Live data",
      items: ["Ecosystem Dashboard", "Chain State Explorer", "Network & Infrastructure", "Value Pools"],
    },
    {
      title: "Protocol",
      items: ["Network Upgrades", "Protocol Parameters", "Zcash Improvement Proposals", "Post-Quantum Security"],
    },
    {
      title: "Cryptography",
      items: ["zk-SNARKs", "Halo", "FROST Threshold Signatures"],
    },
    {
      title: "Addresses & assets",
      items: ["Unified Addresses", "Viewing Keys", "Shielded Assets (ZSAs)"],
    },
  ],
  // Guides are step-by-step walkthroughs only: concepts live in Learn Zcash and
  // reference material in Network, so each page has exactly one home.
  Guides: [
    {
      title: "Run a node",
      items: [
        "Raspberry Pi 4 Full Node",
        "Raspberry pi5 Zebra Lightwalletd Zingo",
        "Hardened Zebrad",
        "Akash Network Zebra",
        "Zakura on Akash",
      ],
    },
    {
      title: "Upgrade & verify",
      items: ["Migration Guide Zcashd To Zebrad Zallet", "Verifying Zcash Releases"],
    },
    {
      title: "Wallets & signing",
      items: [
        "Keystone Zodl (Zashi)",
        "Brave Wallet Guide",
        "Zkool Multisig",
        "Ywallet FROST Demo",
        "Viewing Key Transaction Export",
      ],
    },
    {
      title: "Privacy & networks",
      items: ["Using ZEC Privately", "Nym VPN", "Nym Mixnet Wallet Setup"],
    },
    {
      title: "Payments & creators",
      items: ["Zgo Payment Processor", "BTCPayServer Zcash Plugin", "Free2z Live", "ZKAV Club"],
    },
    {
      title: "DeFi & swaps",
      items: ["Using ZEC in DeFi", "Maya Protocol", "Avalanche RedBridge", "ShapeShift Zcash"],
    },
    {
      title: "Developer tools",
      items: ["Zcash Devtool", "Zingolib and Zaino Tutorial", "Zenith Installation"],
    },
  ],
};
