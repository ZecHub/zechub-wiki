import {
  RiTwitterXFill as Twitter,
  RiGithubFill as Github,
  RiYoutubeFill as Youtube,
  RiExchangeFundsLine as Exchange,
  RiLiveFill as Free2zLive,
} from "react-icons/ri";
import {
  BsArrowUpRightCircle as Transaction,
  BsShieldShaded as ShieldedPools,
  BsQrCode as QrCode,
  BsDiscord as Discord,
} from "react-icons/bs";
import {
  FcCurrencyExchange as BuyingZec,
  FcGlobe as Ambassadors,
} from "react-icons/fc";
import { FaMagnifyingGlassChart as BlockchainExplorer } from "react-icons/fa6";
import { FaWallet as Wallet } from "react-icons/fa";
import { LuTrees as Arborist } from "react-icons/lu";
import {
  PiLinkSimpleBold as communityLink,
  PiPresentationChartLight as Archive,
  PiHandFistLight as HandDepositLight,
} from "react-icons/pi";
import {
  IoBuildOutline as commProject,
  IoCloudUploadOutline as CloudUploadOutline,
} from "react-icons/io5";
import { GrGroup as ZCAP } from "react-icons/gr";
import { ImPodcast as Podcast } from "react-icons/im";
import {
  MdRadar as ECC,
  MdOutlinePointOfSale as ZgoPayment,
  MdForum as Forum,
  MdOutlineOndemandVideo as AudioVideo,
  MdPayment,
} from "react-icons/md";
import {
  GiCheckedShield as foundation,
  GiBorderedShield as Shieldedlabs,
} from "react-icons/gi";
import {
  TbHexagonLetterZ as Grants,
  TbTopologyRing as TopologyRing,
  TbSquareLetterF as SquareLetterFFilled,
} from "react-icons/tb";
import {
  SiRaspberrypi as RaspBerry,
  SiZebratechnologies as Zebratechnologies,
} from "react-icons/si";
import { TbCircleLetterZ as Zingolabs } from "react-icons/tb";
import { SiBrandfolder as BrandIcon } from "react-icons/si";

