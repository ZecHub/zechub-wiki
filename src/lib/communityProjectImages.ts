import type { CommunityProject } from "./parseCommunityProjects";

/**
 * Maps project titles → image paths in /public/content-images/
 * Titles must match EXACTLY what appears in Community_Projects.md
 * Projects without a matching file will render without a thumbnail.
 *
 * Source of truth for titles:
 * ZecHub/zechub → site/Zcash_Community/Community_Projects.md
 */
export const COMMUNITY_PROJECT_IMAGES: Record<string, string> = {

  // ── Education, Media, and Community ──────────────────────────────
  "My First Zcash":                          "/content-images/my-first-zcash.webp",
  "ZECPublish":                              "/content-images/zechpublish.webp",
  "ZK Radio":                                "/content-images/zk-radio.webp",
  "ZShieldHer":                              "/content-images/zshieldher.webp",
  "ZecForge":                                "/content-images/zecforge.webp",
  "Mastering Zcash Video Series":            "/content-images/mastering-zcash.webp",
  "Zcast":                                   "/content-images/zcast.webp",
  "Zero-knowledge Audiovisual Club (ZKAV)":  "/content-images/zkav.webp",
  "Zcash Network School":                    "/content-images/zcash-network-school.webp",
  "Zectastic":                               "/content-images/zectastic.webp",
  "ZEC App":                                 "/content-images/zec-app.webp",
  "PGPZ Community":                          "/content-images/pgpz.webp",
  "Gleyo":                                   "/content-images/gleyo.webp",
  "Zcash Grants Hub":                        "/content-images/zcash-grants-hub.webp",

  // ── Wallets and Payment Tools ─────────────────────────────────────
  "CipherPay":                               "/content-images/cipherpay.webp",
  "eZcash":                                  "/content-images/ezcash.webp",
  "Nozy Wallet":                             "/content-images/nozy.webp",
  "Overpay.com":                             "/content-images/overpay.webp",
  "ZcashToCash":                             "/content-images/zcashtocash.png",
  "Zafu Wallet":                             "/content-images/zafu.webp",
  "ZGo":                                     "/content-images/z-go.webp",
  "Zimppy":                                  "/content-images/zimmpy.webp",
  "Dizzy Wallet":                            "/content-images/dizzy-wallet.webp",
  "ZODL":                                    "/content-images/zodl.webp",
  "Noir Wallet":                             "/content-images/noir-wallet.webp",
  "ZecVault":                                "/content-images/zecvault.webp",
  "Zkool":                                   "/content-images/zkool.webp",
  "MonteZecret":                             "/content-images/montezecret.webp",
  "Gem Wallet":                              "/content-images/gem-wallet.webp",
  "TIPZ":                                    "/content-images/tipz.webp",
  "CYZE":                                    "/content-images/cyze.webp",
  "Pendrake Watch":                          "/content-images/pendrake-watch.webp",

  // ── Explorers, Data, and Network Dashboards ───────────────────────
  "CipherScan":                              "/content-images/cipherscan.webp",
  "Exblo":                                   "/content-images/exblo.webp",
  "OpenZcash":                               "/content-images/openzcash.webp",
  "Zcash Block Explorer":                    "/content-images/zcash-block-explorer.webp",
  "Zcash.Space":                             "/content-images/zcash-space.webp",
  "ZecMap":                                  "/content-images/zecmap.webp",
  "ZECping":                                 "/content-images/zecping.webp",
  "ZecStats":                                "/content-images/zecstats.webp",
  "zecprice":                                "/content-images/zecprice.webp",
  "Zlink":                                   "/content-images/zlink.webp",
  "Zecmarket":                               "/content-images/zecmarket.webp",
  "Zecsite":                                 "/content-images/zecsite.webp",
  "ZEC-OS":                                  "/content-images/zec-os.webp",

  // ── Identity, Names, and User Experience ─────────────────────────
  "ZcashNames":                              "/content-images/zcashnames.webp",
  "Zapp / JustZappIt":                       "/content-images/zapp.webp",
  "Zentat":                                  "/content-images/zentat.webp",
  "Shielded Wall":                           "/content-images/shielded-wall.webp",
  "Ztrash":                                  "/content-images/ztrash.webp",
  "LiveZEC":                                 "/content-images/livezec.webp",
  "ZecLedger":                               "/content-images/zecledger.webp",
  "Authentication with ZcashMe":             "/content-images/authentication-with-zcashme.webp",

  // ── Developer, Testing, and Infrastructure ────────────────────────
  "Ziggurat":                                "/content-images/ziggurat.webp",
  "ZecDev":                                  "/content-images/zecdev.webp",
  "Zebra Coverage-Guided Fuzzing Infrastructure": "/content-images/zebra.webp",
  "FROST":                                   "/content-images/frost.webp",
  "MonteZcret Benchmark":                    "/content-images/montezcret-benchmark.webp",

  // ── Wider Applications Utilizing Zcash ───────────────────────────
  "aftok":                                   "/content-images/aftok.webp",
  "ZK Global Credit":                        "/content-images/zkglobalcredit.webp",
  "Free2Z":                                  "/content-images/free2z.webp",
  "Rhea Finance":                            "/content-images/rhea-finance.webp",
  "BazaarSwap":                              "/content-images/bazaarswap.webp",
  "DCRDEX":                                  "/content-images/dcrdex.webp",
  "Brave Wallet":                            "/content-images/brave-wallet.webp",
  "Nano-GPT":                                "/content-images/nano-gpt.webp",
  "zk.poker":                                "/content-images/zk-poker.webp",

  // ── Organizations & Labs ─────────────────────────────────────────
  "Shielded Labs":                           "/content-images/shielded-labs.webp",
  "Cypherpunk":                              "/content-images/cypherpunk.webp",
};

export function attachImages(
  projects: CommunityProject[]
): CommunityProject[] {
  return projects.map((p) => ({
    ...p,
    thumbnailImage: COMMUNITY_PROJECT_IMAGES[p.title],
  }));
}
