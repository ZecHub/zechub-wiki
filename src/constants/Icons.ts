import {SiZcash as Zcash, SiWikipedia as Wikipedia, SiYoutube as Youtube, SiXdadevelopers as Dadeveloper, SiRaspberrypi as RaspBerry }  from 'react-icons/si'
import {PiShootingStarThin as ShootingStar} from 'react-icons/pi'
import {RiSecurePaymentLine as SecurePayment, RiMailSendFill as MailSend, RiExchangeFundsFill as ExchangeFunds, RiLiveFill as Live } from 'react-icons/ri'
import {GrResources as Resources, GrCircleInformation as CircleInfo } from 'react-icons/gr'
import {TbBinaryTree2 as BinaryTree, TbTopologyRing as TopologyRing } from 'react-icons/tb'
import {SlGraph as Graph } from 'react-icons/sl'
import {FaWallet as Wallet, FaFaucet as Faucet, FaListAlt as ListAlt, FaEthereum as Ethereum } from 'react-icons/fa'
import {FcCurrencyExchange as CurrencyExchange} from 'react-icons/fc'
import {BsFillArrowUpRightCircleFill as ArrowUp, BsShieldShaded as ShieldShaded, BsQrCode as QrCode } from 'react-icons/bs'
import {MdOutlinePrivacyTip as PrivacyTip, MdOutlinePointOfSale as PointOfSale } from 'react-icons/md'
import {LiaServerSolid as ServerSolid } from 'react-icons/lia'
import {BiLogoGraphql as LogoGraph } from 'react-icons/bi'
import {ImParagraphLeft as Paragraph } from 'react-icons/im'

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
        'z2z Tutorial': Youtube,
        'Wallet Tutorials': Youtube,
        'Buy ZEC in Gemini': Youtube,
        'Nighthawk Wallet': Youtube,
        'Shielding ZEC': Youtube,
        'Spedn Demo': Youtube
    },
    'Using Zcash': {
        'Wallets': Wallet,
        'Buying ZEC': CurrencyExchange,
        'Transactions': ArrowUp,
        'Memos': MailSend,
        'Shielded Pools': ShieldShaded,
        'Faucets': Faucet,
        'Non-Custodial Exchanges': ExchangeFunds,
        'DEX List': ListAlt,
    },
    'Guides': {
        'Using ZEC Privately': PrivacyTip,
        'Visualizing Zcash Addresses': QrCode,
        'Full Nodes': ServerSolid,
        'Raspberry Pi 4 Full Node': RaspBerry,
        'Using ZEC in DeFi': Ethereum,
        'Free2z Live': Live,
        'Zgo Payment Processor': PointOfSale,
        'Zero-Knowledge vs Decoys': TopologyRing,
        'Visualizing the Zcash Network': LogoGraph,
        'ZK Shielded Asset Platforms': Paragraph,
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