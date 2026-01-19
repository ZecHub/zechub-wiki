export interface Slide {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    content: string[];
    image?: string;
    category: 'why' | 'where' | 'special' | 'accept';
  }
  
  export const PAYMENT_SLIDES: Slide[] = [
    {
      id: 0,
      title: "Why Pay with Zcash?",
      subtitle: "Privacy-First Digital Cash",
      description: "Enhanced privacy, security, and accessibility for everyday transactions",
      category: "why",
      content: [
        "Enhanced Privacy: Zcash uses zk-SNARKs for shielded transactions, keeping your financial details private unlike transparent blockchains like Bitcoin.",
        "Security: Verifies transactions anonymously, providing more security for users.",
        "Low Fees and Fast Transactions: Efficient for everyday payments with low costs.",
        "Accessibility: Use it for purchases from bagels to vacations, sending money overseas, or donations.",
        "Regulatory Compliance: Balances privacy with the ability to comply with regulations when needed.",
        "Digital Cash: Acts as private, fast, and flexible digital money for the modern age."
      ],
      image: "https://substackcdn.com/image/fetch/w_1200,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F985d7d20-12b9-4016-8463-3d83a1bb4dd5_1200x627.jpeg"
    },
    {
      id: 1,
      title: "Paywithz.cash Directory",
      subtitle: "Global Merchant Network",
      description: "Discover hundreds of merchants worldwide accepting Zcash payments",
      category: "where",
      content: [
        "Paywithz.cash is a directory of merchants accepting Zcash.",
        "Examples include: Open Library, Cryptothreadz, Ulta Beauty, La Maison Navarre, La Pasta Seattle, Fym Hot Sauce, The Boba Shop, Pi Supply, Steambundle, Buybullion (NZ), 1.9 Bracelets France, Godark Bags, Njalla, and many more.",
        "Categories cover VPNs, hosting, art, clothing, donations to organizations like EFF, Tor Project, Wikileaks, and various online stores.",
        "Use your Zcash wallet to pay directly at these merchants for privacy-preserving transactions."
      ],
      image: "https://nowpayments.io/blog/nowpayments-content/uploads/2022/08/ZEC.png"
    },
    {
      id: 2,
      title: "Flexa in Zashi Wallet",
      subtitle: "Thousands of US Retailers",
      description: "Pay with ZEC at major brands using Flexa integration",
      category: "where",
      content: [
        "Zashi is a self-custody, Zcash-only shielded wallet.",
        "Integrated with Flexa, allowing seamless ZEC payments at thousands of US retailers.",
        "Examples: Lowe's, Nordstrom, Baskin Robbins, Chipotle, Barnes & Noble, GameStop, Regal Movies, Office Depot, Sheetz, and more.",
        "Flexa provides fast, fraud-proof payments; use the app to pay in-person or online where Visa is accepted via services like Moon.",
        "First non-custodial wallet to support Flexa, enhancing real-world usability of Zcash."
      ],
      image: "https://global.discourse-cdn.com/zcash/optimized/3X/c/8/c82e18d4d291095cddf1314751578df78fc1a88f_2_624x427.jpeg"
    },
    {
      id: 3,
      title: "Nym VPN & Coincards",
      subtitle: "Privacy Services & Gift Cards",
      description: "Special privacy-focused services accepting shielded ZEC",
      category: "special",
      content: [
        "Nym VPN: Privacy-focused VPN using mixnet for network-level anonymity. Accepts shielded ZEC payments via BTCPayServer for unlinkable, private subscriptions.",
        "Pay with Zcash to maintain full privacy; supports zero-knowledge proofs to separate payment from usage.",
        "Coincards: Service since 2014 for buying gift cards, paying bills, or topping up mobiles with crypto.",
        "Accepts Zcash (shielded) alongside Bitcoin and others; redeem at major brands like Uber, Google Play, PSN, Xbox, Steam, Best Buy, Starbucks.",
        "Non-custodial options available; great for everyday spending."
      ],
      image: "https://strapi-www-nym-com-production.sos-ch-dk-2.exo.io/Swapper_hero_257aa2a16f.png"
    },
    {
      id: 4,
      title: "BTCPay Server & ZGo",
      subtitle: "Accept ZEC Payments",
      description: "Non-custodial payment solutions for merchants and vendors",
      category: "accept",
      content: [
        "BTCPay Server: Open-source, self-hosted payment processor. Non-custodial, supports Zcash via plugin for shielded payments.",
        "Easy integration for stores; no fees, direct to wallet. Used by many merchants; supports multiple cryptos.",
        "ZGo: Electronic payment software for point-of-sale. Turns any device into a Zcash register.",
        "Non-custodial, uses shielded transactions; simple for vendors to accept ZEC in-person or online. Create invoices, e-commerce shops; private and direct payments."
      ],
      image: "https://docs.btcpayserver.org/assets/img/3.0a39c840.jpg"
    }
  ];