export const navigations = [
  {
    name: "Use Zcash",
    links: [
      {
        subName: "Buying ZEC",
        path: "/using-zcash/buying-zec",
        icon: BuyingZec,
      },
      {
        subName: "Wallets",
        path: "/wallets",
        icon: Wallet,
      },
      {
        subName: "Exchanges",
        path: "/dex",
        icon: Exchange,
      },
      {
        subName: "Block Explorers",
        path: "/using-zcash/blockchain-explorers",
        icon: BlockchainExplorer,
      },
      {
        subName: "Shielded Pools",
        path: "/using-zcash/shielded-pools",
        icon: ShieldedPools,
      },
      {
        subName: "Transparent Exchange Addresses",
        path: "/using-zcash/transparent-exchange-addresses",
        icon: HandDepositLight,
      },
      {
        subName: "Transactions",
        path: "/using-zcash/transactions",
        icon: Transaction,
      },
      {
        subName: "Payment Processors",
        path: "/payment-processors",
        icon: MdPayment,
      },
      {
        subName: "Metamask Snap",
        path: "/using-zcash/metamask-snap",
        icon: Transaction,
      },
      {
        subName: "Custodial Exchanges",
        path: "/using-zcash/custodial-exchanges",
        icon: Transaction,
      },
      {
        subName: "Faucets",
        path: "/using-zcash/faucets",
        icon: Transaction,
      },
      {
        subName: "Memos",
        path: "/using-zcash/memos",
        icon: Transaction,
      },
      {
        subName: "Mobile Top Ups",
        path: "/using-zcash/mobile-top-ups",
        icon: Transaction,
      },
      {
        subName: "Non-Custodial Exchanges",
        path: "/using-zcash/non-custodial-exchanges",
        icon: Transaction,
      },
      {
        subName: "Payment Request URLs",
        path: "/using-zcash/payment-request-urls",
        icon: Transaction,
      },
    ],
  },
  {
    name: "Ecosystem",
    links: [
      {
        subName: "Arborist Calls",
        path: "/zcash-community/arborist-calls",
        icon: Arborist,
      },
      {
        subName: "Community Links",
        path: "/zcash-community/community-links",
        icon: communityLink,
      },
      {
        subName: "Community Forum",
        path: "https://forum.zcashcommunity.com/",
        icon: Forum,
        newTab: true,
      },
      {
        subName: "Community Projects",
        path: "/zcash-community/community-projects",
        icon: commProject,
      },
      {
        subName: "Zcash Global Ambassadors",
        path: "/zcash-community/zcash-global-ambassadors",
        icon: Ambassadors,
      },
      {
        subName: "ZCAP",
        path: "/zcash-community/zcap",
        icon: ZCAP,
      },
      {
        subName: "Zcash Podcasts",
        path: "/zcash-community/zcash-podcasts",
        icon: Podcast,
      },
      {
        subName: "Zcon Archive",
        path: "/zcash-community/zcon-archive",
        icon: Archive,
      },
      {
        subName: "Community Blogs",
        path: "/zcash-community/community-blogs",
        icon: Arborist,
      },
      {
        subName: "Cypherpunk Zero NFT",
        path: "/zcash-community/cypherpunk-zero-nft",
        icon: Arborist,
      },
      {
        subName: "Zcash Ecosystem Security",
        path: "/zcash-community/zcash-ecosystem-security",
        icon: Arborist,
      },
      {
        subName: "Zcash Media",
        path: "/zcash-community/zcash-media",
        icon: Arborist,
      },
    ],
  },
  {
    name: "Organizations",
    links: [
      {
        subName: "Electric Coin Company",
        path: "/zcash-organizations/electric-coin-company",
        icon: ECC,
      },
      {
        subName: "Zcash Foundation",
        path: "/zcash-organizations/zcash-foundation",
        icon: foundation,
      },
      {
        subName: "Zcash Community Grants",
        path: "/zcash-organizations/zcash-community-grants",
        icon: Grants,
      },
      {
        subName: "Financial Privacy Foundation",
        path: "/zcash-organizations/financial-privacy-foundation",
        icon: SquareLetterFFilled,
      },
      {
        subName: "Shielded Labs",
        path: "/zcash-organizations/shielded-labs",
        icon: Shieldedlabs,
      },
      {
        subName: "Zingo Labs",
        path: "/zcash-organizations/zingo-labs",
        icon: Zingolabs,
      },
      {
        subName: "Brand",
        path: "/brand",
        icon: BrandIcon,
      },
      {
        subName: "ZKAV Club",
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
        subName: "Zgo Payment Processor",
        path: "/guides/zgo-payment-processor",
        icon: ZgoPayment,
      },
      {
        subName: "Free2z Livestreaming",
        path: "/guides/free2z-live",
        icon: Free2zLive,
      },
      {
        subName: "Raspberry Pi Zcashd Node",
        path: "/guides/raspberry-pi-4-full-node",
        icon: RaspBerry,
      },
      {
        subName: "Raspberry Pi Zebra Node",
        path: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
        icon: Zebratechnologies,
        newTab: true,
      },
      {
        subName: "Akash Network",
        path: "/guides/akash-network",
        icon: CloudUploadOutline,
      },
      {
        subName: "Visualizing Zcash Addresses",
        path: "/guides/visualizing-zcash-addresses",
        icon: QrCode,
      },
      {
        subName: "Zero Knowledge vs Decoy Systems",
        path: "/guides/zero-knowledge-vs-decoys",
        icon: TopologyRing,
      },
      {
        subName: "Avalanche RedBridge",
        path: "/guides/avalanche-redbridge",
        icon: ZgoPayment,
      },
      {
        subName: "BTCPayServer Zcash Plugin",
        path: "/guides/btcpayserver-zcash-plugin",
        icon: ZgoPayment,
      },
      {
        subName: "Blockchain Explorers",
        path: "/guides/blockchain-explorers",
        icon: ZgoPayment,
      },
      {
        subName: "Brave Wallet Guide",
        path: "/guides/brave-wallet-guide",
        icon: ZgoPayment,
      },
      {
        subName: "Free2z Live",
        path: "/guides/free2z-live",
        icon: ZgoPayment,
      },
      {
        subName: "Keystone Zashi",
        path: "/guides/keystone-zashi",
        icon: ZgoPayment,
      },
      {
        subName: "Maya Protocol",
        path: "/guides/maya-protocol",
        icon: ZgoPayment,
      },
      {
        subName: "Nym VPN",
        path: "/guides/nym-vpn",
        icon: ZgoPayment,
      },
      {
        subName: "Raspberry PL4 Full Node",
        path: "/guides/raspberry-pl4-full-node",
        icon: ZgoPayment,
      },
      {
        subName: "Raspberry pi5 Zebra Lightwalled Zingo",
        path: "/guides/raspberry-pi5-zebra-lightwalled-zingo",
        icon: ZgoPayment,
      },
      {
        subName: "Using ZEC Privately",
        path: "/guides/using-zec-privately",
        icon: ZgoPayment,
      },
      {
        subName: "Using ZEC in DeFi",
        path: "/guides/using-zec-in-defi",
        icon: ZgoPayment,
      },
      {
        subName: "Visualizing the Zcash Network",
        path: "/guides/visualizing-the-zcash-network",
        icon: ZgoPayment,
      },
      {
        subName: "Ywallet FROST Demo",
        path: "/guides/ywallet-frost-demo",
        icon: ZgoPayment,
      },
      {
        subName: "Zcash Devtool",
        path: "/guides/zcash-devtool",
        icon: ZgoPayment,
      },
      {
        subName: "Zcash Improvement Proposals",
        path: "/guides/zcash-improvement-proposals",
        icon: ZgoPayment,
      },
      {
        subName: "Zenith Installation",
        path: "/guides/zenith-installation",
        icon: ZgoPayment,
      },
    ],
  },
  {
    name: "DAO",
    path: "/dao",
    icon: "",
  },
  {
    name: "Tutorials",
    path: "https://youtube.com/@zechub",
    icon: "",
    newTab: true,
  },
  {
    name: "Developers",
    path: "/developers",
    icon: "",
  },
  {
    name: "Contribute",
    path: "/contribute/help-build-zechub",
    icon: "",
  },
];

export const socialNav = [
  {
    name: "Discord",
    url: "https://discord.gg/zcash",
    icon: Discord,
  },
  {
    name: "Youtube",
    url: "https://www.youtube.com/channel/UC3-KM00kjCUheRzO5cq3PAA",
    icon: Youtube,
  },
  {
    name: "Twitter",
    url: "https://x.com/zechub",
    icon: Twitter,
  },
  {
    name: "Github",
    url: "https://github.com/ZecHub/zechub",
    icon: Github,
  },
];

export const socialMedia = [
  {
    name: "Youtube",
    link: "https://youtube.com/@zechub",
  },
  {
    name: "Newsletter",
    link: "https://zechub.substack.com/",
  },
  {
    name: "Podcast",
    link: "https://www.youtube.com/watch?v=ILdMTGtVOD4&list=PL6_epn0lASLHlNCMtUErX8UfaJK6N9K5O",
  },
  {
    name: "Extras",
    link: "https://extras.zechub.xyz/",
  },
  {
    name: "DAO",
    link: "https://vote.zechub.xyz/",
  },
  {
    name: "Store",
    link: "https://zechub.store/",
  },
];
