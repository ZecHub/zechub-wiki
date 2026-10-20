"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const platforms = [
  {
    name: "DAO DAO",
    alt: "DAODAO",
    img: "/daodao.jpg",
    href: "https://daodao.zone/dao/juno1nktrulhakwm0n3wlyajpwxyg54n39xx4y8hdaqlty7mymf85vweq7m6t0y/proposals",
    host: "daodao.zone",
  },
  {
    name: "Snapshot",
    alt: "Ethereum DAO",
    img: "/snapshot.jpg",
    href: "https://snapshot.org/#/zechubdao.eth",
    host: "snapshot.org",
  },
];

export default function GovernanceSection() {
  const { t } = useLanguage();

  const heading = t?.dao?.governanceHeading ?? "Governance";
  const description =
    t?.dao?.governanceDescription ??
    "All DAO proposals are public and transparent. Anyone can create a proposal to vote on. In support of community transparency, ZecHub DAO posts all governance proposals in the Zcash Community Forum ZecHub Governance thread.";

  return (
    <section className="space-y-6 border-t border-slate-200 pt-10 dark:border-white/10">
      <div>
        <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900 md:text-[1.75rem] dark:text-white">
          {heading}
        </h2>
        <p className="m-0 mt-3 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p>
      </div>

      <div className="!mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {platforms.map((p) => (
          <Link
            key={p.name}
            href={p.href}
            target="_blank"
            className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 no-underline transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
          >
            <span className="flex min-w-0 items-center gap-3">
              <Image
                className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-white/10"
                src={p.img}
                alt={p.alt}
                width={48}
                height={48}
              />
              <span className="min-w-0">
                <span className="block text-lg font-semibold leading-tight text-slate-900 dark:text-white">{p.name}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{p.host}</span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-brand/50 px-3.5 py-1.5 text-sm font-semibold text-brand transition-colors group-hover:border-brand group-hover:bg-brand/10 dark:text-brand-soft">
              Vote
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
