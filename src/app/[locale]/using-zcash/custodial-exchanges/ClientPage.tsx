"use client";
import ExchangeCard from "@/components/ExchangeCard/ExchangeCard";
import exchanges from "@/constants/exchange";
import exchangesIt from "@/constants/exchange.it";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useLocale } from "next-intl";

const CustodialExchangesClient: React.FC = () => {
  const { t } = useLanguage();
  const locale = useLocale();
  const byLocale: Record<string, typeof exchanges> = { it: exchangesIt };
  const exchangeList = byLocale[locale] ?? exchanges;
  const title = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const dexLabel = t?.pages?.dex?.title ?? "DEX platforms";

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

        <Link
          href="/dex"
          className="inline-flex py-2 px-4 btn-brand focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-sm"
        >
          {dexLabel}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-6">
        {exchangeList.map((exchange) => (
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
