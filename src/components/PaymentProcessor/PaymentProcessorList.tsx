"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface PaymentProcessor {
  name: string;
  url: string;
  logoUrl: string;
  supportType: string;
  description: string;
}

interface PaymentProcessorListProps {
  allProcessors: PaymentProcessor[];
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const PaymentProcessorList: React.FC<PaymentProcessorListProps> = ({ allProcessors }) => {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {allProcessors.map((processor, index) => {
        const host = hostOf(processor.url);
        const shielded = processor.supportType.includes("Shielded");
        const logo = processor.logoUrl
          ? processor.logoUrl.startsWith("http") || processor.logoUrl.startsWith("/")
            ? processor.logoUrl
            : `/images/processors/${processor.logoUrl}`
          : "";
        return (
          <article
            key={index}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
          >
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-1.5 ring-1 ring-slate-200 dark:bg-white/[0.06] dark:ring-white/10">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={`${processor.name} logo`}
                        width={48}
                        height={48}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span aria-hidden="true" className="text-lg font-semibold text-brand">
                        {processor.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="m-0 wrap-break-word text-lg font-semibold leading-tight text-slate-900 dark:text-white">
                      {processor.name}
                    </h3>
                    {host && <p className="m-0 mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{host}</p>}
                  </div>
                </div>
                <a
                  href={processor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${processor.name} (opens in a new tab)`}
                  className="inline-flex shrink-0 items-center gap-1 self-start whitespace-nowrap rounded-lg border border-brand/50 px-3.5 py-1.5 text-sm font-semibold text-brand no-underline transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white"
                >
                  Open
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <p className="mb-0 mt-4 min-w-0 wrap-break-word text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {processor.description}
              </p>
            </div>

            <div className="border-t border-slate-200 px-4 py-3 dark:border-white/10">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                Support
              </p>
              <span
                className={`inline-block rounded-full border px-2.5 py-0.5 text-[13px] ${
                  shielded
                    ? "border-brand/50 bg-brand/10 text-brand dark:text-brand-soft"
                    : "border-slate-300 bg-slate-200 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
                }`}
              >
                {processor.supportType}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default PaymentProcessorList;
