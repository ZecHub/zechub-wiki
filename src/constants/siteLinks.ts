// data/siteLinks.ts
import {
  Grid3x3,
  BookOpen,
  Wallet,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";

export interface SiteLink {
  label: string;
  href: string;
  target?: string;
  children?: SiteLink[];
}

export interface SiteLinkSection {
  title: string;
  icon: LucideIcon;
  links: SiteLink[];
  subsections?: {
    title: string;
    links: SiteLink[];
  }[];
}

export const SITE_LINKS: SiteLinkSection[] = [
  {
    title: "Pages",
    icon: Grid3x3,
    links: [
      { label: "Homepage", href: "/" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Donation", href: "/donation" },
      { label: "Contribute", href: "/contribute/help-build-zechub" },
      { label: "DAO", href: "/dao" },
      { label: "Developers", href: "/developers" },
      { label: "Brand", href: "/brand/" },
      { label: "Wallets", href: "/wallets" },
      { label: "Sitemap", href: "/sitemap/" },
      {
        label: "Tutorials",
        href: "https://youtube.com/@zechub",
        target: "_blank",
      },
    ],
  },
  {
    title: "Guides",
    icon: BookOpen,
    links: [
      {
        label: "Zgo Payment Processor",
        href: "/guides/zgo-payment-processor",
      },
      { label: "Free2z Live", href: "/guides/free2z-live" },
      { label: "Keystone Zashi", href: "/guides/keystone-zashi" },
      { label: "Maya Protocol", href: "/guides/maya-protocol" },
      { label: "Nym VPN", href: "/guides/nym-vpn" },
      { label: "Using ZEC in DeFi", href: "/guides/using-zec-in-defi" },
      { label: "Using ZEC Privately", href: "/guides/using-zec-privately" },
      {
        label: "Raspberry Pi Zcashd Node",
        href: "/guides/raspberry-pi-4-full-node",
      },
      {
        label: "Raspberry pi5 Zebra Lightwalletd Zingo",
        href: "/guides/raspberry-pi5-zebra-lightwalletd-zingo",
      },
      {
        label: "Raspberry Pi Zebra Node",
        href: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
        target: "_blank",
      },
      { label: "Akash Network", href: "/guides/akash-network" },
      { label: "Avalanche RedBridge", href: "/guides/avalanche-redbridge" },
      { label: "Zkool Multisig", href: "/guides/zkool-multisig" },
      { label: "Ywallet FROST Demo", href: "/guides/ywallet-frost-demo" },
      { label: "Blockchain Explorers", href: "/guides/blockchain-explorers" },
      { label: "Brave Wallet", href: "/guides/brave-wallet-guide" },
      {
        label: "BTCPayServer Plugin",
        href: "/guides/btcpayserver-zcash-plugin",
      },
      {
        label: "Visualizing the Zcash Network",
        href: "/guides/visualizing-the-zcash-network",
      },
      {
        label: "Visualizing Zcash Addresses",
        href: "/guides/visualizing-zcash-addresses",
      },
      { label: "Zcash Devtool", href: "/guides/zcash-devtool" },
      {
        label: "Zcash Improvement Proposals",
        href: "/guides/zcash-improvement-proposals",
      },
      {
        label: "Zingolib and Zaino Tutorial",
        href: "/guides/zingolib-and-zaino-tutorial",
      },
      { label: "Zenith Installation", href: "/guides/zenith-installation" },
      {
        label: "Zero Knowledge vs Decoy Systems",
        href: "/guides/zero-knowledge-vs-decoys",
      },
    ],
  },
  {
    title: "Use Zcash",
    icon: Wallet,
    links: [
      { label: "Buying ZEC", href: "/using-zcash/buying-zec" },
      { label: "Faucets", href: "/using-zcash/faucets" },
      { label: "Wallets", href: "/wallets" },
      { label: "Metamask Snap", href: "/using-zcash/metamask-snap" },
      { label: "Exchanges", href: "/dex" },
      {
        label: "Block Explorers",
        href: "/using-zcash/blockchain-explorers",
      },
      { label: "Shielded Pools", href: "/using-zcash/shielded-pools" },
      {
        label: "Transparent Exchange Addresses",
        href: "/using-zcash/transparent-exchange-addresses",
      },
      { label: "Transactions", href: "/using-zcash/transactions" },
      { label: "Memos", href: "/using-zcash/memos" },
      { label: "Mobile Top Ups", href: "/using-zcash/mobile-top-ups" },
      {
        label: "Payment Request URIs",
        href: "/using-zcash/payment-request-uris",
      },
      { label: "Payment Processors", href: "/payment-processors" },
      { label: "Recovering Funds", href: "/using-zcash/recovering-funds" },
    ],
  },
  {
    title: "Ecosystem",
    icon: Users,
    links: [
      { label: "Arborist Calls", href: "/zcash-community/arborist-calls" },
      { label: "Community Blogs", href: "/zcash-community/community-blogs" },
      {
        label: "Community Links",
        href: "/zcash-community/community-links",
      },
      {
        label: "Community Forum",
        href: "https://forum.zcashcommunity.com/",
        target: "_blank",
      },
      {
        label: "Community Projects",
        href: "/zcash-community/community-projects",
      },
      {
        label: "Zcash Global Ambassadors",
        href: "/zcash-community/zcash-global-ambassadors",
      },
      { label: "Zcash Media", href: "/zcash-community/zcash-media" },
      { label: "ZCAP", href: "/zcash-community/zcap" },
      {
        label: "Zcash Podcasts",
        href: "/zcash-community/zcash-podcasts",
      },
      {
        label: "Zcash Ecosystem Security",
        href: "/zcash-community/zcash-ecosystem-security",
      },
      {
        label: "Cypherpunk Zero NFT",
        href: "/zcash-community/cypherpunk-zero-nft",
      },
      { label: "Zcon Archive", href: "/zcash-community/zcon-archive" },
    ],
  },
  {
    title: "Organizations",
    icon: Building2,
    links: [
      {
        label: "Electric Coin Company",
        href: "/zcash-organizations/electric-coin-company",
      },
      {
        label: "Zcash Foundation",
        href: "/zcash-organizations/zcash-foundation",
      },
      {
        label: "Zcash Community Grants",
        href: "/zcash-organizations/zcash-community-grants",
      },
      {
        label: "Financial Privacy Foundation",
        href: "/zcash-organizations/financial-privacy-foundation",
      },
      {
        label: "Shielded Labs",
        href: "/zcash-organizations/shielded-labs",
      },
      { label: "Zingo Labs", href: "/zcash-organizations/zingo-labs" },
      { label: "Brand", href: "/zcash-organizations/brand" },
      { label: "ZKAV Club", href: "/zcash-organizations/zkav" },
    ],
  },
];
