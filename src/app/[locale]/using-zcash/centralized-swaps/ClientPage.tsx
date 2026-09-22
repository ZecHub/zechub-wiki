"use client";
import { Card } from "@/components/Card/Card";
import ExchangeTypeNav from "@/components/ExchangeTypeNav";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Venue } from "@/lib/parseVenueMarkdown";

const DEXListingClient = ({ venues }: { venues: Venue[] }) => {
  const { t } = useLanguage();
  const title = t?.pages?.dex?.centralizedTitle ?? "Centralized Swap Platforms";
  const disclaimer = t?.pages?.dex?.disclaimer ?? "ZecHub does not endorse any particular exchange service, please do your own research.";
  const cta = t?.common?.readMore ?? "Read More";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center my-12 flex-col imd:flex-row">
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
        {venues.map((itm) => (
          <Card
            thumbnailImage={itm.logo}
            description={itm.description ?? ""}
            title={itm.name}
            url={itm.url}
            key={itm.name}
            ctaLabel={cta}
          />
        ))}
      </div>
    </div>
  );
};

export default DEXListingClient;
