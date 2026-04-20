import { Searcher } from "@/types"

export const searcher: Searcher[] = [

  // Start Here
  { name: 'Developer Resources', desc: 'Broad Overview of how Blockchains & Zcash works', url: '/start-here/developer-resources' },
  { name: 'Development Fund', desc: 'Zcash is a unique blockchain protocol because it is self-funded.', url: '/start-here/development-fund' },
  { name: 'Network Upgrades', desc: 'Learn about the history and progress of Zcash network upgrades.', url: '/start-here/network-upgrades' },
  { name: 'New User Guide', desc: 'This guide will walk you through getting onboarded as a Zcash user and ZEC holder.', url: '/start-here/new-user-guide' },
  { name: 'Using this Wiki', desc: 'Some of this might be overwhelming. We get it! There is a lot of information here.', url: '/start-here/using-this-wiki' },
  { name: 'What is ZEC', desc: 'ZEC is a digital currency that is based on the Zcash blockchain.', url: '/start-here/what-is-zec-and-zcash' },
  { name: 'What is ZecHub', desc: 'ZecHub is a decentralized education hub for Zcash.', url: '/start-here/what-is-zechub' },
  { name: 'ZEC Use Cases', desc: 'People use ZEC to transact efficiently and safely with low fees.', url: '/start-here/zec-use-cases' },
  { name: 'Zcash Basics', desc: `Zcash's monetary base is the same as Bitcoin's fixed supply of 21 million ZEC currency units.`, url: '/start-here/zcash-monetary-policy' },
  { name: 'Zcash Resources', desc: 'There are a number of resources that help users understand Zcash.', url: '/start-here/zcash-resources' },

  // Using Zcash
  { name: 'Zcash Block Explorers', desc: 'Blockchain explorers are simply tools that allow one to visualize what has already happened on a blockchain.', url: '/using-zcash/blockchain-explorers' },
  { name: 'Buying Zcash', desc: 'In order to use Zcash in private shielded transactions, you need to have ZEC', url: '/using-zcash/buying-zec' },
  { name: 'Faucets', desc: 'Faucets are services that dispense small amounts of cryptocurrency for free.', url: '/using-zcash/faucets' },
  { name: 'Memos', desc: 'When sending a Z2Z (shielded-to-shielded) transaction...', url: '/using-zcash/memos' },
  { name: 'Metamask Snap', desc: 'Use Zcash shielded transactions directly within MetaMask via the Zcash Snap.', url: '/using-zcash/metamask-snap' },
  { name: 'Mobile Top Ups', desc: 'Top up your mobile phone using ZEC through supported services.', url: '/using-zcash/mobile-top-ups' },
  { name: 'Payment Request URIs', desc: 'Learn how to create and use Zcash payment request URIs for seamless transactions.', url: '/using-zcash/payment-request-uris' },
  { name: 'Recovering Funds', desc: 'Learn how to recover funds from seed phrase or private key', url: '/using-zcash/recovering-funds' },
  { name: 'Value Pools', desc: 'There are currently 4 value pools in Zcash.', url: '/using-zcash/shielded-pools' },
  { name: 'Transactions', desc: 'ZEC is primarily used for payments...', url: '/using-zcash/transactions' },
  { name: 'Transparent Exchange Addresses', desc: 'Understand transparent exchange addresses and how they differ from shielded addresses in Zcash.', url: '/using-zcash/transparent-exchange-addresses' },

  // Guides
  { name: 'Akash Network', desc: 'Guide to using Zcash on the Akash decentralized cloud computing network.', url: '/guides/akash-network' },
  { name: 'Avalanche RedBridge', desc: 'Guide to bridging ZEC to the Avalanche network using RedBridge.', url: '/guides/avalanche-redbridge' },
  { name: 'Blockchain Explorers', desc: 'In the traditional business world every transaction includes a receipt for proof of purchase', url: '/guides/blockchain-explorers' },
  { name: 'Brave Wallet Guide', desc: 'How to use the Brave browser wallet with Zcash.', url: '/guides/brave-wallet-guide' },
  { name: 'BTCPayServer Zcash Plugin', desc: 'Accept Zcash payments using the BTCPayServer Zcash plugin.', url: '/guides/btcpayserver-zcash-plugin' },
  { name: 'Free2z Live', desc: 'Guide to using Free2z Live streaming features powered by Zcash.', url: '/guides/free2z-live' },
  { name: 'Keystone Zashi', desc: 'How to use the Keystone hardware wallet with the Zashi app.', url: '/guides/keystone-zashi' },
  { name: 'Maya Protocol', desc: 'Guide to swapping ZEC using the Maya Protocol decentralized exchange.', url: '/guides/maya-protocol' },
  { name: 'Nym VPN', desc: 'Enhance your privacy when using Zcash with the Nym VPN.', url: '/guides/nym-vpn' },
  { name: 'Raspberry Pi 4', desc: 'The purpose of this guide is to help educate Zcashers...', url: '/guides/raspberry-pi-4-full-node' },
  { name: 'Raspberry Pi 5 Zebra Lightwalletd Zingo', desc: 'Run a full Zcash node stack on a Raspberry Pi 5 with Zebra, Lightwalletd and Zingo.', url: '/guides/raspberry-pi5-zebra-lightwalletd-zingo' },
  { name: 'Using ZEC, privately', desc: 'As it currently stands, there are two addresses and transaction types in Zcash, shielded and transparent.', url: '/guides/using-zec-privately' },
  { name: 'Zcash in DeFi', desc: 'Zcash users are capable of leveraging Ethereum smart contracts and wider DeFi applications...', url: '/guides/using-zec-in-defi' },
  { name: 'Visualizing the Zcash Network', desc: 'Visual tools and guides for understanding the Zcash network topology and activity.', url: '/guides/visualizing-the-zcash-network' },
  { name: 'Visualizing Zcash Addresses', desc: `If you're learning about Zcash for the first time you will immediately.`, url: '/guides/visualizing-zcash-addresses' },
  { name: 'Zcash Devtool', desc: 'A guide to using the Zcash developer tool for building on the Zcash protocol.', url: '/guides/zcash-devtool' },
  { name: 'Zcash Improvement Proposals', desc: 'One of the most intriguing aspects of Decentralized Autonomous Organizations...', url: '/guides/zcash-improvement-proposals' },
  { name: 'Zenith Installation', desc: 'Step-by-step guide to installing and running the Zenith Zcash wallet.', url: '/guides/zenith-installation' },
  { name: 'Zingolib and Zaino Tutorial', desc: 'Developer tutorial for using the Zingolib and Zaino Zcash libraries.', url: '/guides/zingolib-and-zaino-tutorial' },
  { name: 'Zkool Multisig', desc: 'Guide to creating and managing Zcash multisig transactions using Zkool.', url: '/guides/zkool-multisig' },
  { name: 'Ywallet FROST Demo', desc: 'Demo walkthrough of FROST threshold signatures using the Ywallet app.', url: '/guides/ywallet-frost-demo' },
  { name: 'Zero Knowledge vs Decoy', desc: 'Certain crypto projects have gained recognition for their privacy-centric approaches.', url: '/guides/zero-knowledge-vs-decoys' },
  { name: 'Zgo Payment Processor', desc: 'Even though Payment processors are known for their services to facilitate transactions...', url: '/guides/zgo-payment-processor' },

  // Zcash Tech
  { name: 'Crosslink Protocol', desc: 'Learn about the Crosslink protocol enabling improved consensus in Zcash.', url: '/zcash-tech/crosslink-protocol' },
  { name: 'FROST', desc: 'Flexible Round-Optimized Schnorr Threshold Signatures', url: '/zcash-tech/frost' },
  { name: 'Full Nodes', desc: 'Full nodes validate transparent and shielded transactions on the Zcash network.', url: '/zcash-tech/full-nodes' },
  { name: 'Halo', desc: 'Halo is a trustless, recursive zero-knowledge proof ZKP discovered by Sean Bowe at Electric Coin Co.', url: '/zcash-tech/halo' },
  { name: 'Lightwallet Nodes', desc: 'Proofs are the basis for all mathematics.', url: '/zcash-tech/lightwallet-nodes' },
  { name: 'Pepper Sync', desc: 'Learn about Pepper Sync and its role in improving Zcash wallet synchronization.', url: '/zcash-tech/pepper-sync' },
  { name: 'Viewing Keys', desc: 'Shielded addresses enable users to transact while revealing as little information as possible on the Zcash blockchain.', url: '/zcash-tech/viewing-keys' },
  { name: 'Zaino', desc: 'Zaino is a Zcash indexer and lightwallet server implementation.', url: '/zcash-tech/zaino' },
  { name: 'Shielded Assets', desc: 'Zcash Shielded Assets ZSA are a proposed improvement to the the Zcash protocol that would enable the creation, transfer, and burn of custom assets on the Zcash chain.', url: '/zcash-tech/zcash-shielded-assets' },
  { name: 'Wallet Syncing', desc: 'To understand how warp sync works, let me explain a bit more about Zcash.', url: '/zcash-tech/zcash-wallet-syncing' },
  { name: 'Zebra Full Node', desc: 'Zebra is the Zcash Foundation\'s independent Zcash node implementation written in Rust.', url: '/zcash-tech/zebra-full-node' },
  { name: 'ZK-SNARKS', desc: 'Succinct Non-Interactive Argument of Knowledge', url: '/zcash-tech/zk-snarks' },

  // Zcash Organizations
  { name: 'Electric Coin Company', desc: 'We build and support Zcash to drive greater freedom and opportunity for everyone.', url: '/zcash-organizations/electric-coin-company' },
  { name: 'Financial Privacy Foundation', desc: 'The Financial Privacy Foundation advocates for financial privacy rights and supports Zcash adoption.', url: '/zcash-organizations/financial-privacy-foundation' },
  { name: 'Shielded Labs', desc: 'Shielded Labs was founded as a Swiss Association in December 2022', url: '/zcash-organizations/shielded-labs' },
  { name: 'Zcash Community Grants', desc: 'The Zcash Community Grants program funds independent teams entering the Zcash ecosystem', url: '/zcash-organizations/zcash-community-grants' },
  { name: 'Zcash Foundation', desc: `The essence of privacy itself is being able to choose what is or isn't shared with others.`, url: '/zcash-organizations/zcash-foundation' },
  { name: 'Zingo Labs', desc: 'Zingo Labs is a Zcash ecosystem development team building open-source wallet infrastructure.', url: '/zcash-organizations/zingo-labs' },
  { name: 'ZKAV Club', desc: 'ZKAV Club is a Zcash-focused audiovisual and media community.', url: '/zcash-organizations/zkav' },
  { name: 'ZODL', desc: 'ZODL is a Zcash ecosystem organization supporting development and adoption.', url: '/zcash-organizations/ZODL' },

  // Privacy Tools
  { name: '2FA Hardware Devices', desc: 'Data security and privacy are critical concerns for individuals and businesses alike.', url: '/privacy-tools/2fa-hardware-devices' },
  { name: 'Arti Tor', desc: 'Arti is a modern Rust implementation of Tor for enhanced privacy and anonymity.', url: '/privacy-tools/arti-tor' },
  { name: 'Graphene OS', desc: 'GrapheneOS is a non-profit, open-source project dedicated to enhancing privacy and security on mobile devices while maintaining compatibility with Android apps.', url: '/privacy-tools/grapheneos' },
  { name: 'Namada Protocol', desc: 'Namada Protocol serves as a Layer 1 platform based on proof-of-stake consensus, designed to provide interchain asset-agnostic privacy.', url: '/privacy-tools/namada-protocol' },
  { name: 'Penumbra', desc: 'Penumbra is a shielded, cross-chain decentralized exchange built for privacy-preserving DeFi.', url: '/privacy-tools/penumbra' },
  { name: 'PGP Encryption', desc: 'Learn how to use PGP encryption to secure your communications and data.', url: '/privacy-tools/pgp-encryption' },
  { name: 'Secure Messengers', desc: 'In view of the secure messengers, end-to-end encryption exists to be a security method that keeps a conversation secured.', url: '/privacy-tools/secure-messengers' },
  { name: 'Shade Protocol', desc: 'Shade Protocol is a suite of privacy-first DeFi products built on Secret Network.', url: '/privacy-tools/shade-protocol' },
  { name: 'Tor & I2P Technologies', desc: 'Tor is a proxy tool that ustilizes the Tor network to establish connections for applications.', url: '/privacy-tools/tor-and-i2p' },
  { name: 'VPN & dVPN', desc: 'Virtual Private Networks VPNs and decentralized VPNs dVPNs play a crucial role in safeguarding your online activities and data.', url: '/privacy-tools/vpn-and-dvpn' },
  { name: 'Web Browsers', desc: 'When selecting a web browser there are a few things to keep in mind: Security vulnerabilities and exploits are usually discovered regularly.', url: '/privacy-tools/web-browsers' },

  // Research
  { name: 'Dash Zcash Orchard Integration', desc: 'Research into the integration of Zcash Orchard shielded pool technology with the Dash blockchain.', url: '/research/dash-zcash-orchard-integration' },
  { name: 'Namada Privacy and Best Practices', desc: 'Research and best practices for using Namada Protocol for privacy-preserving transactions.', url: '/research/namada-privacy-and-best-practices' },
  { name: 'Navigating the Central Bank Digital Currency', desc: 'Research on CBDCs and their implications for financial privacy.', url: '/research/navigating-the-central-bank-digital-currency' },
  { name: 'Social Media Data Collection', desc: 'Currently, it is difficult to find a person who is not exposed to the reach of social networks.', url: '/research/social-media-data-collection' },
  { name: 'Track Early Onchain and Social Signals for Zcash', desc: 'Research into tracking on-chain and social signals to understand Zcash network activity.', url: '/research/track-early-onchain-and-social-signals-for-zcash' },
  { name: 'Zero Knowledge Asset Platforms', desc: 'Asset Platforms...', url: '/research/zk-shielded-asset-platforms' },

  // Zcash Community
  { name: 'Arborist Calls', desc: `The Zcash Arborist Calls are bi-weekly protocol development meetings...`, url: '/zcash-community/arborist-calls' },
  { name: 'Community Blogs', desc: `Here are some community submitted blogs. If you would like ZecHub to feature one of your blog posts.`, url: '/zcash-community/community-blogs' },
  { name: 'Community Links', desc: `The Zcash community is a vibrant and passion group of people working towards making ZEC...`, url: '/zcash-community/community-links' },
  { name: 'Projects', desc: `Zcash Community Projects...`, url: '/zcash-community/community-projects' },
  { name: 'Cypherpunk Zero', desc: `Cypherpunk Zero is a story telling series centered around Zero...`, url: '/zcash-community/cypherpunk-zero-nft' },
  { name: 'Community Advisory Panel', desc: `The Zcash Community Advisory Panel, or ZCAP, is a panel conformed...`, url: '/zcash-community/zcap' },
  { name: 'Zcash Ecosystem Security', desc: `This page serves as an overview of the Zcash ecosystem from a security auditor...`, url: '/zcash-community/zcash-ecosystem-security' },
  { name: 'Zcash Global Ambassadors', desc: `The Global Ambassador Program is designed to identify community members...`, url: '/zcash-community/zcash-global-ambassadors' },
  { name: 'Media', desc: `Our role in this collaborative effort is to educate, inspire, and excite current and future Zcashers`, url: '/zcash-community/zcash-media' },
  { name: 'Zcash Podcasts', desc: 'A collection of podcasts featuring Zcash community members and ecosystem updates.', url: '/zcash-community/zcash-podcasts' },
  { name: 'Zcon', desc: `Zcon is an annual conference organized by the Zcash Foundation...`, url: '/zcash-community/zcon-archive' },

  // ZFAV Club
  { name: 'ZFAV Club Background', desc: 'Supported by The Zcash Foundation this ambitious grassroots project aims...', url: '/zfav-club/av-club-background' },
  { name: 'Guides for Creators', desc: 'Guides for creators...', url: '/zfav-club/guides-for-creators' },
  { name: 'Youtube Channel', desc: 'Youtube Channel...', url: '/zfav-club/youtube-channel' },

  // Glossary & FAQs
  { name: 'FAQ', desc: 'A list of topics with the most frequently asked questions about Zcash.', url: '/glossary-and-faqs/faq' },
  { name: 'Gallery', desc: 'All our collection from Zechub', url: '/glossary-and-faqs/gallery' },
  { name: 'The Zcash Library', desc: 'Key Terms & Definitions related to Zcash', url: '/glossary-and-faqs/zcash-library' },

  // Contribute
  { name: 'Contributing Guide', desc: `If you're a member of the Zcash community, and want to contribute to building ZecHub...`, url: '/contribute/contributing-guide' },
  { name: 'Help Build ZecHub', desc: "If you're a member of the Zcash community, and want to contribute to building ZecHub, there are a few things that are super helpful.", url: '/contribute/help-build-zechub' },
  { name: 'ZecHub DAO', desc: 'The ZecHub DAO currently consists of...', url: '/contribute/zechub-dao' },
  { name: 'ZecWeekly Newsletter', desc: 'ZecWeekly is a newsletter that goes out every Friday morning.', url: '/contribute/zecweekly-newsletter' },

  // Standalone Pages
  { name: 'Brand', desc: 'ZecHub brand assets, logos, and guidelines.', url: '/brand' },
  { name: 'Dashboard', desc: 'Check the charts for ZEC', url: '/dashboard' },
  { name: 'DAO', desc: 'List of ZecHub DAO members', url: '/dao' },
  { name: 'DEX / Exchanges', desc: 'Decentralized and centralized exchanges where you can trade ZEC.', url: '/dex' },
  { name: 'Developers', desc: 'Resources and documentation for developers building on Zcash.', url: '/developers' },
  { name: 'Donation', desc: 'Support ZecHub by donating ZEC to help fund community education and development.', url: '/donation' },
  { name: 'Hackathon', desc: 'Earn ZEC in the first Zechub Hackathon', url: '/hackathon' },
  { name: 'SPEDN Map', desc: 'Find merchants and locations where you can spend ZEC near you.', url: '/map' },
  { name: 'Newsletter', desc: 'Subscribe to the ZecHub shielded newsletter for Zcash ecosystem updates.', url: '/newsletter' },
  { name: 'Payment Processors', desc: 'Explore payment processors that support Zcash for merchants and users.', url: '/payment-processors' },
  { name: 'Tutorials', desc: 'How to buy ZEC in Gemini', url: '/tutorials/buy-zec-in-gemini' },
  { name: 'Full Node Tutorials', desc: 'Full Nodes validate transparent and shielded transactions on the Network', url: '/tutorials/full-node-tutorials' },
  { name: 'Shielding ZEC', desc: 'This video was created to show users how to shield their ZEC.', url: '/tutorials/shielding-zec' },
  { name: 'Wallet Tutorials', desc: 'Below are a list of wallet tutorials that can help you get started with ZEC.', url: '/tutorials/wallet-tutorials' },
  { name: 'Wallets', desc: 'Compare and choose from the available Zcash wallets for desktop, mobile, and hardware.', url: '/wallets' },
  { name: 'Zcash Global Ambassadors', desc: 'Meet the Zcash Global Ambassadors representing their communities around the world.', url: '/zcash-global-ambassadors' },

]
