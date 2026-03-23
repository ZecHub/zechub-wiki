'use client';

import { IconType } from "react-icons";
import {
  BiCheckShield as CheckShield,
  BiLock as Lock,
  BiLogoGraphql as LogoGraph,
} from "react-icons/bi";
import {
  BsFillArrowUpRightCircleFill as ArrowUp,
  BsBrowserFirefox as Browserfirefox,
  BsNewspaper as Newspaper,
  BsPlay as Play,
  BsQrCode as QrCode,
  BsShieldShaded as ShieldShaded,
  BsGpuCard as Mining,
} from "react-icons/bs";
import { CiStreamOn as StreamOn } from "react-icons/ci";
import {
  FaEthereum as Ethereum,
  FaQuestion,
  FaSyncAlt,
  FaFaucet as Faucet,
  FaLifeRing as LifeRing,
  FaListAlt as ListAlt,
  FaWallet as Wallet,
  FaFileInvoiceDollar as Cbdc,
} from "react-icons/fa";
import {
  FaLaptopCode,
  FaMagnifyingGlassChart as MagnifyingGlassChart,
} from "react-icons/fa6";
import {
  FcCurrencyExchange as CurrencyExchange,
  FcGallery,
  FcProcess,
  FcGlobe as Globe,
  FcCollect as Collect,
  FcWorkflow as ZkAssets,
  FcServices as Infra,
  FcFaq as Faq,
  FcLibrary as LibraryC,
  FcShop as Pay,
} from "react-icons/fc";
import {
  GiEgyptianSphinx as EgyptianSphinx,
  GiBorderedShield as BordererShield,
  GiCableStayedBridge as CableStayedBridge,
  GiCheckedShield as CheckedShield,
  GiMeshBall,
  GiSoapExperiment,
  GiMayanPyramid as MayanPyramid,
  GiSpellBook as SpellBook,
  GiMagnifyingGlass as Magnify,
  GiLion as Brave,
  GiTrade as Swap,
  GiFox as ShapeShift,
} from "react-icons/gi";
import { GoSync as Go } from "react-icons/go";
import {
  GrBlog as Blog,
  GrCircleInformation as CircleInfo,
  GrDocumentZip,
  GrGroup as Group,
  GrNodes as Nodes,
  GrNetwork as Network,
  GrResources as Resources,
  GrStakeholder as Stakeholder,
} from "react-icons/gr";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import {
  ImParagraphLeft as Paragraph,
  ImPodcast as Podcast,
  ImDroplet as Shade,
} from "react-icons/im";
import { IoIosMicrophone as IosMicrophone } from "react-icons/io";
import {
  IoBuildOutline as BuildOutline,
  IoCloudUploadOutline,
  IoConstructOutline,
} from "react-icons/io5";
import {
  LiaHorseHeadSolid,
  LiaSignatureSolid,
  LiaLinkSolid as LinkSolid,
  LiaServerSolid as ServerSolid,
  LiaRingSolid as Arti,
} from "react-icons/lia";
import { LuFileKey as FileKey, LuTrees as Trees, LuLeaf as PepperSync } from "react-icons/lu";
import {
  MdOutlineLiveHelp as LiveHelp,
  MdFoundation,
  MdOutlinePayments,
  MdOutlinePodcasts,
  MdVpnLock,
  MdOutlineEnhancedEncryption as OutlineEnchanceEncryption,
  MdOutlinePointOfSale as PointOfSale,
  MdOutlinePrivacyTip as PrivacyTip,
  MdRadar as Radar,
  MdSettings as Settings,
  MdTipsAndUpdates as TipsAndUpdates,
  MdOutlineStyle as Style,
} from "react-icons/md";
import {
  PiCircuitryLight as Circuitry,
  PiComputerTower as ComputerTower,
  PiLinkSimpleBold as LinkSimpleBold,
  PiListMagnifyingGlassFill as ListMagnifyingGlassFill,
  PiNumberCircleZeroThin as NumberCircle,
  PiPresentationChartLight as PresentationChar,
  PiShootingStarThin as ShootingStar,
  PiSnowflakeThin as SnowFlake,
  PiSpotifyLogo as Spotify,
  PiTreeBold  as Tree,
  PiStudentFill as Mfz,
} from "react-icons/pi";
import {
  RiExchangeFundsFill as ExchangeFunds,
  RiLiveFill as Live,
  RiMailSendFill as MailSend,
  RiMessengerLine as MessengerLine,
  RiNftFill as NftFill,
  RiArticleLine,
  RiBitCoinLine,
  RiExchangeFundsLine,
  RiFunctionLine,
  RiInstallLine,
  RiSecurePaymentLine,
  RiSecurePaymentLine as SecurePayment,
  RiGuideFill as Guide,
} from "react-icons/ri";
import {
  SiApplepodcasts as ApplePodcasts,
  SiXdadevelopers as Dadeveloper,
  SiLetsencrypt as Letsencrypt,
  SiOpenvpn as Openvpn,
  SiRaspberrypi as RaspBerry,
  SiBrave,
  SiKeystone,
  SiTorbrowser as TorBrowser,
  SiWikipedia as Wikipedia,
  SiYoutube as Youtube,
  SiZcash as Zcash,
  SiZebratechnologies as Zebratechnologies,
} from "react-icons/si";
import { SlGraph as Graph } from "react-icons/sl";
import {
  TbBinaryTree2 as BinaryTree,
  TbCurrencyDollarZimbabwean as DollarZimbabwean,
  Tb2Fa as Fa2,
  TbHexagonLetterN as HexagonLetterN,
  TbHexagonLetterZ as HexagonLetterZ,
  TbCircleLetterZ,
  TbDeviceMobileShare,
  TbSquareRoundedLetterY,
  TbTopologyRing as TopologyRing,
} from "react-icons/tb";
import { TfiServer as Tfi } from "react-icons/tfi";
import { AiOutlineCloudServer as Akash } from "react-icons/ai";

