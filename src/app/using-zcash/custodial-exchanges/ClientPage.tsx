"use client";
import ExchangeCard from "@/components/ExchangeCard/ExchangeCard";
import exchanges from "@/constants/exchange";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const CustodialExchangesClient: React.FC = () => {
  const { t } = useLanguage();
  const title = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const dexLabel = t?.pages?.dex?.title ?? "DEX platforms";

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="w-[31px]">
      </div>

      <div className="flex justify-between items-center my-6 flex-col imd:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-4 imd:mb-0 text-center">
          <Image
            src={"https://i.ibb.co/bmS65xV/image-2024-02-03-173258092.png"}
            alt={t?.pages?.dex?.imageAlt ?? "Alt Text"}
            width={50}
            height={50}
            className="inline-block mr-2"
          />
          {title}
        </h1>

        <Link
          href="/dex"
          className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm"
        >
          {dexLabel}
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

export default CustodialExchangesClient;
