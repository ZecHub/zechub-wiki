"use client";

import ExchangeTypeNav from "@/components/ExchangeTypeNav";
import VenueCard from "@/components/VenueCard";
import { useLanguage } from "@/context/LanguageContext";
import { venueIcon } from "@/lib/venueIcons";
import type { Venue } from "@/lib/parseVenueMarkdown";

export default function DexClient({ venues }: { venues: Venue[] }) {
  const { t } = useLanguage();
  const heading = t?.pages?.dex?.title ?? "Decentralised Exchanges";
  const paragraph =
    t?.pages?.dex?.subtitle ??
    "ZecHub does not endorse any particular Decentralised Exchange service, please do your own research.";
  const cta = t?.common?.visitWebsite ?? "Visit website";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-3 mt-0 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {heading}
          </h1>
          <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{paragraph}</p>
        </div>
        <ExchangeTypeNav />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((itm) => (
          <VenueCard
            key={itm.name}
            name={itm.name}
            url={itm.url}
            icon={venueIcon(itm.name).icon}
            iconDark={venueIcon(itm.name).dark}
            description={itm.description ?? ""}
            ctaLabel={cta}
          />
        ))}
      </div>
    </div>
  );
}
