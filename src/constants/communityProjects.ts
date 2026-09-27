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
      "Censorship-resistant, Zcash blockchain-powered social media. Includes a directory of Zcash users and an anonymous message board.",
    url: "https://www.zecpublish.com",
    thumbnailImage: "/community-projects/zechpublish.png",
  },
  {
    title: "ZK Radio",
    description:
      "Online radio station to inform, educate, and entertain the Zcash community. Developed by Zcash en Español and the ZKAV Club.",
    url: "https://zcashesp.com/zk-radio/",
    thumbnailImage: "/community-projects/zk-radio.png",
  },
  {
    title: "ZShieldHer",
    description: "Zcash education site for domestic violence survivors.",
    url: "https://zshieldher.com/",
    thumbnailImage: "/community-projects/zshieldher.png",
  },
  {
    title: "ZecForge",
    description:
      "Creator forge for the Zcash ecosystem focused on onboarding, creator development, and content distribution.",
    url: "https://x.com/zec_forge",
    thumbnailImage: "/community-projects/zecforge.jpg",
  },
  {
    title: "Mastering Zcash Video Series",
    description:
      "Comprehensive educational series covering Zcash technology, cryptography, economics, and governance.",
    url: "https://www.youtube.com/watch?v=YWUzh_VtrR8",
    thumbnailImage: "/community-projects/mastering-zcash.png",
  },
  {
    title: "Zcast",
    description: "Spanish-language Zcash podcast with the latest ecosystem updates.",
    url: "https://www.youtube.com/@ZcastEsp",
    thumbnailImage: "/community-projects/zcast.jpg",
  },
  {
    title: "Zero-knowledge Audiovisual Club (ZKAV)",
    description:
      "Privacy-first audiovisual collective that trains, co-creates, and provides volunteer AV support for open-source and decentralized tech community events.",
    url: "https://zkav.club/",
    thumbnailImage: "/community-projects/zkav.png",
  },
  {
    title: "Zcash Network School",
    description: "Structured educational content for new Zcash users and developers.",
    url: "https://forum.zcashcommunity.com/t/zcash-network-school/55269",
    thumbnailImage: "/community-projects/zcash-network-school.png",
  },
  {
    title: "Zectastic",
    description: "Interactive site featuring Zcash-themed games and live community events.",
    url: "https://zectastic.com/",
    thumbnailImage: "/community-projects/zectastic.png",
  },
  {
    title: "Zec App",
    description:
      "Mobile application that aggregates Zcash news, community activity, network information, wallets, exchanges, and ecosystem resources in one place.",
    url: "https://forum.zcashcommunity.com/t/zec-app-is-coming-soon/56605",
    thumbnailImage: "/community-projects/zec-app.png",
  },
  {
    title: "PGPZ Community",
    description:
      "Community hub for Pretty Good Policy for Zcash (PGPZ), a Washington D.C. policy initiative focused on privacy-preserving digital cash, practical compliance, and the public-interest role of Zcash.",
    url: "https://community.pgpz.org/",
    thumbnailImage: "/community-projects/pgpz.png",
  },
  {
    title: "Gleyo",
    description:
      "Community engagement and rewards platform designed for Zcash communities, Web3 projects, and Web2 organizations. It helps communities onboard and engage members through quests, chat, and rewards, while allowing users to earn and withdraw private shielded ZEC.",
    url: "https://gleyo.app/",
    thumbnailImage: "/community-projects/gleyo.png",
  },
  {
    title: "Zcash Grants Hub",
    description:
      "Community-focused grants dashboard that pulls live data from the Zcash Community Grants GitHub repository so applicants, committee members, and reviewers can track applications, milestones, budgets, discussions, and analytics in one place.",
    url: "https://staging.zgrantshub.com/",
    thumbnailImage: "/community-projects/zcash-grants-hub.png",
  },

  // Wallets and Payment Tools
  {
    title: "Cipherpay",
    description:
      "Private payments for the internet. Non-custodial, no KYC. Merchants receive ZEC directly to shielded addresses.",
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
      "Payment gateway that lets users spend shielded ZEC on real-world purchases (currently in alpha).",
    url: "https://overpay.com",
    thumbnailImage: "/community-projects/overpay.png",
  },
  {
    title: "Zafu Wallet",
    description:
      "Open-source privacy wallet for Zcash and Penumbra. Browser extension with client-side proving, verified light-client architecture, cold signing, FROST multisig, and no view key leaving the device.",
    url: "https://chromewebstore.google.com/detail/zafu-wallet-beta/bhlogefpcebekhjpomlodifcelldoimn",
    thumbnailImage: "/community-projects/zafu.png",
  },
  {
    title: "ZGo",
    description: "Zcash Register that enables vendors and merchants to accept Zcash payments.",
    url: "https://zgo.cash",
    thumbnailImage: "/community-projects/z-go.png",
  },
  {
    title: "Zimppy",
    description:
      "Machine Payment Protocol (MPP) for Zcash. Designed for AI agents and automated machine-to-machine workflows. Supports fully shielded Orchard payments.",
    url: "https://zimppy.xyz/",
    thumbnailImage: "/community-projects/zimmpy.png",
  },
  {
    title: "Dizzy Wallet",
    description: "Discord bot providing seamless and secure access to Zcash transactions.",
    url: "https://forum.zcashcommunity.com/t/dizzy-wallet-a-dedicated-zcash-wallet-for-discord/43988",
    thumbnailImage: "/community-projects/dizzy-wallet.png",
  },
  {
    title: "ZODL",
    description:
      "Flagship Zcash wallet from ZODL (formerly Zashi). Available on iOS and Android. Supports shielded ZEC and NU7 coinholder voting.",
    url: "https://zodl.app/",
    thumbnailImage: "/community-projects/zodl.png",
  },
  {
    title: "Noir Wallet",
    description: "Privacy-focused Zcash wallet designed for simple and private ZEC transactions.",
    url: "https://forum.zcashcommunity.com/t/first-look-at-noir-wallet/55667",
    thumbnailImage: "/community-projects/noir-wallet.png",
  },
  {
    title: "ZecVault",
    description: "Goal-based savings wallet built on Zcash shielded transactions.",
    url: "https://forum.zcashcommunity.com/t/zecvault-a-goal-based-savings-wallet-built-on-zcash-shielded-transactions/55464",
    thumbnailImage: "/community-projects/zecvault.png",
  },
  {
    title: "Zkool",
    description: "Successor to Ywallet supporting the latest Zcash protocol features including Orchard.",
    url: "https://forum.zcashcommunity.com/t/zkool-the-successor-to-ywallet/51139",
    thumbnailImage: "/community-projects/zkool.png",
  },
  {
    title: "MonteZecret",
    description: "Experimental lightweight desktop wallet for Zcash written in Rust.",
    url: "https://forum.zcashcommunity.com/t/montezecret-a-desktop-wallet-for-zcash-in-rust-instead-of-tweets/56164",
    thumbnailImage: "/community-projects/montezecret.png",
  },
  {
    title: "Gem Wallet",
    description:
      "Multi-chain, open-source, self-custodial wallet that supports sending, receiving, and swapping ZEC.",
    url: "https://gemwallet.com/",
    thumbnailImage: "/community-projects/gem-wallet.png",
  },
  {
    title: "TIPZ",
    description:
      "Live non-custodial tipping platform where every tip arrives as shielded ZEC. Supports cross-chain on-ramps via NEAR Intents.",
    url: "https://tipz.cash/",
    thumbnailImage: "/community-projects/tipz.png",
  },
  {
    title: "CYZE",
    description:
      "Collaborative wallet and coordination platform that lets multiple team members manage shielded Zcash funds together using FROST threshold signatures.",
    url: "https://github.com/USCMig/Cyze",
    thumbnailImage: "/community-projects/cyze.png",
  },
  {
    title: "Pendrake Watch",
    description:
      "Watch-only desktop wallet for monitoring shielded funds without spending ability. Supports Orchard and Sapling notes, memos, historical fiat valuation, notifications, encryption, and privacy-focused screen-sharing.",
    url: "https://github.com/auzum197/pendrake-watch",
    thumbnailImage: "/community-projects/pendrake-watch.png",
  },
  {
    title: "Zipher",
    description:
      "A privacy-first Zcash wallet for humans and AI agents, with mobile and headless interfaces powered by a shared Rust engine.",
    url: "https://zipher.to",
    thumbnailImage: "/community-projects/zipher.png",
  },
  {
    title: "Vizor",
    description:
      "Open-source self-custody Zcash wallet built by the Keplr team with multi-account support, Keystone hardware compatibility, and default privacy.",
    url: "https://vizor.cash",
    thumbnailImage: "/community-projects/vizor.png",
  },
  {
    title: "ZecBuy",
    description:
      "A platform for buying and spending Zcash, making ZEC accessible for everyday purchases and real-world use.",
    url: "https://zecbuy.org",
    thumbnailImage: "/community-projects/zecbuy.png",
  },

  // Explorers, Data, and Network Dashboards
  {
    title: "CipherScan",
    description:
      "Privacy-first Zcash blockchain explorer. Built with Next.js 15, TypeScript, and Rust/WASM. Lookups do not leak query metadata.",
    url: "https://cipherscan.app/",
    thumbnailImage: "/community-projects/CipherScan.png",
  },
  {
    title: "Exblo",
    description: "Block explorer designed for testing transactions on the Zcash Testnet.",
    url: "https://testnet.exblo.app/",
    thumbnailImage: "/community-projects/exblo.png",
  },
  {
    title: "OpenZcash",
    description:
      "Public transparency dashboard for the Zcash Dev Fund, including ZCG and FPF grant accounting, the Lockbox, governance, and disbursements.",
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
    description: "Browser-based Zcash Unified Address parser for inspecting Unified Addresses.",
    url: "https://zcash.space/",
    thumbnailImage: "/community-projects/zcash-space.png",
  },
  {
    title: "ZecMap",
    description: "Global map of businesses and locations that accept Zcash.",
    url: "https://zecmap.com/",
    thumbnailImage: "/community-projects/ZECMap.jpg",
  },
  {
    title: "ZECping",
    description: "Tool to check gRPC response times of Zcash Lightwalletd nodes.",
    url: "https://github.com/emersonian/zecping",
    thumbnailImage: "/community-projects/zecping.png",
  },
  {
    title: "ZecStats",
    description: "Dashboard for real-time Zcash network statistics and shielding metrics.",
    url: "https://zecstats.com",
    thumbnailImage: "/community-projects/zecstats.jpg",
  },
  {
    title: "zecprice",
    description: "Tracking and data metrics tool for Zcash market price performance.",
    url: "https://zecprice.com",
    thumbnailImage: "/community-projects/zecprice.png",
  },
  {
    title: "Zlink",
    description: "Directory for finding links, tools, and information about the Zcash ecosystem.",
    url: "https://zlink.click",
    thumbnailImage: "/community-projects/zlink.png",
  },
  {
    title: "Zecmarket",
    description:
      "Privacy-first marketplace of the Zcash ecosystem. Payments settle directly and the platform never holds your funds.",
    url: "https://zecmarket.org/",
    thumbnailImage: "/community-projects/zecmarket.png",
  },
  {
    title: "Zecsite",
    description:
      "Privacy-focused static website that aggregates Zcash news, statistics, and educational content without using JavaScript.",
    url: "https://zecsite.org",
    thumbnailImage: "/community-projects/zecsite.png",
  },
  {
    title: "ZEC-OS",
    description:
      "Retro-style desktop interface that combines Zcash ecosystem tools into one application, including an explorer, mempool viewer, network stats, charts, shielded pool data, mining tools, UA decoder, calculator, games, and terminal.",
    url: "https://www.zec-os.com/",
    thumbnailImage: "/community-projects/zec-os.png",
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
    title: "Zapp / JustZappIt",
    description: "Privacy-first messenger that connects ZEC chats to real-world payments.",
    url: "https://www.justzappit.xyz/",
    thumbnailImage: "/community-projects/zapp.png",
  },
  {
    title: "Zentat",
    description:
      "Browser extension that converts fiat currency prices to ZEC in real time as you browse the web.",
    url: "https://chromewebstore.google.com/detail/zentat/lpndbahladndclecodadoljlplfaldac",
    thumbnailImage: "/community-projects/zentat.png",
  },
  {
    title: "Shielded Wall",
    description: "Anonymous confession platform powered by Zcash privacy.",
    url: "https://shieldedwall.org/",
    thumbnailImage: "/community-projects/shielded-wall.png",
  },
  {
    title: "Ztrash",
    description: "Disposable email inbox paid for with shielded ZEC.",
    url: "https://ztrash.com/",
    thumbnailImage: "/community-projects/ztrash.png",
  },
  {
    title: "LiveZEC",
    description:
      "Privacy-focused tipping platform for streamers that enables viewers to send shielded ZEC directly to a streamer's self-custodial wallet.",
    url: "https://zec.live/",
    thumbnailImage: "/community-projects/livezec.png",
  },
  {
    title: "ZecLedger",
    description:
      "Privacy-preserving financial tracking and accounting tool for Zcash. Combines a public dashboard with local private accounting via viewing keys.",
    url: "https://zecledger-web.vercel.app/",
    thumbnailImage: "/community-projects/zecledger.png",
  },
  {
    title: "Authentication with ZcashMe",
    description:
      "Privacy-focused authentication system that uses shielded Zcash transactions as a login mechanism. Users scan a QR code and send a small authentication transaction.",
    url: "https://github.com/zcashme/zns-login",
    thumbnailImage: "/community-projects/authentication-with-zcashme.png",
  },

  // Developer, Testing, and Infrastructure
  {
    title: "Ziggurat",
    description:
      "Network test suite that provides zcashd and Zebra devs with a reliable foundation. Includes a Zcash crawler.",
    url: "https://github.com/runziggurat/zcash",
    thumbnailImage: "/community-projects/ziggurat.png",
  },
  {
    title: "ZecDev",
    description:
      "Linux-first toolkit that brings up a Zebra regtest network with faucet, Unified Address fixtures, and lightwalletd or Zaino, plus reusable GitHub Actions for shielded end-to-end flows.",
    url: "https://github.com/zecdev",
    thumbnailImage: "/community-projects/zecdev.png",
  },
  {
    title: "Zebra Coverage-Guided Fuzzing Infrastructure",
    description:
      "Systematic testing of Zebra's parsing, networking, and cryptographic components against malformed inputs.",
    url: "https://github.com/ZcashCommunityGrants/zcashcommunitygrants/issues/234",
    thumbnailImage: "/community-projects/zebra.png",
  },
  {
    title: "Frost",
    description:
      "Threshold signature scheme (FROST) work being advanced for broader adoption in the Zcash ecosystem.",
    url: "https://eprint.iacr.org/2020/852",
    thumbnailImage: "/community-projects/frost.png",
  },
  {
    title: "MonteZcret Benchmark",
    description:
      "Open-source performance-testing project that evaluates different methods of synchronizing Zcash blockchain data.",
    url: "https://github.com/openkoder/benchmarks_zcash/",
    thumbnailImage: "/community-projects/montezcret-benchmark.png",
  },
  {
    title: "Zaino Indexer",
    description:
      "A high-performance indexing service for the Zcash blockchain, enabling fast and reliable data access for wallets and applications.",
    url: "https://github.com/zingolabs/zaino",
    thumbnailImage: "/community-projects/zaino.png",
  },
  {
    title: "Zakura",
    description:
      "A consensus-compatible Zcash full node built for scale, with faster synchronization, pruning, zcashd compatibility, and high-performance networking.",
    url: "https://zakura.com",
    thumbnailImage: "/community-projects/zakura.png",
  },
  {
    title: "Zecd",
    description:
      "An open-source, shielded-first Zcash wallet server alternative to zcashd that speaks Bitcoin Core's JSON-RPC dialect, designed for easy enterprise integration.",
    url: "https://zecd.org",
    thumbnailImage: "/community-projects/zecd.png",
  },
  {
    title: "Zero Indexer",
    description:
      "A privacy-preserving light-client indexer framework by Shielded Labs that routes shielded transactions through attested enclaves to obscure user IP metadata.",
    url: "https://github.com/ShieldedLabs/zero/tree/main/zeronym",
    thumbnailImage: "/community-projects/zero-indexer.png",
  },

  // Wider Applications Utilizing Zcash
  {
    title: "aftok",
    description: "Cooperative, bottom-up business organization model built on Zcash.",
    url: "https://aftok.com",
    thumbnailImage: "/community-projects/aftok.png",
  },
  {
    title: "ZK Global Credit",
    description:
      "Zcash-native credit and voting infrastructure for selective disclosure, settlement readiness, cross-border reputation, and shielded governance.",
    url: "https://voting.zkglobalcredit.tech/",
    thumbnailImage: "/community-projects/zkglobalcredit.png",
  },
  {
    title: "Free2z",
    description: "Tool for anonymous content creation and private donations powered by Zcash.",
    url: "https://free2z.cash",
    thumbnailImage: "/community-projects/free2z.png",
  },
  {
    title: "Rhea Finance",
    description: "Zcash gateway providing a browser wallet and cross-chain DeFi access.",
    url: "https://forum.zcashcommunity.com/t/rhea-finance-zcash-gateway-browser-wallet-cross-chain-defi/55073",
    thumbnailImage: "/community-projects/rhea-finance.png",
  },
  {
    title: "BazaarSwap",
    description: "Zcash-native DEX that brings shielded ZEC into Web3 DeFi via WalletConnect.",
    url: "https://forum.zcashcommunity.com/t/introducing-bazaarswap-bringing-zec-to-web3-defi/55479",
    thumbnailImage: "/community-projects/bazaarswap.jpg",
  },
  {
    title: "DCRDEX",
    description: "Decred's decentralized exchange that supports Zcash.",
    url: "https://dex.decred.org",
    thumbnailImage: "/community-projects/dcrdex.png",
  },
  {
    title: "Brave Wallet",
    description: "Browser wallet with Zcash support.",
    url: "https://brave.com/wallet/",
    thumbnailImage: "/community-projects/brave-wallet.png",
  },
  {
    title: "Nano-GPT",
    description:
      "AI platform that provides access to multiple leading AI models while supporting cryptocurrency payments, including Zcash.",
    url: "https://nano-gpt.com/conversation/new",
    thumbnailImage: "/community-projects/nano-gpt.png",
  },
  {
    title: "zk.poker",
    description:
      "Peer-to-peer poker platform combining end-to-end encryption, mental poker, and Zcash privacy technology.",
    url: "https://zkbtc.org/",
    thumbnailImage: "/community-projects/zk-poker.png",
  },
  {
    title: "0xRamp Labs",
    description:
      "Infrastructure and tooling lab building on-ramp and off-ramp solutions for the Zcash ecosystem.",
    url: "https://0xramplabs.com",
    thumbnailImage: "/community-projects/0xramp-labs.png",
  },
  {
    title: "ZcashToCash",
    description:
      "A service that makes it easier to convert Zcash to fiat through peer-to-peer payment rails.",
    url: "https://zcashto.cash",
    thumbnailImage: "/community-projects/zcashtocash.png",
  },

  // Organizations & Labs
  {
    title: "Shielded Labs",
    description:
      "Independent, donation-funded Zcash support organization based in Switzerland. The first organization in the ecosystem that has never received Development Fund or block reward funding.",
    url: "https://shieldedlabs.net/",
    thumbnailImage: "/community-projects/Sl.png",
  },
  {
    title: "Cypherpunk",
    description:
      "Company dedicated to privacy, self-sovereignty, and cypherpunk values. Builds tools for individuals who need to protect their digital lives.",
    url: "https://cypherpunk.com/",
    thumbnailImage: "/community-projects/cypherPunk.png",
  },
  {
    title: "Zcash Labs",
    description:
      "Research and development organization contributing to Zcash protocol advancement and ecosystem growth.",
    url: "https://zecashlabs.com",
    thumbnailImage: "/community-projects/zcash-labs.png",
  },
];