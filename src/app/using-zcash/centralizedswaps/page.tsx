import { Card } from "@/components/Card/Card";
import { dexListingConfig } from "@/constants/dex-listing-config";
import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = genMetadata({
  title: "Centralized Swap Platform Listing",
  url: "https://zechub.wiki/using-zcash/centralizedswaps",
});

const DEXListingPage = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center my-12 flex-col imd:flex-row">
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
          Centralized Swap Platforms
        </h1>
        <Link
          href="/dex"
          className="inline-flex py-2 px-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 rounded-lg"
        >
          {/* <a className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'> */}
          DEX platforms
          {/* </a> */}
        </Link>
      </div>
      <p className="dark:text-slate-300 text-gray-600 text-lg my-12">
        ZecHub does not endorse any particular exchange service, please do your
        own research.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dexListingConfig.map((itm, i) => (
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

export default DEXListingPage;
