"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";

// Segmented switch between the three exchange directories. The current page is
// highlighted; the others are quiet text links.
export default function ExchangeTypeNav() {
  const { t } = useLanguage();
  const pathname = usePathname() ?? "";
  const items = [
    { href: "/dex", label: t?.pages?.dex?.title ?? "DEX platforms" },
    {
      href: "/using-zcash/custodial-exchanges",
      label: t?.pages?.dex?.custodial ?? "Custodial Exchanges",
    },
    {
      href: "/using-zcash/centralized-swaps",
      label: t?.pages?.dex?.centralised ?? "Centralised Swap platforms",
    },
  ];

  return (
    <nav
      aria-label="Exchange types"
      className="inline-flex max-w-full flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-50/60 p-1 dark:border-white/10 dark:bg-white/[0.03]"
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.endsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              active
                ? "bg-brand/10 text-brand dark:bg-brand/20 dark:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
