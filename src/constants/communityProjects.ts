export type CommunityProject = {
  title: string;
  description: string;
  url: string;
  thumbnailImage: string;
  features?: string[];
};

export const communityProjects: CommunityProject[] = [
  {
    title: "ZShieldHer",
    description: "A Zcash education site for domestic violence survivors.",
    url: "https://zshieldher.com/",
    thumbnailImage: "/community-projects/zshieldher.png",
  },
  {
    title: "ZECPublish",
    description:
      "Censorship-resistant, Zcash blockchain-powered social media. It includes a directory of Zcash users and an anonymous message board powered by Zcash.",
    url: "https://www.zecpublish.com",
    thumbnailImage: "/community-projects/zechpublish.png",
  },
  {
    title: "Zlink",
    description:
      "The simplest way to find any link, tool, or information you need about Zcash's ecosystem.",
    url: "https://zlink.click",
    thumbnailImage: "https://i.postimg.cc/wjCxj2BF/ZEC-PRICE-20260629-182513-0002.png",
  },
  {
    title: "Zimppy",
    description:
      "The Machine Payment Protocol (MPP) payment method for Zcash, designed for AI agents and automated machine-to-machine workflows. Deposit once on-chain, then make unlimited instant bearer requests with no per-request blockchain interaction. Supports fully shielded Zcash (Orchard) payments.",
    url: "https://zimppy.xyz/",
    thumbnailImage: "/community-projects/zimmpy.png",
  },
  {
    title: "CipherScan",
    description:
      "Privacy-first Zcash blockchain explorer. Built with Next.js 15, TypeScript, and Rust/WASM. Look up blocks, transactions, and addresses without leaking query metadata.",
    url: "https://cipherscan.app/",
    thumbnailImage: "/community-projects/CipherScan.png",
  },
  {
    title: "ZcashNames",
    description:
      "Human-readable names for Zcash shielded addresses. Register a memorable name, such as alice.zec, that resolves to your Unified Address.",
    url: "https://www.zcashnames.com/",
    thumbnailImage: "/community-projects/zcashNames.png",
  },
  {
    title: "Cypherpunk",
    description:
      "A company dedicated to privacy, self-sovereignty, and cypherpunk values. Builds tools for individuals who need to protect their digital lives.",
    url: "https://cypherpunk.com/",
    thumbnailImage: "/community-projects/cypherPunk.png",
  },
  {
    title: "Cipherpay",
    description:
      "Enables private payments for the internet. Accept Zcash in minutes — non-custodial, no KYC required. Merchants receive ZEC directly to shielded addresses.",
    url: "https://www.cipherpay.app/en",
    thumbnailImage: "/community-projects/Cipherpay.png",
  },
  {
    title: "ZECping",
    description: "See the gRPC response times of Zcash Lightwalletd nodes.",
    url: "https://github.com/emersonian/zecping",
    thumbnailImage: "/community-projects/zecping.png",
  },
  {
    title: "Ziggurat",
    description:
      "Network test suite that provides zcashd and Zebra devs with a reliable foundation. Includes a Zcash crawler.",
    url: "https://github.com/runziggurat/zcash",
    thumbnailImage: "/community-projects/ziggurat.png",
  },
  {
    title: "Exblo",
    description:
      "Block explorer specially designed for testing transactions on the Zcash Testnet. Currently in active development.",
    url: "https://testnet.exblo.app/",
    thumbnailImage: "/community-projects/exblo.png",
  },
  {
    title: "Dizzy Wallet",
    description:
      "Discord bot that provides seamless and secure access to Zcash transactions.",
    url: "https://forum.zcashcommunity.com/t/dizzy-wallet-a-dedicated-zcash-wallet-for-discord/43988",
    thumbnailImage: "/community-projects/dizzy-wallet.png",
  },
  {
    title: "Frost",
    description:
      "IETF draft for FROST threshold signatures — on the path to greater adoption in the Zcash ecosystem.",
    url: "https://eprint.iacr.org/2020/852",
    thumbnailImage: "/community-projects/frost.png",
  },
  {
    title: "Free2z",
    description:
      "Tool for anonymous content creation and private donations powered by Zcash.",
    url: "https://free2z.cash",
    thumbnailImage: "/community-projects/free2z.png",
  },
  {
    title: "Ezcash",
    description:
      "Easy-to-use, fully-featured multiplatform Zcash wallet with autoshielding support.",
    url: "https://blog.nerdbank.net/ezcash-app",
    thumbnailImage: "/community-projects/ezcash.png",
  },
  {
    title: "My First Zcash",
    description: "Educational workbook created by the Zcash global community.",
    url: "https://github.com/massadoptionorg/My-First-Zcash",
    thumbnailImage: "/community-projects/my-first-zcash.png",
  },
  {
    title: "Warp Engine",
    description:
      "YWallet's upcoming synchronization engine with improved sync and transaction building.",
    url: "https://forum.zcashcommunity.com/t/warp-the-next-engine-for-ywallet/48722",
    thumbnailImage: "/community-projects/warp-engine.png",
  },
  {
    title: "Ywallet",
    description:
      "Multi-feature privacy wallet supporting Zcash and Ycash with fast warp-sync.",
    url: "https://ywallet.app/",
    thumbnailImage: "/community-projects/ywallet.png",
  },
  {
    title: "Zapp",
    description:
      "Privacy-first messenger that connects ZEC chats to real-world payments.",
    url: "https://www.justzappit.xyz/",
    thumbnailImage: "/community-projects/zapp.png",
  },
  {
    title: "Zodl",
    description:
      "Open-source, self-custodial shielded Zcash wallet built for private payments.",
    url: "https://electriccoin.co/zashi/",
    thumbnailImage: "/community-projects/zodl.png",
  },
  {
    title: "Zcash Block Explorer",
    description: "Comprehensive Zcash block explorer from Nighthawk Apps.",
    url: "https://mainnet.zcashexplorer.app/",
    thumbnailImage: "/community-projects/zcash-block-explorer.png",
  },
  {
    title: "Zebra",
    description:
      "Independent, consensus-compatible Zcash node implementation by the Zcash Foundation.",
    url: "https://zfnd.org/zebra/",
    thumbnailImage: "/community-projects/zebra.png",
  },
  {
    title: "ZECpages",
    description:
      "Censorship-resistant, Zcash blockchain-powered social media and user directory.",
    url: "https://www.zecpages.com/",
    thumbnailImage: "/community-projects/zec-pages.png",
  },
  {
    title: "Zingo",
    description:
      "Fully-featured Zcash wallet for advanced users — mobile & desktop.",
    url: "https://www.zingolabs.org/",
    thumbnailImage: "/community-projects/zingo.png",
  },
  {
    title: "ZGo",
    description:
      "Zcash Register enabling vendors and merchants to accept Zcash payments.",
    url: "https://zgo.cash",
    thumbnailImage: "/community-projects/z-go.png",
  },
  {
    title: "Zcash CLI JSON RPC",
    description:
      "Open-source automated documentation website for zcashd JSON-RPC.",
    url: "https://zcash-rpc.vercel.app/",
    thumbnailImage: "/community-projects/zcash-rpc.png",
  },
  {
    title: "ZK Radio",
    description:
      "Online radio station to inform, educate, and entertain the Zcash community.",
    url: "https://zcashesp.com/zk-radio/",
    thumbnailImage: "/community-projects/zk-radio.png",
  },
  {
    title: "ZecMap",
    description:
      "Map interface displaying Zcash-accepting merchants and community locations.",
    url: "https://zecmap.com",
    thumbnailImage: "https://i.postimg.cc/DZBKLP7d/20260629-154810.jpg",
  },
  {
    title: "ZecStats",
    description:
      "Dashboard for real-time Zcash network statistics and shielding metrics.",
    url: "https://zecstats.com",
    thumbnailImage: "https://i.postimg.cc/Yq4wLFZY/Screenshot-2026-06-29-15-56-11-822-com-android-chrome-edit.jpg",
  },
  {
    title: "zecprice",
    description:
      "Tracking and data metrics tool for Zcash market price performance.",
    url: "https://zecprice.com",
    thumbnailImage: "https://i.postimg.cc/HL8JSjr2/ZEC-PRICE-20260629-182513-0000.png",
  },
  {
    title: "Overpay.com",
    description:
      "Payment gateway solutions supporting Zcash ecosystem integrations.",
    url: "https://overpay.com",
    thumbnailImage: "https://i.postimg.cc/bwWr28mS/ZEC-PRICE-20260629-182513-0001.png",
  },

  // Applications that Utilize Zcash
  {
    title: "aftok",
    description:
      "Radical new kind of cooperative, bottom-up business organization on Zcash.",
    url: "https://aftok.com",
    thumbnailImage: "/community-projects/aftok.png",
  },
  {
    title: "Brave Wallet",
    description:
      "Secure crypto wallet integrated into Brave Browser with Zcash transparent support.",
    url: "https://brave.com/wallet/",
    thumbnailImage: "/community-projects/brave-wallet.png",
  },
  {
    title: "DCRDEX",
    description: "Decentralized exchange built by the Decred Project.",
    url: "https://dex.decred.org",
    thumbnailImage: "/community-projects/dcrdex.png",
  },
  {
    title: "Nozy Wallet",
    description:
      "Orchard-focused Zcash wallet built for Zebrad, supporting fully shielded transactions and secure key management.",
    url: "https://github.com/LEONINE-DAO/Nozy-wallet",
    thumbnailImage: "https://i.postimg.cc/pVfjb9sb/ZEC-PRICE-20260629-182842-0000.png",
  },

  // Wider Ecosystem Utilizing Zero-Knowledge Proofs
  {
    title: "Aztec",
    description:
      "Private Ethereum rollup with up to 100x cost savings and strong privacy guarantees.",
    url: "https://aztec.network/",
    thumbnailImage: "/community-projects/aztec.png",
  },
  {
    title: "Darkfi",
    description:
      "Anonymous Layer 1 DeFi network with zero-knowledge smart contracts.",
    url: "https://dark.fi",
    thumbnailImage: "/community-projects/darkfi.png",
  },
];
