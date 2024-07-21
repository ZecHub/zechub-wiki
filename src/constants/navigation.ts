import { 
  BsDiscord as Discord,
  BsCurrencyExchange as BuyingZec,
  BsShieldShaded as ShieldedPools,
  BsArrowUpCircle as Transaction,
 } from "react-icons/bs";
import {
  RiTwitterXFill as Twitter,
  RiGithubFill as Github,
  RiYoutubeFill as Youtube,
  RiExchangeFundsLine as Exchange,
} from "react-icons/ri";
import { FaMagnifyingGlassChart as BlockchainExplorer } from "react-icons/fa6";
import { FaWallet as Wallet } from "react-icons/fa6";



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
        path: "/using-zcash/non-custodial-exchanges",
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
        subName: "Transactions",
        path: "/using-zcash/transactions",
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
      },
      {
        subName: "Community Links",
        path: "/zcash-community/community-links",
      },
      {
        subName: "Community Forum",
        path: "https://forum.zcashcommunity.com/",
      },
      {
        subName: "Community Projects",
        path: "/zcash-community/community-projects",
      },
      {
        subName: "Zcash Global Ambassadors",
        path: "/zcash-community/zcash-global-ambassadors",
      },
      {
        subName: "ZCAP",
        path: "/zcash-community/zcap",
      },
      {
        subName: "Zcash Podcasts",
        path: "/zcash-community/zcash-podcasts",
      },
      {
        subName: "Zcon Archive",
        path: "/zcash-community/zcap",
      },
    ],
  },
  {
    name: "Organizations",
    links: [
      {
        subName: "Electric Coin Company",
        path: "/zcash-organizations/electric-coin-company",
      },
      {
        subName: "Zcash Foundation",
        path: "/zcash-organizations/zcash-foundation",
      },
      {
        subName: "Zcash Community Grants",
        path: "/zcash-organizations/zcash-community-grants",
      },
      {
        subName: "Shielded Labs",
        path: "/zcash-organizations/shielded-labs",
      },
    ],
  },
  {
    name: "Guides",
    links: [
      {
        subName: "Zgo Payment Processor",
        path: "/guides/zgo-payment-processor",
      },
      {
        subName: "Free2z Livestreaming",
        path: "/guides/free2z-live",
      },
      {
        subName: "Raspberry Pi Zcashd Node",
        path: "/guides/raspberry-pi-4-full-node",
      },
      {
        subName: "Raspberry Pi Zebra Node",
        path: "https://free2z.com/ZecHub/zpage/zcash-101-zebra-lightwalletd-sync-journal-on-raspberry-pi-5",
      },
      {
        subName: "Visualizing Zcash Addresses",
        path: "/guides/visualizing-zcash-addresses",
      },
      {
        subName: "Zero Knowledge vs Decoy Systems",
        path: "/guides/zero-knowledge-vs-decoys",
      },
    ],
  },
  {
    name: "Tutorials",
    path: "https://zechub.wiki/zechub-tutorials",
  },
  {
    name: "Contribute",
    path: "https://zechub.wiki/contribute/help-build-zechub",
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
    url: "https://twitter.com/zechub",
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
