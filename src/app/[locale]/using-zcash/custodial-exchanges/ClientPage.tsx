"use client";
import ExchangeCard from "@/components/ExchangeCard/ExchangeCard";
import ExchangeTypeNav from "@/components/ExchangeTypeNav";
import Image from "next/image";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { Venue } from "@/lib/parseVenueMarkdown";

const CustodialExchangesClient: React.FC<{ venues: Venue[] }> = ({ venues }) => {
  const { t } = useLanguage();
  const title = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const disclaimer = t?.pages?.dex?.disclaimer ?? "ZecHub does not endorse any particular exchange service, please do your own research.";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-[31px]">
      </div>

      <div className="flex justify-between items-center my-6 flex-col imd:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-4 imd:mb-0 text-center">
          <Image
            src={"/content-images/image-2024-02-03-173258092-a5440e5ee2.webp"}
            alt={t?.pages?.dex?.imageAlt ?? "Alt Text"}
            width={50}
            height={50}
            className="inline-block mr-2"
          />
          {title}
        </h1>
        <ExchangeTypeNav />
         </div>
      <p className="dark:text-slate-300 text-gray-600 text-lg my-12">{disclaimer}</p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((exchange) => (
          <ExchangeCard
            key={exchange.name}
            name={exchange.name}
            url={exchange.url}
            pairs={exchange.pairs}
            support={exchange.support}
            depositTime={exchange.depositTime}
            ironwood={exchange.ironwood}
            logo={exchange.logo}
            altText={exchange.altText}
          />
        ))}
      </div>
    </div>
  );
};

export default CustodialExchangesClient;
