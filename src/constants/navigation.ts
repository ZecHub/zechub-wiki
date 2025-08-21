import {
  RiTwitterXFill as Twitter,
  RiGithubFill as Github,
  RiYoutubeFill as Youtube,
} from "react-icons/ri";
import {
  BsDiscord as Discord,
} from "react-icons/bs";
import {
  MdForum as Forum,
  MdOutlineOndemandVideo as AudioVideo,
} from "react-icons/md";
import { SiBrandfolder as BrandIcon } from "react-icons/si";
import { IconType } from "react-icons";

export type NavigationItem = {
  label: string;
  name?: string;
  path?: string;
  icon?: IconType;
  newTab?: boolean;
  links?: Array<NavigationItem>;
}

export const navigations: Array<NavigationItem> = [
  {
    label: "Use Zcash",
    name: "Using Zcash",
    links: [
      {
        label: "Buying ZEC",
        path: "/using-zcash/buying-zec",
      },
      {
        label: "Faucets",
        path: "/using-zcash/faucets",
      },
      {
        label: "Wallets",
        path: "/wallets",
      },
      {
        label: "Metamask Snap",
        path: "/using-zcash/metamask-snap",
      },
      {
        label: "Exchanges",
        path: "/dex",
      },
      {
        label: "Block Explorers",
        name: "Blockchain Explorers",
        path: "/using-zcash/blockchain-explorers",
      },
      {
        label: "Shielded Pools",
        path: "/using-zcash/shielded-pools",
      },
      {
        label: "Transparent Exchange Addresses",
        path: "/using-zcash/transparent-exchange-addresses",
      },
      {
        label: "Transactions",
        path: "/using-zcash/transactions",
      },
      {
        label: "Memos",
        path: "/using-zcash/memos",
      },
      {
        label: "Mobile Top Ups",
        path: "/using-zcash/mobile-top-ups",
      },
      {
        label: "Payment Request URIs",
        path: "/using-zcash/payment-request-uris",
      },
      {
        label: "Payment Processors",
        path: "/payment-processors",
      },
      {
        label: "Recovering Funds",
        path: "/using-zcash/recovering-funds",
      },
    ],
  },
  {
    label: "Ecosystem",
    name: "Zcash Community",
    links: [
      {
        label: "Arborist Calls",
        path: "/zcash-community/arborist-calls",
      },
      {
        label: "Community Blogs",
        path: "/zcash-community/community-blogs",
      },
      {
        label: "Community Links",
        path: "/zcash-community/community-links",
      },
      {
        label: "Community Forum",
        path: "https://forum.zcashcommunity.com/",
        icon: Forum,
        newTab: true,
      },
      {
        label: "Community Projects",
        path: "/zcash-community/community-projects",
      },
      {
        label: "Zcash Global Ambassadors",
        path: "/zcash-community/zcash-global-ambassadors",
      },
      {
        label: "Zcash Media",
        path: "/zcash-community/zcash-media",
      },
      {
        label: "ZCAP",
        path: "/zcash-community/zcap",
      },
      {
        label: "Zcash Podcasts",
        path: "/zcash-community/zcash-podcasts",
      },
      {
        label: "Zcash Ecosystem Security",
        path: "/zcash-community/zcash-ecosystem-security",
      },
      {
        label: "Cypherpunk Zero NFT",
        path: "/zcash-community/cypherpunk-zero-nft",
      },
      {
        label: "Zcon Archive",
        path: "/zcash-community/zcon-archive",
      },
    ],
  },
  {
    label: "Organizations",
    name: "Zcash Organizations",
    links: [
      {
        label: "Electric Coin Company",
        path: "/zcash-organizations/electric-coin-company",
      },
      {
        label: "Zcash Foundation",
        path: "/zcash-organizations/zcash-foundation",
      },
      {
        label: "Zcash Community Grants",
        path: "/zcash-organizations/zcash-community-grants",
      },
      {
        label: "Financial Privacy Foundation",
        path: "/zcash-organizations/financial-privacy-foundation",
      },
      {
        label: "Shielded Labs",
        path: "/zcash-organizations/shielded-labs",
      },
      {
        label: "Zingo Labs",
        path: "/zcash-organizations/zingo-labs",
      },
      {
        label: "Brand",
        path: "/brand",
        icon: BrandIcon,
      },
      {
        label: "ZKAV Club",
        path: "https://www.zkav.club",
        icon: AudioVideo,
        newTab: true,
      },
    ],
  },
  {
    label: "Guides",
    links: [
      {
        label: "Zgo Payment Processor",
        path: "/guides/zgo-payment-processor",
      },
      {
        label: "Free2z Live",
        path: "/guides/free2z-live",
      },
      {
        label: "Keystone Zashi",
        path: "/guides/keystone-zashi",
      },
      {
        label: "Maya Protocol",
        path: "/guides/maya-protocol",
      },
      {
        label: "Nym VPN",
        path: "/guides/nym-vpn",
      },
      {
        label: "Using ZEC in DeFi",
        path: "/guides/using-zec-in-defi",
      },
      {
        label: "Using ZEC Privately",
        path: "/guides/using-zec-privately",
      },
      {
        label: "Raspberry Pi Zcashd Node",
        name: "Raspberry Pi 4 Full Node",
        path: "/guides/raspberry-pi-4-full-node",
      },
      {
        label: "Raspberry pi5 Zebra Lightwalletd Zingo",
        path: "/guides/raspberry-pi5-zebra-lightwalletd-zingo",
      },
      {
        label: "Raspberry Pi Zebra Node",
        name: "Raspberry pi 4 Zebra Node",
        path: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
        newTab: true,
      },
      {
        label: "Akash Network",
        path: "/guides/akash-network",
      },
      {
        label: "Avalanche RedBridge",
        path: "/guides/avalanche-redbridge",
      },
      {
        label: "Zkool Multisig",
        path: "/guides/zkool-multisig",
      },
      {
        label: "Ywallet FROST Demo",
        path: "/guides/ywallet-frost-demo",
      },
      {
        label: "Blockchain Explorers",
        path: "/guides/blockchain-explorers",
      },
      {
        label: "Brave Wallet",
        path: "/guides/brave-wallet-guide",
      },
      {
        label: "BTCPayServer Plugin",
        path: "/guides/btcpayserver-zcash-plugin",
      },
      {
        label: "Visualizing the Zcash Network",
        path: "/guides/visualizing-the-zcash-network",
      },
      {
        label: "Visualizing Zcash Addresses",
        path: "/guides/visualizing-zcash-addresses",
      },
      {
        label: "Zcash Devtool",
        path: "/guides/zcash-devtool",
      },
      {
        label: "Zcash Improvement Proposals",
        path: "/guides/zcash-improvement-proposals",
      },
      {
        label: "Zingolib and Zaino Tutorial",
        path: "/guides/zingolib-and-zaino-tutorial",
      },
      {
        label: "Zenith Installation",
        path: "/guides/zenith-installation",
      },
      {
        label: "Zero Knowledge vs Decoy Systems",
        name: "Zero-Knowledge vs Decoys",
        path: "/guides/zero-knowledge-vs-decoys",
      },
    ],
  },
  {
    label: "DAO",
    path: "/dao",
  },
  {
    label: "Tutorials",
    path: "https://youtube.com/@zechub",
    newTab: true,
  },
  {
    label: "Developers",
    path: "/developers",
  },
  {
    label: "Contribute",
    path: "/contribute/help-build-zechub",
  },
];

export const socialNav = [
  {
    label: "Discord",
    url: "https://discord.gg/zcash",
    icon: Discord,
  },
  {
    label: "Youtube",
    url: "https://www.youtube.com/channel/UC3-KM00kjCUheRzO5cq3PAA",
    icon: Youtube,
  },
  {
    label: "Twitter",
    url: "https://x.com/zechub",
    icon: Twitter,
  },
  {
    label: "Github",
    url: "https://github.com/ZecHub/zechub",
    icon: Github,
  },
];

export const socialMedia = [
  {
    label: "Youtube",
    link: "https://youtube.com/@zechub",
  },
  {
    label: "Newsletter",
    link: "https://zechub.substack.com/",
  },
  {
    label: "Podcast",
    link: "https://www.youtube.com/watch?v=ILdMTGtVOD4&list=PL6_epn0lASLHlNCMtUErX8UfaJK6N9K5O",
  },
  {
    label: "Extras",
    link: "https://extras.zechub.xyz/",
  },
  {
    label: "DAO",
    link: "https://vote.zechub.xyz/",
  },
  {
    label: "Store",
    link: "https://zechub.store/",
  },
];
