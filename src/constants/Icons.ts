import {SiZcash as Zcash, SiWikipedia as Wikipedia, SiYoutube as Youtube, SiXdadevelopers as Dadeveloper, SiRaspberrypi as RaspBerry, SiApplepodcasts as ApplePodcasts, SiTorbrowser as TorBrowser, SiOpenvpn as Openvpn, SiZebratechnologies as Zebratechnologies }  from 'react-icons/si'
import {PiShootingStarThin as ShootingStar, PiCircuitryLight as Circuitry, PiNumberCircleZeroThin as NumberCircle, PiSnowflakeThin as SnowFlake, PiLinkSimpleBold as LinkSimpleBold, PiPresentationChartLight as PresentationChar, PiSpotifyLogo as Spotify, PiComputerTower as ComputerTower } from 'react-icons/pi'
import {RiSecurePaymentLine as SecurePayment, RiMailSendFill as MailSend, RiExchangeFundsFill as ExchangeFunds, RiLiveFill as Live, RiNftFill as NftFill, RiMessengerLine as MessengerLine, RiArticleLine } from 'react-icons/ri'
import {GrResources as Resources, GrCircleInformation as CircleInfo, GrGroup as Group } from 'react-icons/gr'
import {TbBinaryTree2 as BinaryTree, TbTopologyRing as TopologyRing, TbCurrencyDollarZimbabwean as DollarZimbabwean,  Tb2Fa as Fa2, TbHexagonLetterN as HexagonLetterN, TbHexagonLetterZ as HexagonLetterZ} from 'react-icons/tb'
import {SlGraph as Graph } from 'react-icons/sl'
import {FaWallet as Wallet, FaFaucet as Faucet, FaListAlt as ListAlt, FaEthereum as Ethereum, FaQuestion, FaSyncAlt} from 'react-icons/fa'
import {FcCurrencyExchange as CurrencyExchange, FcGallery, FcGlobe as Globe } from 'react-icons/fc'
import {BsFillArrowUpRightCircleFill as ArrowUp, BsShieldShaded as ShieldShaded, BsQrCode as QrCode, BsPlay as Play, BsNewspaper as Newspaper, BsBrowserFirefox as Browserfirefox } from 'react-icons/bs'
import {MdOutlinePrivacyTip as PrivacyTip, MdOutlinePointOfSale as PointOfSale, MdRadar as Radar, MdTipsAndUpdates as TipsAndUpdates, MdSettings as Settings, MdOutlineEnhancedEncryption as OutlineEnchanceEncryption, MdOutlineLiveHelp as LiveHelp } from 'react-icons/md'
import {LiaServerSolid as ServerSolid, LiaLinkSolid as LinkSolid } from 'react-icons/lia'
import {BiLogoGraphql as LogoGraph, BiLock as Lock, BiCheckShield as CheckShield } from 'react-icons/bi'
import {ImParagraphLeft as Paragraph, ImPodcast as Podcast } from 'react-icons/im'
import {GiCheckedShield as CheckedShield, GiBorderedShield as BordererShield, GiSpellBook as SpellBook, GiMeshBall} from 'react-icons/gi'
import {LuFileKey as FileKey,LuTrees as Trees } from 'react-icons/lu'
import {IoBuildOutline as BuildOutline, IoConstructOutline } from 'react-icons/io5'
import {IoIosMicrophone as IosMicrophone} from 'react-icons/io'
import { GrBlog as Blog } from "react-icons/gr"
import { FaMagnifyingGlassChart as MagnifyingGlassChart } from "react-icons/fa6"
import {CiStreamOn as StreamOn} from 'react-icons/ci' 
import {HiOutlineBuildingLibrary} from 'react-icons/hi2'
import { LiaHorseHeadSolid } from "react-icons/lia";


interface IconsFor {
    [key: string]: {
      [key: string]: string;
    };
  };

