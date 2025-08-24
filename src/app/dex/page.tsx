import { Card } from "@/components/Card/Card";
import { decentralizedExchanges } from "@/constants/decentralizedExchanges";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = genMetadata({
  title: "Decentralised Exchanges",
  url: "https://zechub.wiki/using-zcash/dex",
});

const DecentralisedExchanges = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center my-12 flex-col lg:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-6 imd:mb-0 text-center">
          Decentralised Exchanges
        </h1>
        <div className="flex gap-4 mt-0 imd:mt-4 text-center flex-col items-center imd:flex-row">
          <Link
            href="/using-zcash/custodial-exchanges"
            className="inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
          >
            {/* <a className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'> */}
            Custodial Exchanges
            {/* </a> */}
          </Link>
          <Link
            href="/using-zcash/centralizedswaps"
            className="inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
          >
            {/* <a className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'> */}
            Centralised Swap platforms
            {/* </a> */}
          </Link>
        </div>
      </div>
      <p className="dark:text-slate-300 text-gray-600 text-lg my-12">
        ZecHub does not endorse any particular Decentralised Exchange service,
        please do your own research.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {decentralizedExchanges.map((itm, i) => (
          <Card
            thumbnailImage={itm.image}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={itm.title + "_" + Math.random() / i}
            ctaLabel="Read More"
          />
        ))}
      </div>
    </div>
  );
};

export default DecentralisedExchanges;
