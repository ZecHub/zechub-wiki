import ExchangeCard from "@/components/ExchangeCard/ExchangeCard";
import exchanges from "@/constants/exchange";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = genMetadata({
  title: "Custodial Exchanges",
  url: "https://zechub.wiki/using-zcash/custodial-exchanges",
});

const CustodialExchanges: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center my-6 flex-col imd:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-4 imd:mb-0 text-center">
          {/* <img
            src="https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"
            alt="Alt Text"
            width="50"
            className="inline-block mr-2"
            /> */}
          <Image
            src={"https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"}
            alt="Alt Text"
            width="50"
            height="50"
            className="inline-block mr-2"
          />
          Custodial Exchanges
        </h1>
        <Link
          href="/using-zcash/centralizedswaps"
          className="inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
        >
          {/* <a className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'> */}
          DEX platforms
          {/* </a> */}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-6">
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
