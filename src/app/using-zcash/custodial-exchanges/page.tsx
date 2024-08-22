import React from 'react';

interface Exchange {
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
    name: 'Binance',
    url: 'https://binance.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent (TEX Address Deposit)',
    depositTime: '20 minutes',
    logo: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
    altText: 'Binance Logo',
  },
  {
    name: 'Bitfinex',
    url: 'https://bitfinex.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '25 Minutes',
    logo: 'https://upload.wikimedia.org/wikipedia/en/4/41/Bitfinex_Logo_light.svg',
    altText: 'Bitfinex Logo',
  },
  {
    name: 'Coinbase',
    url: 'https://coinbase.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '150 minutes',
    logo: 'https://i.ibb.co/XWkqhdY/coinbase.png',
    altText: 'Coinbase Logo',
  },
  {
    name: 'Gemini',
    url: 'https://gemini.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent | Shielded Withdrawal',
    depositTime: '50 Minutes',
    logo: 'https://logos-world.net/wp-content/uploads/2023/12/Gemini-Symbol.png',
    altText: 'Gemini Custodian Exchange Logo',
  },
  {
    name: 'Huobi',
    url: 'https://huobi.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '35 Minutes',
    logo: 'https://seeklogo.com/images/H/huobi-global-logo-82DAA48E43-seeklogo.com.png',
    altText: 'Huobi Logo',
  },
  {
    name: 'Kraken',
    url: 'https://kraken.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '60 minutes',
    logo: 'https://assets.kraken.com/marketing/static/kraken-logo.jpg',
    altText: 'Kraken Logo',
  },
  {
    name: 'KuCoin',
    url: 'https://kucoin.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '20 Minutes',
    logo: 'https://www.svgrepo.com/show/331460/kucoin.svg',
    altText: 'KuCoin Logo',
  },
  {
    name: 'OKEx',
    url: 'https://okex.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '25 Minutes',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Official_logo_of_OKEx.png',
    altText: 'OKEx Logo',
  },
  {
    name: 'CoinEx',
    url: 'https://www.coinex.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '15 Minutes',
    logo: 'https://logowik.com/content/uploads/images/coinex9788.jpg',
    altText: 'CoinEx Logo',
  },
  {
    name: 'Bybit',
    url: 'https://www.bybit.com',
    pairs: 'ALL/ZEC',
    support: 'Transparent',
    depositTime: '30 Minutes',
    logo: 'https://logowik.com/content/uploads/images/t_bybit5549.jpg',
    altText: 'Bybit Logo',
  }
];

interface ExchangeCardProps {
  name: string;
  url: string;
  pairs: string;
  support: string;
  depositTime: string;
  logo: string;
  altText: string;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({ name, url, pairs, support, depositTime, logo, altText }) => (
  <div className="bg-white shadow-md rounded-lg overflow-hidden">
    <div className="p-6 text-center">
      <a href={url} target="_blank" rel="noopener noreferrer">
        <img
          src={logo}
          alt={altText}
          className="mx-auto mb-4 object-contain"
          style={{ height: '160px' }}
        />
      </a>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{name}</h2>
      <p className="mb-4">
        <a href={url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
          Visit Website
        </a>
      </p>
      <p className="mb-2">Pairs: {pairs}</p>
      <p className="mb-2">Supports: {support}</p>
      <p>Deposit Time: {depositTime}</p>
    </div>
  </div>
);

const CustodialExchanges: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <a
        href="https://github.com/zechub/zechub/edit/main/site/Using_Zcash/Custodial_Exchanges.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="https://img.shields.io/badge/Edit-blue" alt="Edit Page" />
      </a>
      <h1 className="text-3xl font-bold mb-6 text-center">
        <img
          src="https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"
          alt="Alt Text"
          width="50"
          className="inline-block mr-2"
        />
        Custodial Exchanges
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchanges.map((exchange) => (
          <ExchangeCard
            key={exchange.name}
            name={exchange.name}
            url={exchange.url}
            pairs={exchange.pairs}
            support={exchange.support}
            depositTime={exchange.depositTime}
            logo={exchange.logo}
            altText={exchange.altText}
          />
        ))}
      </div>
    </div>
  );
};

export default CustodialExchanges;
