'use client';
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BiRightArrowAlt as Arrow,
  BiMenu as BurgerMenuIcon,
} from "react-icons/bi";
import { Icon } from "../UI/Icon";

interface MenuProps {
  folder: string;
  roots: string[];
  // Localized page titles for the active locale and English, path-keyed by the
  // site-relative page path (e.g. "guides/Foo.md"). Fetched server-side from the
  // content repo's menu-titles manifest and passed down (this is a client
  // component; see getMenuTitlesCached).
  titles?: Record<string, string>;
  enTitles?: Record<string, string>;
}

const normalize = (v: string) => decodeURIComponent(v).replace(/\/+$/, "").toLowerCase();

// One sidebar entry. The current page gets an accent bar and brand colour;
// everything else is plain text so the list stays calm to scan.
const NavItem = ({
  href,
  label,
  pathname,
}: {
  href: string;
  label: string;
  pathname: string;
}) => {
  const active = normalize(pathname).endsWith(normalize(href));
  return (
    <li>
      <Link
        href={`${href}#content`}
        aria-current={active ? "page" : undefined}
        className={`-ml-px block border-l-2 px-3 py-1.5 text-[13.5px] leading-snug transition-colors ${
          active
            ? "border-brand font-medium text-brand dark:text-brand-soft"
            : "border-transparent text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:text-slate-300 dark:hover:border-white/40 dark:hover:text-white"
        }`}
      >
        {label}
      </Link>
    </li>
  );
};

const SideMenu = ({ folder, roots, titles = {}, enTitles = {} }: MenuProps) => {
  const pathname = usePathname() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { t } = useLanguage();
  // Localized chrome label helper: prefer the curated menuLabels dict, fall
  // back to the English source name.
  const chromeLabel = (name: string) => t?.menuLabels?.[name] ?? name;
  // Localized display label for a side-menu item. `item` is the full item path
  // minus ".md" (e.g. "site/guides/Foo"); the manifest is keyed by the
  // site-relative path with ".md" (e.g. "guides/Foo.md"). Fallback order:
  // localized manifest -> English manifest -> filename-derived name. getName
  // stays the source of truth for icon/filter matching below.
  const menuLabel = (item: string) => {
    const key = item.replace(/^site\//, "") + ".md";
    const titled = titles[key] ?? enTitles[key];
    const fromFile = getName(item);
    // Manifest titles are often the page H1 and wrap the sidebar.
    // Prefer the short filename label when the title is much longer.
    if (titled && titled.length <= 36) return titled;
    return fromFile;
  };
  const root = roots.map((item) => item.slice(0, -3));
  const name = folder[0].toUpperCase() + folder.slice(1);
  const fold = getName(name);

  return (
    <div className="relative flex flex-wrap items-center lg:items-start order-1 justify-between lg:flex-col">
      <button onClick={toggleMenu} className="lg:hidden flex cursor-pointer">
        <BurgerMenuIcon size={24} />{" "}
        <h3 className="ms-2 font-bold">{t?.sideMenu?.navigation ?? "Navigation"}</h3>
      </button>

      <div className="flex justify-end lg:justify-center w-auto order-2 lg:order-3">
        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-1 rounded-lg border border-brand bg-brand px-4 py-2 text-center text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/40 dark:bg-brand/15 dark:text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
        >
          {t?.sideMenu?.explore ?? "Explore"}
          <Icon size={"medium"} icon={Arrow} />
        </Link>
      </div>

      <nav
        aria-label={chromeLabel(fold)}
        className={`w-full shrink-0 px-3 py-4 order-3 lg:order-2 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto ${
          isMenuOpen ? "block mt-7" : "hidden lg:block"
        }`}
      >
        <p className="mb-3 px-3 font-[family-name:var(--font-heading)] text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {chromeLabel(fold)}
        </p>
        <ul className="space-y-0.5 border-l border-slate-200 dark:border-white/10">
          {root.map((item: any, i: any) => {
            const itemName = getName(item);
            if (
              itemName === "Wallets" ||
              itemName === "Payment Processors" ||
              itemName === "Custodial Exchanges"
            )
              return null;
            return (
              <NavItem
                key={i}
                href={`/${transformGithubFilePathToWikiLink(item)}`}
                label={item ? menuLabel(item) : ""}
                pathname={pathname}
              />
            );
          })}
          {fold === "Using Zcash" && (
            <>
              <NavItem href="/wallets" label={chromeLabel("Wallets")} pathname={pathname} />
              <NavItem
                href="/using-zcash/custodial-exchanges"
                label={chromeLabel("Custodial Exchanges")}
                pathname={pathname}
              />
              <NavItem
                href="/payment-processors"
                label={chromeLabel("Payment Processors")}
                pathname={pathname}
              />
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default SideMenu;
