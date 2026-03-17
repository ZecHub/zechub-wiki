import { genMetadata } from "@/lib/helpers";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/Card/Card";
import { decentralizedExchanges } from "@/constants/decentralizedExchanges";

export const metadata: Metadata = genMetadata({
  title: "Decentralised Exchanges",
  url: "https://zechub.wiki/using-zcash/dex",
});

const DecentralisedExchanges = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center my-12 flex-col md:flex-row gap-6">
        <h1 className="flex justify-center items-center text-3xl font-bold mb-4 md:mb-0 text-center">
          <Image
            src="https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"
            alt="Zcash Logo"
            width={50}
            height={50}
            className="inline-block mr-3"
          />
          Decentralised Exchanges
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/using-zcash/custodial-exchanges"
            className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm text-center"
          >
            Custodial Exchanges
          </Link>
          <Link
            href="/using-zcash/centralizedswaps"
            className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm text-center"
          >
            Centralised Swap platforms
          </Link>
        </div>
      </div>

      <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-3xl mb-12">
        ZecHub does not endorse any particular Decentralised Exchange service.
        Please do your own research (DYOR).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {decentralizedExchanges.map((item) => (
          <Card
            key={item.title}
            thumbnailImage={item.image}
            description={item.description}
            title={item.title}
            url={item.url}
            ctaLabel="Visit DEX →"
          />
        ))}
      </div>
    </div>
  );
};

export default DecentralisedExchanges;