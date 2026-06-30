export type CommunityProject = {
  title: string;
  description: string;
  url: string;
  thumbnailImage: string;
  features?: string[];
};

export const communityProjects: CommunityProject[] = [
  // Education, Media, and Community
  {
    title: "My First Zcash",
    description: "Educational workbook created by the Zcash global community.",
    url: "https://github.com/massadoptionorg/My-First-Zcash",
    thumbnailImage: "/community-projects/my-first-zcash.png",
  },
  {
    title: "ZECPublish",
    description:
      "Censorship-resistant, Zcash blockchain-powered social media. It includes a directory of Zcash users and an anonymous message board powered by Zcash.",
    url: "https://www.zecpublish.com",
    thumbnailImage: "/community-projects/zechpublish.png",
  },
  {
    title: "ZK Radio",
    description:
      "Online radio station to inform, educate, and entertain the Zcash community.",
    url: "https://zcashesp.com/zk-radio/",
    thumbnailImage: "/community-projects/zk-radio.png",
  },
  {
    title: "ZShieldHer",
    description: "A Zcash education site for domestic violence survivors.",
    url: "https://zshieldher.com/",
    thumbnailImage: "/community-projects/zshieldher.png",
  },
  {
    title: "ZecForge",
    description: "ACreator forge for the Zcash ecosystem. Onboarding, Creator Development, Content Distribution.",
    url: "https://x.com/zec_forge",
    thumbnailImage: "/community-projects/zecforge.jpg",
  },

  // Wallets and Payment Tools
  {
    title: "Cipherpay",
    description:
      "Enables private payments for the internet. Accept Zcash in minutes — non-custodial, no KYC required. Merchants receive ZEC directly to shielded addresses.",
    url: "https://www.cipherpay.app/en",
    thumbnailImage: "/community-projects/Cipherpay.png",
  },
  {
    title: "Ezcash",
    description:
      "Easy-to-use, fully-featured multiplatform Zcash wallet with autoshielding support.",
    url: "https://blog.nerdbank.net/ezcash-app",
    thumbnailImage: "/community-projects/ezcash.png",
  },
  {
    title: "Nozy Wallet",
    description:
      "Orchard-focused Zcash wallet built for Zebrad, supporting fully shielded transactions and secure key management.",
    url: "https://github.com/LEONINE-DAO/Nozy-wallet",
    thumbnailImage: "/community-projects/nozy.jpg",
  },
  {
    title: "Overpay.com",
    description:
      "Payment gateway solutions supporting Zcash ecosystem integrations.",
    url: "https://overpay.com",
    thumbnailImage: "/community-projects/overpay.png",
  },
  {
    title: "Zafu Wallet",
    description:
      "Open-source privacy wallet for Zcash and Penumbra. Built as a browser extension with client-side proving, verified light-client architecture, cold signing, FROST multisig, and no view key leaving the device.",
    url: "https://chromewebstore.google.com/detail/zafu-wallet-beta/bhlogefpcebekhjpomlodifcelldoimn?pli=1",
    thumbnailImage: "/community-projects/zafu.png",
  },
  {
    title: "ZGo",
    description:
      "Zcash Register enabling vendors and merchants to accept Zcash payments.",
    url: "https://zgo.cash",
    thumbnailImage: "/community-projects/z-go.png",
  },
  {
    title: "Zimppy",
    description:
      "The Machine Payment Protocol (MPP) payment method for Zcash, designed for AI agents and automated machine-to-machine workflows. Deposit once on-chain, then make unlimited instant bearer requests with no per-request blockchain interaction. Supports fully shielded Zcash (Orchard) payments.",
    url: "https://zimppy.xyz/",
    thumbnailImage: "/community-projects/zimmpy.png",
  },
  {
    title: "Dizzy Wallet",
    description:
      "Discord bot that provides seamless and secure access to Zcash transactions.",
    url: "https://forum.zcashcommunity.com/t/dizzy-wallet-a-dedicated-zcash-wallet-for-discord/43988",
    thumbnailImage: "/community-projects/dizzy-wallet.png",
  },


  // Explorers, Data, and Network Dashboards
  {
    title: "CipherScan",
    description:
      "Privacy-first Zcash blockchain explorer. Built with Next.js 15, TypeScript, and Rust/WASM. Look up blocks, transactions, and addresses without leaking query metadata.",
    url: "https://cipherscan.app/",
    thumbnailImage: "/community-projects/CipherScan.png",
  },
  {
    title: "Exblo",
    description:
      "Block explorer specially designed for testing transactions on the Zcash Testnet. Currently in active development.",
    url: "https://testnet.exblo.app/",
    thumbnailImage: "/community-projects/exblo.png",
  },
  {
    title: "OpenZcash",
    description:
      "Public transparency dashboard for the Zcash Dev Fund, including ZCG and FPF grant accounting, the live Lockbox, governance, disbursements, and ecosystem funding data.",
    url: "https://openzcash.org/",
    thumbnailImage: "/community-projects/openzcash.png",
  },
  {
    title: "Zcash Block Explorer",
    description: "Comprehensive Zcash block explorer from Nighthawk Apps.",
    url: "https://mainnet.zcashexplorer.app/",
    thumbnailImage: "/community-projects/zcash-block-explorer.png",
  },
  {
    title: "Zcash.Space",
    description:
      "Browser-based Zcash Unified Address parser for checking and inspecting Unified Addresses.",
    url: "https://zcash.space/",
    thumbnailImage: "/community-projects/zcash-space.png",
  },
  {
    title: "ZecMap",
    description:
      "Map interface displaying Zcash-accepting merchants and community locations.",
    url: "https://zecmap.com",
    thumbnailImage: "/community-projects/ZECMap.jpg",
  },
  {
    title: "ZECping",
    description: "See the gRPC response times of Zcash Lightwalletd nodes.",
    url: "https://github.com/emersonian/zecping",
    thumbnailImage: "/community-projects/zecping.png",
  },
  {
    title: "ZecStats",
    description:
      "Dashboard for real-time Zcash network statistics and shielding metrics.",
    url: "https://zecstats.com",
    thumbnailImage: "/community-projects/zecstats.jpg",
  },
  {
    title: "zecprice",
    description:
      "Tracking and data metrics tool for Zcash market price performance.",
    url: "https://zecprice.com",
    thumbnailImage: "/community-projects/zecprice.png",
  },


  // Identity, Names, and User Experience
  {
    title: "ZcashNames",
    description:
      "Human-readable names for Zcash shielded addresses. Register a memorable name, such as alice.zec, that resolves to your Unified Address.",
    url: "https://www.zcashnames.com/",
    thumbnailImage: "/community-projects/zcashNames.png",
  },
  {
    title: "Zapp",
    description:
      "Privacy-first messenger that connects ZEC chats to real-world payments.",
    url: "https://www.justzappit.xyz/",
    thumbnailImage: "/community-projects/zapp.png",
  },



  // Developer, Testing, and Infrastructure

  {
    title: "Ziggurat",
    description:
      "Network test suite that provides zcashd and Zebra devs with a reliable foundation. Includes a Zcash crawler.",
    url: "https://github.com/runziggurat/zcash",
    thumbnailImage: "/community-projects/ziggurat.png",
  },


  // Wider Applications Utilizing Zcash
  {
    title: "aftok",
    description:
      "Radical new kind of cooperative, bottom-up business organization on Zcash.",
    url: "https://aftok.com",
    thumbnailImage: "/community-projects/aftok.png",
  },
  {
    title: "ZK Global Credit",
    description:
      "Zcash-native credit and voting infrastructure for selective disclosure, settlement readiness, cross-border reputation, and shielded governance workflows.",
    url: "https://voting.zkglobalcredit.tech/",
    thumbnailImage: "/community-projects/zkglobalcredit.png",
  },
  {
    title: "Zentat",
    description:
      "Zentat converts fiat currency prices to Zcash (ZEC) in real-time as you browse the web.",
    url: "https://chromewebstore.google.com/detail/zentat/lpndbahladndclecodadoljlplfaldac",
    thumbnailImage: "/community-projects/zentat.png",
  },
  {
    title: "Free2z",
    description:
      "Tool for anonymous content creation and private donations powered by Zcash.",
    url: "https://free2z.cash",
    thumbnailImage: "/community-projects/free2z.png",
  },
];
