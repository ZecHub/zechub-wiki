export interface Exchange {
  name: string;
  url: string;
  pairs: string;
  support: string;
  depositTime: string;
  ironwood?: string;
  logo: string;
  altText: string;
}

const exchanges: Exchange[] = [
  {
    name: "Binance",
    url: "https://binance.com",
    pairs: "ALL/ZEC",
    support: "Transparent (TEX Address Deposit)",
    depositTime: "20 minutes",
    ironwood: "Not applicable, transparent addresses only",
    // logo: "/content-images/_unavailable.svg",
    logo: "/content-images/Binance-Icon-Logo.wine-b047212223.svg",
    altText: "Binance Logo",
  },
  {
    name: "Bitfinex",
    url: "https://bitfinex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "25 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/41/Bitfinex_Logo_light.svg",
    altText: "Bitfinex Logo",
  },
  {
    name: "Coinbase",
    url: "https://coinbase.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "150 minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/coinbase-8643659341.webp",
    altText: "Coinbase Logo",
  },
  {
    name: "Gemini",
    url: "https://gemini.com",
    pairs: "ALL/ZEC",
    support: "Transparent | Shielded and unified withdrawals, Orchard since November 2025",
    depositTime: "50 Minutes",
    ironwood: "Shielded withdrawals supported, pool not stated",
    logo: "/content-images/Gemini-Symbol-ddd31ee98b.webp",
    altText: "Gemini Custodian Exchange Logo",
  },
  {
    name: "HTX (former Huobi)",
    url: "https://htx.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "35 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/HTX_logo.png",
    altText: "HTX Logo",
  },
  {
    name: "Kraken",
    url: "https://kraken.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "60 minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/kraken-logo-7407ab477f.webp",
    altText: "Kraken Logo",
  },
  {
    name: "KuCoin",
    url: "https://kucoin.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "20 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/kucoin-ee0c21f9fd.svg",
    altText: "KuCoin Logo",
  },
  {
    name: "OKEx",
    url: "https://okex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "25 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Official_logo_of_OKEx.png",
    altText: "OKEx Logo",
  },
  {
    name: "CoinEx",
    url: "https://www.coinex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "15 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/coinex9788-d638d69e3b.webp",
    altText: "CoinEx Logo",
  },
  {
    name: "Bybit",
    url: "https://www.bybit.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "30 Minutes",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/t_bybit5549-0c17d6b645.webp",
    altText: "Bybit Logo",
  },
  {
    name: "Robinhood",
    url: "https://robinhood.com",
    pairs: "USD/ZEC | EUR/ZEC",
    support: "Withdrawals to transparent t-addresses only. ZEC deposits are not supported",
    depositTime: "Deposits not supported",
    ironwood: "Not applicable, transparent addresses only",
    logo: "/content-images/IMG-5725-7f964c1fdb.webp",
    altText: "Robinhood Logo",
  },
  {
    name: "Backpack",
    url: "https://backpack.exchange",
    pairs: "ZEC/USDC | ZEC-PERP",
    support: "Deposits and withdrawals enabled. Address types not stated",
    depositTime: "Not stated",
    ironwood: "Not stated",
    logo: "/content-images/_unavailable.svg",
    altText: "Backpack Logo",
  },
];

export default exchanges;