const iconsForMenu: IconsFor = {
    'Start Here': {
        'What is ZEC and Zcash': Zcash,
        'New User Guide': ShootingStar,
        'ZEC Use Cases': SecurePayment,
        'Zcash Resources': Resources,
        'Developer Resources': Dadeveloper,
        'Development Fund': BinaryTree,
        'Zcash Monetary Policy': Graph,
        'What is ZecHub': CircleInfo,
        'Using This Wiki': Wikipedia
    },
    'Tutorials': {
        'Full Node Tutorials': Youtube,
        'z2z Tutorial': Youtube,
        'Wallet Tutorials': Youtube,
        'Buy ZEC in Gemini': Youtube,
        'Nighthawk Wallet': Youtube,
        'Shielding ZEC': Youtube,
        'Spedn Demo': Youtube
    },
    'Using Zcash': {
        'Blockchain Explorers': MagnifyingGlassChart,
        'Wallets': Wallet,
        'Buying ZEC': CurrencyExchange,
        'Transactions': ArrowUp,
        'Memos': MailSend,
        'Shielded Pools': ShieldShaded,
        'Faucets': Faucet,
        'Non-Custodial Exchanges': ExchangeFunds,
        'DEX List': ListAlt,
        'Zcash Wallet Syncing': FaSyncAlt
    },
    'Guides': {
        'Using ZEC Privately': PrivacyTip,
        'Visualizing Zcash Addresses': QrCode,
        'Full Nodes': ServerSolid,
        'Raspberry Pi 4 Full Node': RaspBerry,
        'Raspberry pi 4 Zebra Node': Zebratechnologies,
        'Using ZEC in DeFi': Ethereum,
        'Free2z Live': Live,
        'Zgo Payment Processor': PointOfSale,
        'Zero-Knowledge vs Decoys': TopologyRing,
        'Visualizing the Zcash Network': LogoGraph,
        
    },
    'Zcash Tech': {
        'zk SNARKS': Circuitry,
        'Halo': NumberCircle,
        'FROST': SnowFlake,
        'Viewing Keys': FileKey,
        'Zcash Shielded Assets': DollarZimbabwean,
        'Lightwallet Nodes': ComputerTower
    },
    'Zcash Organizations': {
        'Electric Coin Company': Radar,
        'Zcash Foundation': CheckedShield,
        'Zcash Community Grants': HexagonLetterZ,
        'Shielded Labs': BordererShield
    },
    'Zcash Community': {
        'Community Links': LinkSimpleBold,
        'Community Blogs': Blog,
        'Zcash Global Ambassadors': Globe,
        'ZCAP': Group,
        'Community Projects': BuildOutline,
        'Arborist Calls': Trees,
        'Cypherpunk Zero NFT': NftFill,
        'Zcash Ecosystem Security': Lock,
        'Zcash Media': Play,
        'Zcon Archive': PresentationChar,
    },
    'ZFAV Club': {
        'AV Club Background': LiaHorseHeadSolid,
        'Guides for Creators': Resources,
        'Youtube Channel': Youtube,
    },
    'Zcash Social Media': {
        'Podcasts': IosMicrophone,
        'Social Media Links': LinkSolid,
        'pgp for crypto podcast': Podcast,
        'The Zcash Podcast': Zcash,
        'Shielded Transaction Podcast': CheckShield,
        'The ZK Podcast': Spotify,
        'The z2z Podcast': StreamOn,
        'Zcast Podcast': ApplePodcasts,
        'Zero to Zero-knowledge': SpellBook,
        'zl;dr': TipsAndUpdates,
    },
    'Privacy Tools': {
        '2FA Hardware Devices': Fa2,
        'GrapheneOS': Settings,
        'Namada Protocol': HexagonLetterN,
        'PGP Encryption': OutlineEnchanceEncryption,
        'Secure Messengers': MessengerLine,
        'Tor and I2P': TorBrowser,
        'VPN and DVPN': Openvpn,
        'Web Browsers': Browserfirefox,
    },
    'Research': {
        'Social Media Data Collection': RiArticleLine,
        'ZK Shielded Asset Platforms': Paragraph,
    },
    "Glossary & FAQ's": {
        'Zcash Library': HiOutlineBuildingLibrary,
        'FAQ': FaQuestion,
        'Gallery': FcGallery
    },
    'Contribute': {
        'Help build ZecHub': IoConstructOutline,
        'ZecHub DAO': GiMeshBall,
        'Contributing Guide': LiveHelp,
        'ZecWeekly Newsletter': Newspaper
    }
}

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
return 'Nothing'
}
