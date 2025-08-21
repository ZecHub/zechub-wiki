import {
  RiTwitterXFill as Twitter,
  RiGithubFill as Github,
  RiYoutubeFill as Youtube,
  RiLiveFill as Free2zLive,
  RiArtboard2Line as ZeroNFT,
} from "react-icons/ri";
import {
  BsQrCode as QrCode,
  BsDiscord as Discord,
} from "react-icons/bs";
import {
  FcGlobe as Ambassadors,
} from "react-icons/fc";
import { LuTrees as Arborist } from "react-icons/lu";
import {
  PiLinkSimpleBold as CommunityLink,
  PiPresentationChartLight as Archive,
  PiShieldCheck as EcoSecurity,
} from "react-icons/pi";
import {
  IoBuildOutline as CommunityProject,
  IoCloudUploadOutline as CloudUploadOutline,
} from "react-icons/io5";
import { GrGroup as ZCAP, GrBlog as CommunityBlog } from "react-icons/gr";
import { ImPodcast as Podcast } from "react-icons/im";
import {
  MdOutlinePointOfSale as ZgoPayment,
  MdForum as Forum,
  MdOutlineOndemandVideo as AudioVideo,
} from "react-icons/md";
import {
  TbTopologyRing as TopologyRing,
} from "react-icons/tb";
import {
  SiRaspberrypi as RaspBerry,
  SiZebratechnologies as Zebratechnologies,
} from "react-icons/si";
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
        icon: Arborist,
      },
      {
        label: "Community Blogs",
        path: "/zcash-community/community-blogs",
        icon: CommunityBlog,
      },
      {
        label: "Community Links",
        path: "/zcash-community/community-links",
        icon: CommunityLink,
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
        icon: CommunityProject,
      },
      {
        label: "Zcash Global Ambassadors",
        path: "/zcash-community/zcash-global-ambassadors",
        icon: Ambassadors,
      },
      {
        label: "Zcash Media",
        path: "/zcash-community/zcash-media",
        icon: CommunityProject,
      },
      {
        label: "ZCAP",
        path: "/zcash-community/zcap",
        icon: ZCAP,
      },
      {
        label: "Zcash Podcasts",
        path: "/zcash-community/zcash-podcasts",
        icon: Podcast,
      },
      {
        label: "Zcash Ecosystem Security",
        path: "/zcash-community/zcash-ecosystem-security",
        icon: EcoSecurity,
      },
      {
        label: "Cypherpunk Zero NFT",
        path: "/zcash-community/cypherpunk-zero-nft",
        icon: ZeroNFT,
      },
      {
        label: "Zcon Archive",
        path: "/zcash-community/zcon-archive",
        icon: Archive,
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
        icon: ZgoPayment,
      },
      {
        label: "Free2z Livestreaming",
        path: "/guides/free2z-live",
        icon: Free2zLive,
      },
      {
        label: "Raspberry Pi Zcashd Node",
        path: "/guides/raspberry-pi-4-full-node",
        icon: RaspBerry,
      },
      {
        label: "Raspberry Pi Zebra Node",
        path: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
        icon: Zebratechnologies,
        newTab: true,
      },
      {
        label: "Akash Network",
        path: "/guides/akash-network",
        icon: CloudUploadOutline,
      },
      {
        label: "Visualizing Zcash Addresses",
        path: "/guides/visualizing-zcash-addresses",
        icon: QrCode,
      },
      {
        label: "Zero Knowledge vs Decoy Systems",
        path: "/guides/zero-knowledge-vs-decoys",
        icon: TopologyRing,
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
