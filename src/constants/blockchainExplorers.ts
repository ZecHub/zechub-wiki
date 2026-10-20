export const blockchainExplorers = [
  {
    title: 'Zcash Block Explorer',
    description:
      "Nighthawk's open-source Zcash explorer, successor of zcashblockexplorer.com. Blocks, transactions and mempool, network nodes, and tools to broadcast a transaction, verify a payment disclosure and view transactions with a viewing key. No trackers.",
    features: [
      'No tracker',
      'Mainnet',
      'Viewing key and payment disclosure tools',
      'Broadcast transaction',
      'Network nodes',
    ],
    url: 'https://mainnet.zcashexplorer.app/',
    thumbnailImage: '/explorer/zcashexplorer-app.png',
  },
  {
    title: '3xpl',
    description:
      'A fast multi-chain explorer with a Zcash section: blocks, transactions, addresses, balances and mempool. Built for developers and analysts too, with JSON and WebSocket APIs, downloadable data dumps and an online ClickHouse database.',
    features: [
      'Multi-chain explorer',
      'Blocks, transactions, addresses',
      'JSON and WebSocket APIs',
      'Data dumps and ClickHouse',
    ],
    url: 'https://3xpl.com/zcash',
    thumbnailImage: '/explorer/3xpl.png',
  },
  {
    title: 'ZecBlock',
    description:
      'Zcash block explorer and privacy analytics, formerly CipherScan (old cipherscan.app links redirect here). Blocks, transactions, addresses and mempool, plus shielded pool and Ironwood data, privacy analytics, developer tools and an API. Ask ZecBlock (beta) answers questions from indexed public chain data.',
    features: [
      'Formerly CipherScan',
      'Shielded pools and Ironwood',
      'Privacy analytics and network pulse',
      'Decode, broadcast, decrypt memo',
      'Mainnet, testnet and Crosslink',
      'Public API',
    ],
    url: 'https://zecblock.com/',
    thumbnailImage: '/explorer/zecblock.png',
  },
  {
    title: 'ShieldedScan',
    description:
      'A privacy-first Zcash block explorer where shielded activity is a first-class citizen. Tracks shielded supply across Ironwood, Orchard, Sapling and Sprout, cross-chain swaps (NEAR Intents, Maya Protocol), reorgs and network stats. Includes Zeno, an AI assistant for chain data, a free keyless API and an MCP server. Open source (AGPL-3.0).',
    features: [
      'No tracker',
      'Mainnet and testnet',
      'Sprout, Sapling, Orchard, Ironwood',
      'Cross-chain swaps',
      'Free and keyless API, MCP server',
      'Self-hostable',
    ],
    url: 'https://shieldedscan.xyz/',
    thumbnailImage: '/explorer/shieldedscan-logo.png',
  },
  {
    title: 'BlockExplorer.one',
    description:
      'A multi-chain explorer covering about ten blockchains, including Zcash mainnet and testnet: latest blocks and transactions, fee estimates and market data. Address pages show the last 14 days of transactions; full history needs its Address History APIs.',
    features: [
      'Mainnet and testnet',
      'Fee estimates',
      'Broadcast signed transactions',
      'Multiple blockchains',
    ],
    url: 'https://blockexplorer.one/zcash/mainnet',
    thumbnailImage: '/explorer/blockexplorer-one.png',
  },
  {
    title: 'zcashinfo.com',
    description:
      'Zcash blockchain explorer featuring block details, transaction lookup, address search, network statistics, value pool distribution, and mempool monitoring.',
    features: [
      'Block explorer',
      'Transaction lookup',
      'Address search',
      'Network statistics',
      'Value pool distribution',
      'Mempool monitoring',
    ],
    url: 'https://zcashinfo.com/',
    thumbnailImage: '/explorer/zcashinfo.png',
  },
  {
    title: 'ZEC-OS',
    description:
      'A Zcash explorer built for a privacy chain, inside a browser desktop: every result opens in its own window. Decodes Unified Addresses into their transparent, Sapling and Orchard receivers, shows memos on shielded transactions you can view, and names the mining pool behind each block.',
    features: [
      'Unified Address decoder',
      'Shielded memos (when yours to see)',
      'Miner identity per block',
      'Block Map and Chain Pulse visuals',
      'Jump to landmark blocks',
      'Mainnet and testnet, mempool viewer',
    ],
    url: 'https://www.zec-os.com/explorer',
    thumbnailImage: '/explorer/zec-os.png',
  },
  {
    title: 'Zexplorer (in development)',
    description:
      'A Zcash-only explorer and public API (Zinder) that is precise about what public chain data can show and what is private by design. In development: testnet works, mainnet pages and API calls are not reliable yet.',
    features: ['Testnet live, mainnet in development', 'Blocks, transactions, mempool', 'Chain reorg history', 'Public REST API with freshness data', 'ZIP-311 payment disclosure check'],
    url: 'https://zexplorer.app/testnet/',
    thumbnailImage: '/explorer/zexplorer.png',
  },
  {
    title: 'Zecstats (analytics, not an explorer)',
    description:
      'A Zcash analytics dashboard (no block or transaction search) with real-time network statistics, privacy analytics, market insights, and interactive data visualization.',
    features: ['Real-Time Zcash Network Dashboard', 'Advanced On-Chain Analytics', 'Privacy & Shielded Pool Analytics', 'Market & Price Analysis', 'Mining & Network Security Monitoring', 'Interactive Data Visualization', 'Ecosystem & Liquidity Tracking', 'Network Comparison & Growth Analysis'],
    url: 'https://zecstats.com/',
    thumbnailImage: '/explorer/zecstats.png',
  },
];
