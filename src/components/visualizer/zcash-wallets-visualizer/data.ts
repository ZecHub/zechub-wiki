import { Wallet } from './types';

export const mobileWallets: Wallet[] = [
  { 
    name: 'Zashi', 
    logo: '/wallets/zashi.png', 
    features: ['Tor Privacy', 'Near DEX Swaps', 'Flexa Payments'], 
    link: 'https://electriccoin.co/zashi/', 
    color: 'from-blue-500 to-cyan-500' 
  },
  { 
    name: 'Ywallet', 
    logo: '/wallets/ywallet.png', 
    features: ['Multiple Accounts', 'Pool Transfer', 'Cold Storage'], 
    link: 'https://ywallet.app', 
    color: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'Zingo!', 
    logo: '/wallets/zingo.png', 
    features: ['Financial Insights', 'PepperSync', 'Unified Addresses'], 
    link: 'https://zingolabs.org', 
    color: 'from-yellow-500 to-orange-500' 
  },
  { 
    name: 'Edge', 
    logo: '/wallets/edge.png', 
    features: ['Multi-Coin', 'Auto Shielding', 'Spend Before Sync'], 
    link: 'https://edge.app', 
    color: 'from-green-500 to-emerald-500' 
  },
  { 
    name: 'Unstoppable', 
    logo: '/wallets/unstoppable.png', 
    features: ['Maya Swaps', 'Multi-Coin', 'Unified Addresses'], 
    link: 'https://unstoppable.money', 
    color: 'from-indigo-500 to-blue-500' 
  }
];

export const desktopWallets: Wallet[] = [
  { 
    name: 'Ywallet', 
    logo: '/wallets/ywallet.png', 
    features: ['WarpSync', 'Voting', 'Viewing Keys'], 
    link: 'https://ywallet.app', 
    color: 'from-purple-500 to-pink-500' 
  },
  { 
    name: 'Zingo!', 
    logo: '/wallets/zingo.png', 
    features: ['Desktop Support', 'Financial Insights', 'Address Book'], 
    link: 'https://zingolabs.org', 
    color: 'from-yellow-500 to-orange-500' 
  },
  { 
    name: 'eZcash', 
    logo: '/wallets/ezcash.png', 
    features: ['Windows Support', 'Auto Shielding', 'Address Check'], 
    link: 'https://ezcash.app', 
    color: 'from-teal-500 to-cyan-500' 
  },
  { 
    name: 'Zenith', 
    logo: '/wallets/zenith.png', 
    features: ['Full Node', 'Graphical Interface', 'Shielded Memo'], 
    link: 'https://zenith.zcash', 
    color: 'from-orange-500 to-red-500' 
  },
  { 
    name: 'Zcashd', 
    logo: '/wallets/zcashd.png', 
    features: ['Command Line', 'Full Node', 'JSON-RPC'], 
    link: 'https://z.cash/download', 
    color: 'from-gray-500 to-slate-500' 
  }
];

export const webWallets: Wallet[] = [
  { 
    name: 'Brave Wallet', 
    logo: '/wallets/brave.png', 
    features: ['Browser Built-in', 'Orchard Support', 'Spend Before Sync'], 
    link: 'https://brave.com/wallet/', 
    color: 'from-orange-500 to-red-500' 
  },
  { 
    name: 'MetaMask Snap', 
    logo: '/wallets/metamask.png', 
    features: ['MetaMask Extension', 'Unified Addresses', 'Multi-Chain'], 
    link: 'https://snaps.metamask.io/', 
    color: 'from-orange-400 to-amber-500' 
  },
  { 
    name: 'Vultisig', 
    logo: '/wallets/vultisig.png', 
    features: ['Multi-Platform', 'Web App', 'Transparent Support'], 
    link: 'https://vultisig.com', 
    color: 'from-violet-500 to-purple-500' 
  }
];