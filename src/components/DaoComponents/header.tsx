"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

const linkCls =
  "text-brand underline decoration-brand/40 underline-offset-[6px] transition-colors hover:decoration-brand dark:text-brand-soft dark:decoration-brand-soft/40 dark:hover:decoration-brand-soft";

export default function Header() {
  const { t } = useLanguage();

  const title = t?.dao?.headerTitle ?? "ZecHub DAO & Governance";
  const description =
    t?.dao?.headerDescription ??
    "An open source educational platform where community members collaborate on creating, validating, and promoting content that supports the Zcash ecosystem";

  return (
    <header className="border-b border-slate-200 pb-10 dark:border-white/10">
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <Image
          src="/dao-logo.png"
          alt="ZecHub DAO logo"
          width={80}
          height={80}
          priority
          className="h-20 w-20 shrink-0 rounded-2xl ring-1 ring-slate-200 dark:ring-white/10"
        />
        <h1 className="m-0 text-balance text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl dark:text-white">
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
      <p className="m-0 mt-6 max-w-3xl text-pretty text-base leading-7 text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </header>
  );
}