type AppIcon = IconType | string;   // supports both React icons AND custom PNG strings

interface IconsFor {
  [key: string]: {
    [key: string]: AppIcon;
  };
}

const iconsForMenu: IconsFor = {
  "Start Here": {
    "What is ZEC and Zcash": "what-is-zcash.png",
    "New User Guide": ShootingStar,
    "ZEC Use Cases": SecurePayment,
    "Zcash Resources": Resources,
    "Developer Resources": Dadeveloper,
    "Development Fund": BinaryTree,
    "Network Upgrades": Network,
    "Zcash Monetary Policy": Graph,
    "What is ZecHub": CircleInfo,
    "Using This Wiki": Wikipedia,
  },
  Tutorials: {
    "Full Node Tutorials": Youtube,
    "z2z Tutorial": Youtube,
    "Wallet Tutorials": Youtube,
    "Buy ZEC in Gemini": Youtube,
    "Nighthawk Wallet": Youtube,
    "Shielding ZEC": Youtube,
    "Spedn Demo": Youtube,
  },
  "Using Zcash": {
    "Blockchain Explorers": MagnifyingGlassChart,
    Wallets: "pick-a-wallet.png",
    "Buying ZEC": CurrencyExchange,
    "Metamask Snap": RiFunctionLine,
    Transactions: ArrowUp,
    "Transparent Exchange Addresses": RiSecurePaymentLine,
    "Mobile Top Ups": TbDeviceMobileShare,
    "Payment Processors": FcProcess,
    Memos: MailSend,
    "Shielded Pools": ShieldShaded,
    Faucets: Faucet,
    "Non-Custodial Exchanges": ExchangeFunds,
    "Payment Request URIs": MdOutlinePayments,
    "Recovering Funds": LifeRing,
    "Custodial Exchanges": ListAlt,
    Exchanges: RiExchangeFundsLine,
    "Zcash Wallet Syncing": FaSyncAlt,
    "Zcash Mining Guide": Mining,
    "Solswap": Swap,
    "Encifher Swaps": Swap,
  },
  Guides: {
    "Using ZEC Privately": PrivacyTip,
    "Keystone Zashi": SiKeystone,
    "Visualizing Zcash Addresses": QrCode,
    "Blockchain Explorers": ListMagnifyingGlassFill,
    "Maya Protocol": MayanPyramid,
    "Avalanche RedBridge": CableStayedBridge,
    "Akash Network Zcashd": Akash,
    "Akash Network Zebra": IoCloudUploadOutline,
    "BTCPayServer Zcash Plugin": Pay,
    "Full Nodes": ServerSolid,
    "Nym VPN": MdVpnLock,
    "Raspberry Pi 4 Full Node": RaspBerry,
    "Raspberry pi5 Zebra Lightwalletd Zingo": RaspBerry,
    "Brave Wallet": SiBrave,
    "Raspberry pi 4 Zebra Node": Zebratechnologies,
    "Ywallet FROST Demo": TbSquareRoundedLetterY,
    "Zcash Devtool": TbCircleLetterZ,
    "Zenith Installation": RiInstallLine,
    "Zingolib and Zaino Tutorial": FaLaptopCode,
    "Using ZEC in DeFi": Ethereum,
    "Free2z Live": Live,
    "Free2Z Livestreaming": StreamOn,
    "Zgo Payment Processor": PointOfSale,
    "Zero-Knowledge vs Decoys": TopologyRing,
    "Visualizing the Zcash Network": LogoGraph,
    "Zcash Improvement Proposals": GrDocumentZip,
    "Zkool Multisig": LiaSignatureSolid,
    "My First Zcash Workbook": Mfz,
    "Migration Guide Zcashd To Zebrad Zallet": Guide,
    "Brave Wallet Guide": Brave,
    "ShapeShift Zcash": ShapeShift,
  },
  "Zcash Tech": {
    "Crosslink Protocol": Stakeholder,
    "zk SNARKS": Circuitry,
    Halo: NumberCircle,
    FROST: SnowFlake,
    "Full Nodes": Nodes,
    Zaino: Tfi,
    "Zcash Wallet Syncing": Go,
    "Zebra Full Node": Zebratechnologies,
    "Zk SNARKS": Letsencrypt,
    "Viewing Keys": FileKey,
    "Zcash Shielded Assets": DollarZimbabwean,
    "Lightwallet Nodes": ComputerTower,
    "Pepper Sync": PepperSync,
  },
  "Zcash Organizations": {
    "Electric Coin Company": Radar,
    "ZODL": EgyptianSphinx,
    "Zcash Foundation": CheckedShield,
    "Zcash Community Grants": HexagonLetterZ,
    "Shielded Labs": BordererShield,
    "Financial Privacy Foundation": MdFoundation,
    "Zingo Labs": GiSoapExperiment,
  },
  "Zcash Community": {
    "Community Links": LinkSimpleBold,
    "Community Blogs": Blog,
    "Zcash Global Ambassadors": Globe,
    ZCAP: Group,
    "Community Projects": BuildOutline,
    "Arborist Calls": Trees,
    "Cypherpunk Zero NFT": NftFill,
    "Zcash Ecosystem Security": Lock,
    "Zcash Media": Play,
    "Zcash Podcasts": MdOutlinePodcasts,
    "Zcon Archive": PresentationChar,
  },
  "ZFAV Club": {
    "AV Club Background": LiaHorseHeadSolid,
    "Guides for Creators": Resources,
    "Youtube Channel": Youtube,
  },
  "Zcash Social Media": {
    Podcasts: IosMicrophone,
    "Social Media Links": LinkSolid,
    "pgp for crypto podcast": Podcast,
    "The Zcash Podcast": Zcash,
    "Shielded Transaction Podcast": CheckShield,
    "The ZK Podcast": Spotify,
    "The z2z Podcast": StreamOn,
    "Zcast Podcast": ApplePodcasts,
    "Zero to Zero-knowledge": SpellBook,
    "zl;dr": TipsAndUpdates,
  },
  "Privacy Tools": {
    "2FA Hardware Devices": Fa2,
    "Arti Tor": Arti,
    GrapheneOS: Settings,
    "Namada Protocol": "/Logo/namada.png",
    "PGP Encryption": OutlineEnchanceEncryption,
    "Penumbra": "/Logo/um.png",
    "Secure Messengers": MessengerLine,
    "Shade Protocol": Shade,
    "Tor and I2P": TorBrowser,
    "VPN and DVPN": Openvpn,
    "Web Browsers": Browserfirefox,
  },
  Research: {
    "Cbdc": Cbdc,
    "Dash Zcash Orchard Integration": Tree,
    "NamadaBestPractices": "/Logo/namada.png",
    "Social Media Data Collection": Collect,
    "Track Early Onchain And Social Signals for Zcash": Magnify,
    "ZK Shielded Asset Platforms": ZkAssets,
  },
  "Glossary & FAQ's": {
    "Zcash Library": LibraryC,
    FAQ: Faq,
    Gallery: FcGallery,
  },
  Contribute: {
    "Community Infrastructure": Infra,
    "Help build ZecHub": IoConstructOutline,
    "ZecHub DAO": GiMeshBall,
    "Contributing Guide": LiveHelp,
    "ZecWeekly Newsletter": Newspaper,
    "Style Guide": Style,
  },
};

export const matchIcons = (root: string, file: string) => {
  for (const key in iconsForMenu) {
    if (key === root) {
      for (const innerKey in iconsForMenu[key]) {
        if (innerKey === file) {
          return iconsForMenu[key][innerKey];
        }
      }
    }
  }
};
