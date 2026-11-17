"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const linkCls =
  "text-brand transition-colors hover:underline hover:decoration-brand/60 hover:underline-offset-8 dark:text-brand-soft";

export default function Header() {
  const { t } = useLanguage();

  const title = t?.dao?.headerTitle ?? "ZecHub DAO & Governance";
  const description =
    t?.dao?.headerDescription ??
    "An open source educational platform where community members collaborate on creating, validating, and promoting content that supports the Zcash ecosystem";

  return (
    <header className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-brand/[0.07] via-white to-white px-6 py-12 text-center shadow-sm md:px-12 md:py-16 dark:border-white/10 dark:from-brand/15 dark:via-[#0f172a] dark:to-[#0b1120] dark:shadow-2xl dark:shadow-black/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl dark:bg-brand/20"
      />
      <div className="relative flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-6">
        <Image
          src="/dao-logo.png"
          alt="ZecHub DAO logo"
          width={96}
          height={96}
          priority
          className="h-24 w-24 shrink-0 rounded-full ring-2 ring-brand/40 ring-offset-4 ring-offset-white dark:ring-offset-[#0f172a]"
        />
        <h1 className="m-0 text-balance text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl dark:text-white">
          {title.split(" ").slice(0, 1).join(" ")}{" "}
          <Link href="https://nym.com/blog/what-is-dao" target="_blank" className={linkCls}>
            DAO
          </Link>{" "}
          &{" "}
          <Link href="/governance-howto" target="_blank" className={linkCls}>
            {title.split(" ").slice(3).join(" ") || "Governance"}
          </Link>
        </h1>
      </div>
      <p className="relative m-0 mx-auto mt-8 max-w-2xl text-pretty text-base leading-7 text-slate-600 md:text-lg md:leading-8 dark:text-slate-300">
        {description}
      </p>
    </header>
  );
}
