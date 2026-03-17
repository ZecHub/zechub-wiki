import ExchangeCard from "@/components/ExchangeCard/ExchangeCard";
import exchanges from "@/constants/exchange";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = genMetadata({
  title: "Custodial Exchanges",
  url: "https://zechub.wiki/using-zcash/custodial-exchanges",
});

const CustodialExchanges: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center my-6 flex-col md:flex-row gap-4">
        <h1 className="flex justify-center items-center text-3xl font-bold mb-4 md:mb-0 text-center">
          <Image
            src="https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"
            alt="Zcash Logo"
            width={50}
            height={50}
            className="inline-block mr-3"
          />
          Custodial Exchanges
        </h1>

        <Link
          href="/dex"
          className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm"
        >
          DEX platforms
        </Link>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl">
        Centralized exchanges where you can buy, sell, and trade Zcash (ZEC). 
        These are custodial services — you do not control your private keys.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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