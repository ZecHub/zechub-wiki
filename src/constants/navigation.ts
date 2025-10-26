import {
  RiTwitterXFill as Twitter,
  RiGithubFill as Github,
  RiYoutubeFill as Youtube,
  RiCommunityLine,
  RiGovernmentLine,
} from "react-icons/ri";
import { BsDiscord as Discord } from "react-icons/bs";
import {
  MdForum as Forum,
  MdOutlineOndemandVideo as AudioVideo,
  MdDeveloperMode,
} from "react-icons/md";
import { SiBrandfolder as BrandIcon, SiHomeassistant } from "react-icons/si";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { IconType } from "react-icons";

export type NavigationItem = {
  name: string;
  label?: string;
  path?: string;
  icon?: IconType;
  newTab?: boolean;
  links?: Array<NavigationItem>;
};

export const navigations: Array<NavigationItem> = [
  {
    name: "Using Zcash",
    label: "Use Zcash",
    links: [
      {
        name: "Buying ZEC",
        path: "/using-zcash/buying-zec",
      },
      {
        name: "Faucets",
        path: "/using-zcash/faucets",
      },
      {
        name: "Wallets",
        path: "/wallets",
      },
      {
        name: "Metamask Snap",
        path: "/using-zcash/metamask-snap",
      },
      {
        name: "Exchanges",
        path: "/dex",
      },
      {
        name: "Blockchain Explorers",
        label: "Block Explorers",
        path: "/using-zcash/blockchain-explorers",
      },
      {
        name: "Shielded Pools",
        path: "/using-zcash/shielded-pools",
      },
      {
        name: "Transparent Exchange Addresses",
        path: "/using-zcash/transparent-exchange-addresses",
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
        name: "Mobile Top Ups",
        path: "/using-zcash/mobile-top-ups",
      },
      {
        name: "Payment Request URIs",
        path: "/using-zcash/payment-request-uris",
      },
      {
        name: "Payment Processors",
        path: "/payment-processors",
      },
      {
        name: "Recovering Funds",
        path: "/using-zcash/recovering-funds",
      },
    ],
  },
  {
    name: "Zcash Community",
    label: "Ecosystem",
    links: [
      {
        name: "Arborist Calls",
        path: "/zcash-community/arborist-calls",
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
    ],
  },
  {
    name: "Zcash Organizations",
    label: "Organizations",
    links: [
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
        path: "https://www.zkav.club",
        icon: AudioVideo,
        newTab: true,
      },
    ],
  },
  {
    name: "Guides",
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
        name: "Keystone Zashi",
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
        name: "Using ZEC in DeFi",
        path: "/guides/using-zec-in-defi",
      },
      {
        name: "Using ZEC Privately",
        path: "/guides/using-zec-privately",
      },
      {
        name: "Raspberry Pi 4 Full Node",
        label: "Raspberry Pi Zcashd Node",
        path: "/guides/raspberry-pi-4-full-node",
      },
      {
        name: "Raspberry pi5 Zebra Lightwalletd Zingo",
        path: "/guides/raspberry-pi5-zebra-lightwalletd-zingo",
      },
      {
        name: "Raspberry pi 4 Zebra Node",
        label: "Raspberry Pi Zebra Node",
        path: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
        newTab: true,
      },
      {
        name: "Akash Network",
        path: "/guides/akash-network",
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
        name: "Blockchain Explorers",
        path: "/guides/blockchain-explorers",
      },
      {
        name: "Brave Wallet",
        path: "/guides/brave-wallet-guide",
      },
      {
        name: "BTCPayServer Plugin",
        path: "/guides/btcpayserver-zcash-plugin",
      },
      {
        name: "Visualizing the Zcash Network",
        path: "/guides/visualizing-the-zcash-network",
      },
      {
        name: "Visualizing Zcash Addresses",
        path: "/guides/visualizing-zcash-addresses",
      },
      {
        name: "Zcash Devtool",
        path: "/guides/zcash-devtool",
      },
      {
        name: "Zcash Improvement Proposals",
        path: "/guides/zcash-improvement-proposals",
      },
      {
        name: "Zingolib and Zaino Tutorial",
        path: "/guides/zingolib-and-zaino-tutorial",
      },
      {
        name: "Zenith Installation",
        path: "/guides/zenith-installation",
      },
      {
        name: "Zero-Knowledge vs Decoys",
        label: "Zero Knowledge vs Decoy Systems",
        path: "/guides/zero-knowledge-vs-decoys",
      },
    ],
  },
  {
    name: "DAO",
    path: "/dao",
    icon: RiCommunityLine,
  },
  {
    name: "Governance",
    path: "/governance-howto",
    icon: RiGovernmentLine,
  },
  {
    name: "Tutorials",
    path: "https://youtube.com/@zechub",
    icon: LiaChalkboardTeacherSolid,
    newTab: true,
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
];

export const socialNav = [
  { name: "Discord", url: "https://discord.gg/zcash", icon: Discord },
  {
    name: "Youtube",
    url: "https://www.youtube.com/channel/UC3-KM00kjCUheRzO5cq3PAA",
    icon: Youtube,
  },
  { name: "Twitter", url: "https://x.com/zechub", icon: Twitter },
  { name: "Github", url: "https://github.com/ZecHub/zechub", icon: Github },
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
