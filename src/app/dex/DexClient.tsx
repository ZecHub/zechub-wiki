"use client";

import Link from "next/link";
import { Card } from "@/components/Card/Card";
import { decentralizedExchanges } from "@/constants/decentralizedExchanges";
import { useLanguage } from '@/context/LanguageContext';

export default function DexClient() {
  const { t } = useLanguage();
  const heading = t?.pages?.dex?.title ?? "Decentralised Exchanges";
  const paragraph =
    t?.pages?.dex?.subtitle ??
    "ZecHub does not endorse any particular Decentralised Exchange service, please do your own research.";
  const custodialLabel = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const centralisedLabel = t?.pages?.dex?.centralised ?? "Centralised Swap platforms";

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center my-12 flex-col lg:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-6 imd:mb-0 text-center">
          {heading}
        </h1>
        <div className="flex gap-4 mt-0 imd:mt-4 text-center flex-col items-center imd:flex-row">
          <Link
            href="/using-zcash/custodial-exchanges"
            className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm"
          >
            {custodialLabel}
          </Link>
          <Link
            href="/using-zcash/centralizedswaps"
            className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm"
          >
            {centralisedLabel}
          </Link>
        </div>
      </div>
      <p className="dark:text-slate-300 text-gray-600 text-lg my-12">{paragraph}</p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {decentralizedExchanges.map((itm, i) => (
          <Card
            thumbnailImage={itm.image}
            description={itm.description}
            title={itm.title}
            url={itm.url}
            key={itm.title + "_" + Math.random() / i}
            ctaLabel={t?.common?.readMore ?? "Read More"}
          />
        ))}
      </div>
    </div>
  );
}
