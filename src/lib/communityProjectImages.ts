import type { CommunityProject } from "./parseCommunityProjects";

/**
 * Maps project titles → image paths in /public/community-projects/
 * Projects without a file will simply render without a thumbnail.
 */
export const COMMUNITY_PROJECT_IMAGES: Record<string, string> = {
  // Education, Media, and Community
  "My First Zcash": "/community-projects/my-first-zcash.png",
  "ZECPublish": "/community-projects/zechpublish.png",
  "ZK Radio": "/community-projects/zk-radio.png",
  "ZShieldHer": "/community-projects/zshieldher.png",
  "ZecForge": "/community-projects/zecforge.jpg",
  "Mastering Zcash Video Series": "/community-projects/mastering-zcash.png",
  "Zcast": "/community-projects/zcast.jpg",
  "Zero-knowledge Audiovisual Club (ZKAV)": "/community-projects/zkav.png",
  "Zcash Network School": "/community-projects/zcash-network-school.png",
  "Zectastic": "/community-projects/zectastic.png",
  "Zec App": "/community-projects/zec-app.png",
  "PGPZ Community": "/community-projects/pgpz.png",

  // Wallets and Payment Tools
  "Cipherpay": "/community-projects/Cipherpay.png",
  "Ezcash": "/community-projects/ezcash.png",
  "Nozy Wallet": "/community-projects/nozy.jpg",
  "Overpay.com": "/community-projects/overpay.png",
  "Zafu Wallet": "/community-projects/zafu.png",
  "ZGo": "/community-projects/z-go.png",
  "Zimppy": "/community-projects/zimmpy.png",
  "Dizzy Wallet": "/community-projects/dizzy-wallet.png",
  "ZODL": "/community-projects/zodl.png",
  "Noir Wallet": "/community-projects/noir-wallet.png",
  "ZecVault": "/community-projects/zecvault.png",
  "Zkool": "/community-projects/zkool.png",
  "MonteZecret": "/community-projects/montezecret.png",
  "Gem Wallet": "/community-projects/gem-wallet.png",
  "TIPZ": "/community-projects/tipz.png",

  // Explorers, Data, and Network Dashboards
  "CipherScan": "/community-projects/CipherScan.png",
  "Exblo": "/community-projects/exblo.png",
  "OpenZcash": "/community-projects/openzcash.png",
  "Zcash Block Explorer": "/community-projects/zcash-block-explorer.png",
  "Zcash.Space": "/community-projects/zcash-space.png",
  "ZecMap": "/community-projects/ZECMap.jpg",
  "ZECping": "/community-projects/zecping.png",
  "ZecStats": "/community-projects/zecstats.jpg",
  "zecprice": "/community-projects/zecprice.png",
  "Zlink": "/community-projects/zlink.png",

  // Identity, Names, and User Experience
  "ZcashNames": "/community-projects/zcashNames.png",
  "Zapp / JustZappIt": "/community-projects/zapp.png",
  "Zentat": "/community-projects/zentat.png",
  "Shielded Wall": "/community-projects/shielded-wall.png",
  "Ztrash": "/community-projects/ztrash.png",

  // Developer, Testing, and Infrastructure
  "Ziggurat": "/community-projects/ziggurat.png",
  "ZecDev": "/community-projects/zecdev.png",
  "Zebra Coverage-Guided Fuzzing Infrastructure": "/community-projects/zebra-fuzzing.png",
  "Frost": "/community-projects/frost.png",
  "MonteZcret Benchmark": "/community-projects/montezcret-benchmark.png",

  // Wider Applications Utilizing Zcash
  "aftok": "/community-projects/aftok.png",
  "ZK Global Credit": "/community-projects/zkglobalcredit.png",
  "Free2z": "/community-projects/free2z.png",
  "Rhea Finance": "/community-projects/rhea-finance.png",
  "BazaarSwap": "/community-projects/bazaarswap.jpg",
  "DCRDEX": "/community-projects/dcrdex.png",
  "Brave Wallet": "/community-projects/brave-wallet.png",

  // Organizations & Labs
  "Shielded Labs": "/community-projects/Sl.png",
  "Cypherpunk": "/community-projects/cypherPunk.png",
};

export function attachImages(
  projects: CommunityProject[]
): CommunityProject[] {
  return projects.map((p) => ({
    ...p,
    thumbnailImage: COMMUNITY_PROJECT_IMAGES[p.title],
  }));
}