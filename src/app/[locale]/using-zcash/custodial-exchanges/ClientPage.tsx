"use client";
import { ArrowUpRight } from "lucide-react";
import ExchangeTypeNav from "@/components/ExchangeTypeNav";
import { useLanguage } from "@/context/LanguageContext";
import VenueIcon from "@/components/VenueIcon";
import { venueIcon } from "@/lib/venueIcons";
import type { Venue } from "@/lib/parseVenueMarkdown";

const clean = (v?: string) => (v && !/^not stated\.?$/i.test(v.trim()) ? v : undefined);

const CustodialExchangesClient = ({ venues }: { venues: Venue[] }) => {
  const { t } = useLanguage();
  const title = t?.pages?.dex?.custodial ?? "Custodial Exchanges";
  const disclaimer = t?.pages?.dex?.disclaimer ?? "ZecHub does not endorse any particular exchange service, please do your own research.";
  const cta = t?.common?.visitWebsite ?? "Visit website";

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-3 mt-0 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-4xl">
            {title}
          </h1>
          <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{disclaimer}</p>
        </div>
        <ExchangeTypeNav />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((ex) => {
          const rows: [string, string | undefined][] = [
            ["Pairs", clean(ex.pairs)],
            ["Supports", clean(ex.support)],
            ["Deposit time", clean(ex.depositTime)],
            ["Ironwood", clean(ex.ironwood)],
          ];
          return (
            <article
              key={ex.name}
              className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
            >
              <div className="flex items-center gap-3">
                <VenueIcon name={ex.name} icon={venueIcon(ex.name).icon} iconDark={venueIcon(ex.name).dark} />
                <h2 className="m-0 min-w-0 text-lg font-semibold leading-tight text-slate-900 dark:text-white">{ex.name}</h2>
              </div>
              <dl className="mb-0 mt-4 flex-1 divide-y divide-slate-200 border-t border-slate-200 text-[14px] leading-snug dark:divide-white/10 dark:border-white/10">
                {rows.map(([label, value]) =>
                  value ? (
                    <div key={label} className="py-2.5">
                      <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{label}</dt>
                      <dd className="m-0 mt-1 text-slate-800 dark:text-slate-100">{value}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
              <a
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${cta}: ${ex.name} (opens in a new tab)`}
                className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-brand-soft dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
              >
                {cta}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default CustodialExchangesClient;
