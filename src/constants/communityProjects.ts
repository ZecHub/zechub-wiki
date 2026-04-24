export type CommunityProject = {
  title: string;
  description: string;
  url: string;
  thumbnailImage: string;
  features?: string[];
};

export const communityProjects: CommunityProject[] = [
  {
    title: "ZECping",
    description: "See the gRPC response times of Zcash Lightwalletd nodes.",
    url: "https://github.com/emersonian/zecping",
    thumbnailImage: "/community-projects/zecping.png",
  },
  {
    title: "Ziggurat",
    description: "Network test suite that provides zcashd and Zebra devs with a reliable foundation. Includes a Zcash crawler.",
    url: "https://github.com/runziggurat/zcash",
    thumbnailImage: "/community-projects/ziggurat.png",
  },
  {
    title: "Exblo",
    description: "Block explorer specially designed for testing transactions on the Zcash Testnet. Currently in active development.",
    url: "https://testnet.exblo.app/",
    thumbnailImage: "/community-projects/exblo.png",
  },
  {
    title: "Dizzy Wallet",
    description: "Discord bot that provides seamless and secure access to Zcash transactions.",
    url: "https://forum.zcashcommunity.com/t/dizzy-wallet-a-dedicated-zcash-wallet-for-discord/43988",
    thumbnailImage: "/community-projects/dizzy-wallet.png",
  },
  {
    title: "Frost",
    description: "IETF draft for FROST threshold signatures — on the path to greater adoption in the Zcash ecosystem.",
    url: "https://eprint.iacr.org/2020/852",
    thumbnailImage: "/community-projects/frost.png",
  },
  {
    title: "Free2z",
    description: "Tool for anonymous content creation and private donations powered by Zcash.",
    url: "https://free2z.cash",
    thumbnailImage: "/community-projects/free2z.png",
  },
  {
    title: "Ezcash",
    description: "Easy-to-use, fully-featured multiplatform Zcash wallet with autoshielding support.",
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
    title: "Nighthawk Wallet",
    description: "Private money in your wallet using ZEC with autoshielding capability.",
    url: "https://nighthawkwallet.com/",
    thumbnailImage: "/community-projects/nighthawk-wallet.png",
  },
  {
    title: "Warp Engine",
    description: "YWallet's upcoming synchronization engine with improved sync and transaction building.",
    url: "https://forum.zcashcommunity.com/t/warp-the-next-engine-for-ywallet/48722",
    thumbnailImage: "/community-projects/warp-engine.png",
  },
  {
    title: "Ywallet",
    description: "Multi-feature privacy wallet supporting Zcash and Ycash with fast warp-sync.",
    url: "https://ywallet.app/",
    thumbnailImage: "/community-projects/ywallet.png",
  },
  {
    title: "Zapp",
    description: "Privacy-first messenger that connects ZEC chats to real-world payments.",
    url: "https://www.justzappit.xyz/",
    thumbnailImage: "/community-projects/zapp.png",
  },
  {
    title: "Zodl",
    description: "Open-source, self-custodial shielded Zcash wallet built for private payments.",
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
    description: "Independent, consensus-compatible Zcash node implementation by the Zcash Foundation.",
    url: "https://zfnd.org/zebra/",
    thumbnailImage: "/community-projects/zebra.png",
  },
  {
    title: "ZECpages",
    description: "Censorship-resistant, Zcash blockchain-powered social media and user directory.",
    url: "https://www.zecpages.com/",
    thumbnailImage: "/community-projects/zec-pages.png",
  },
  {
    title: "Zingo",
    description: "Fully-featured Zcash wallet for advanced users — mobile & desktop.",
    url: "https://www.zingolabs.org/",
    thumbnailImage: "/community-projects/zingo.png",
  },
  {
    title: "ZGo",
    description: "Zcash Register enabling vendors and merchants to accept Zcash payments.",
    url: "https://zgo.cash",
    thumbnailImage: "/community-projects/z-go.png",
  },
  {
    title: "Zcash CLI JSON RPC",
    description: "Open-source automated documentation website for zcashd JSON-RPC.",
    url: "https://zcash-rpc.vercel.app/",
    thumbnailImage: "/community-projects/zcash-rpc.png",
  },
  {
    title: "ZK Radio",
    description: "Online radio station to inform, educate, and entertain the Zcash community.",
    url: "https://zcashesp.com/zk-radio/",
    thumbnailImage: "/community-projects/zk-radio.png",
  },
  // Applications that Utilize Zcash
  {
    title: "aftok",
    description: "Radical new kind of cooperative, bottom-up business organization on Zcash.",
    url: "https://aftok.com",
    thumbnailImage: "/community-projects/aftok.png",
  },
  {
    title: "Brave Wallet",
    description: "Secure crypto wallet integrated into Brave Browser with Zcash transparent support.",
    url: "https://brave.com/wallet/",
    thumbnailImage: "/community-projects/brave-wallet.png",
  },
  {
    title: "DCRDEX",
    description: "Decentralized exchange built by the Decred Project (desktop only).",
    url: "https://dex.decred.org",
    thumbnailImage: "/community-projects/dcrdex.png",
  },
  {
    title: "Sideshift",
    description: "No-sign-up cryptocurrency exchange supporting 50+ coins with strong privacy focus.",
    url: "https://sideshift.ai",
    thumbnailImage: "/community-projects/sideshift.png",
  },
  // Wider Ecosystem Utilizing Zero-Knowledge Proofs
  {
    title: "Aztec",
    description: "Private Ethereum rollup with up to 100x cost savings and strong privacy guarantees.",
    url: "https://aztec.network/",
    thumbnailImage: "/community-projects/aztec.png",
  },
  {
    title: "Darkfi",
    description: "Anonymous Layer 1 DeFi network with zero-knowledge smart contracts.",
    url: "https://dark.fi",
    thumbnailImage: "/community-projects/darkfi.png",
  },
  {
    title: "Espresso Systems",
    description: "High-throughput EVM-compatible blockchain with low fees and better privacy.",
    url: "https://www.espressosys.com",
    thumbnailImage: "/community-projects/espresso.png",
  },
  {
    title: "OffShift",
    description: "On-chain, non-custodial privacy platform powered by XFT token.",
    url: "https://offshift.io/",
    thumbnailImage: "/community-projects/offshift.png",
  },
  {
    title: "RAILGUN",
    description: "Full privacy for transfers, trading, leverage, and dApps using zk-SNARKs.",
    url: "https://railgun.org/",
    thumbnailImage: "/community-projects/railgun.png",
  },
];