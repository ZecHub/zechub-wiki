export interface Exchange {
  name: string;
  url: string;
  pairs: string;
  support: string;
  depositTime: string;
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
    // logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
    logo: "https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg",
    altText: "Binance Logo",
  },
  {
    name: "Bitfinex",
    url: "https://bitfinex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "25 Minutes",
    logo: "https://upload.wikimedia.org/wikipedia/en/4/41/Bitfinex_Logo_light.svg",
    altText: "Bitfinex Logo",
  },
  {
    name: "Coinbase",
    url: "https://coinbase.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "150 minutes",
    logo: "https://i.ibb.co/XWkqhdY/coinbase.png",
    altText: "Coinbase Logo",
  },
  {
    name: "Gemini",
    url: "https://gemini.com",
    pairs: "ALL/ZEC",
    support: "Transparent | Shielded Withdrawal",
    depositTime: "50 Minutes",
    logo: "https://logos-world.net/wp-content/uploads/2023/12/Gemini-Symbol.png",
    altText: "Gemini Custodian Exchange Logo",
  },
  {
    name: "Huobi",
    url: "https://huobi.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "35 Minutes",
    logo: "https://seeklogo.com/images/H/huobi-global-logo-82DAA48E43-seeklogo.com.png",
    altText: "Huobi Logo",
  },
  {
    name: "Kraken",
    url: "https://kraken.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "60 minutes",
    logo: "https://assets.kraken.com/marketing/static/kraken-logo.jpg",
    altText: "Kraken Logo",
  },
  {
    name: "KuCoin",
    url: "https://kucoin.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "20 Minutes",
    logo: "https://www.svgrepo.com/show/331460/kucoin.svg",
    altText: "KuCoin Logo",
  },
  {
    name: "OKEx",
    url: "https://okex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "25 Minutes",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/Official_logo_of_OKEx.png",
    altText: "OKEx Logo",
  },
  {
    name: "CoinEx",
    url: "https://www.coinex.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "15 Minutes",
    logo: "https://logowik.com/content/uploads/images/coinex9788.jpg",
    altText: "CoinEx Logo",
  },
  {
    name: "Bybit",
    url: "https://www.bybit.com",
    pairs: "ALL/ZEC",
    support: "Transparent",
    depositTime: "30 Minutes",
    logo: "https://logowik.com/content/uploads/images/t_bybit5549.jpg",
    altText: "Bybit Logo",
  },
];

export default exchanges;
