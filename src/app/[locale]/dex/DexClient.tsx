"use client";

import { Card } from "@/components/Card/Card";
import ExchangeTypeNav from "@/components/ExchangeTypeNav";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import type { Venue } from "@/lib/parseVenueMarkdown";

export default function DexClient({ venues }: { venues: Venue[] }) {
  const { t } = useLanguage();
  const heading = t?.pages?.dex?.title ?? "Decentralised Exchanges";
  const paragraph =
    t?.pages?.dex?.subtitle ??
    "ZecHub does not endorse any particular Decentralised Exchange service, please do your own research.";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center my-12 flex-col lg:flex-row">
        <h1 className="flex justify-center items-center text-2xl imd:text-3xl font-bold mb-6 imd:mb-0 text-center">
          <Image
            src={"/content-images/image-2024-02-03-173258092-a5440e5ee2.webp"}
            alt={t?.pages?.dex?.imageAlt ?? "Alt Text"}
            width={50}
            height={50}
            className="inline-block mr-2"
          />
          {heading}
        </h1>
        <ExchangeTypeNav />
      </div>
      <p className="dark:text-slate-300 text-gray-600 text-lg my-12">{paragraph}</p>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {venues.map((itm) => (
          <Card
            thumbnailImage={itm.logo}
            description={itm.description ?? ""}
            title={itm.name}
            url={itm.url}
            key={itm.name}
            ctaLabel={t?.common?.readMore ?? "Read More"}
          />
        ))}
      </div>
    </div>
  );
}
