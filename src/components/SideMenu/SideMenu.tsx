'use client';
import { getName, transformGithubFilePathToWikiLink } from "@/lib/helpers";
import { Link } from "@/i18n/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Fragment, useState } from "react";
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

const DUPLICATE_BASICS_TITLES: Record<string, string> = {
  zec_use_cases: "ZEC Use Cases",
  zcash_monetary_policy: "Zcash Monetary Policy",
};

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
    // Two Start Here pages are headed "Zcash Basics" in the content repo (a copied title), so the manifest lists
    // three entries with that name. Give the other two their own names.
    if (!titled || titled.trim().toLowerCase() === "zcash basics") {
      const base = (key.split("/").pop() ?? "").toLowerCase().replace(/-/g, "_").replace(/\.md$/, "");
      const fix = DUPLICATE_BASICS_TITLES[base];
      if (fix) return fix;
    }
    // Manifest titles are often the page H1 and wrap the sidebar.
    // Prefer the short filename label when the title is much longer.
    if (titled && titled.length <= 36) return titled;
    return fromFile;
  };
  // The "Zero to Zero Knowledge" series is meant to be read in order, not alphabetically.
  const SERIES_ORDER = ["zero_to_zero", "hash_functions", "mnemonic_seed", "zcash_addresses", "tees", "cryptonote", "lelantus"];
  const seriesRank = (item: string) => {
    const base = (item.split("/").pop() ?? "").toLowerCase().replace(/-/g, "_");
    const i = SERIES_ORDER.findIndex((k) => base.startsWith(k));
    return i === -1 ? SERIES_ORDER.length : i;
  };
  // The network upgrade pages of Zcash Tech are read in the order they activated, as one block, instead of being
  // scattered through the alphabet.
  const UPGRADE_ORDER = ["sprout", "overwinter", "sapling", "blossom", "heartwood", "canopy", "nu5", "nu6", "nu6_1", "nu6_2", "nu7"];
  const upgradeRank = (item: string) =>
    UPGRADE_ORDER.indexOf((item.split("/").pop() ?? "").toLowerCase().replace(/-/g, "_"));
  // The Guides tab is grouped by topic, with a small heading per group, instead of one long alphabetical list.
  // A guide that is not listed here goes to the last group, so a new page never disappears from the menu.
  const GUIDE_GROUPS: Array<{ title: string; slugs: string[] }> = [
    { title: "Getting started", slugs: ["using-zec-privately", "my-first-zcash-workbook", "zero-knowledge-vs-decoys"] },
    { title: "Wallets and hardware", slugs: ["ledger-shielded-zec", "keystone-zashi", "brave-wallet-guide", "zkool-multisig", "ywallet-frost-demo"] },
    { title: "Privacy", slugs: ["nym-mixnet-wallet-setup", "nym-vpn", "mining-and-staking-privacy", "viewing-key-transaction-export"] },
    { title: "Payments and DeFi", slugs: ["btcpayserver-zcash-plugin", "zgo-payment-processor", "using-zec-in-defi", "avalanche-redbridge", "maya-protocol", "shapeshift-zcash"] },
    {
      title: "Run a node",
      slugs: ["raspberry-pi-4-full-node", "raspberry-pi-4-zebra-node", "raspberry-pi5-zebra-lightwalletd-zingo", "hardened-zebrad", "migration-guide-zcashd-to-zebrad-zallet", "zcash-node-rpc-and-indexing", "zcash-stack", "verifying-zcash-releases"],
    },
    { title: "Deploy on Akash", slugs: ["akash-network-zebra", "akash-network-zcashd", "akash-network-zakura", "thus-spoke-zakura-akash"] },
    { title: "Developer tools", slugs: ["zcash-devtool", "zcash-js", "zingolib-and-zaino-tutorial", "zenith-installation", "zcash-improvement-proposals", "crosslink-feature-net"] },
    { title: "Explore the network", slugs: ["blockchain-explorers", "visualizing-the-zcash-network", "visualizing-zcash-addresses"] },
    { title: "Media", slugs: ["free2z-live", "free2z-livestreaming"] },
  ];
  const guideSlug = (item: string) => transformGithubFilePathToWikiLink(item).split("/").pop()?.toLowerCase() ?? "";
  const guideGroupOf = (item: string) => {
    const slug = guideSlug(item);
    const gi = GUIDE_GROUPS.findIndex((g) => g.slugs.includes(slug));
    return gi === -1 ? GUIDE_GROUPS.length : gi;
  };
  const guideRank = (item: string) => {
    const gi = guideGroupOf(item);
    return gi === GUIDE_GROUPS.length ? 0 : GUIDE_GROUPS[gi].slugs.indexOf(guideSlug(item));
  };
  let root = roots
    .map((item) => item.slice(0, -3))
    .sort((a, b) => (folder === "zero-to-zero-knowledge" ? seriesRank(a) - seriesRank(b) : 0));
  if (folder === "guides") {
    root = root
      .map((item, i) => ({ item, i }))
      .sort((x, y) => guideGroupOf(x.item) - guideGroupOf(y.item) || guideRank(x.item) - guideRank(y.item) || x.i - y.i)
      .map((x) => x.item);
  }
  const firstUpgradeIndex = folder === "zcash-tech" ? root.findIndex((item) => upgradeRank(item) >= 0) : -1;
  if (firstUpgradeIndex >= 0) {
    const upgrades = root.filter((item) => upgradeRank(item) >= 0).sort((x, y) => upgradeRank(x) - upgradeRank(y));
    const rest = root.filter((item) => upgradeRank(item) < 0);
    root = [...rest.slice(0, firstUpgradeIndex), ...upgrades, ...rest.slice(firstUpgradeIndex)];
  }
  const name = folder[0].toUpperCase() + folder.slice(1);
  const fold = getName(name);

  const exploreLink = (
    <Link
      href="/explore"
      className="inline-flex items-center justify-center gap-1 rounded-lg border border-brand bg-brand px-4 py-2 text-center text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:border-brand/40 dark:bg-brand/15 dark:text-brand-soft dark:hover:border-brand/70 dark:hover:bg-brand/25 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
    >
      {t?.sideMenu?.explore ?? "Explore"}
      <Icon size={"medium"} icon={Arrow} />
    </Link>
  );

  return (
    <div className="relative flex flex-wrap items-center lg:items-start order-1 justify-between lg:flex-col">
      <button onClick={toggleMenu} className="lg:hidden flex cursor-pointer">
        <BurgerMenuIcon size={24} />{" "}
        <h3 className="ms-2 font-bold">{t?.sideMenu?.navigation ?? "Navigation"}</h3>
      </button>

      <div className="flex justify-end w-auto order-2 lg:hidden">
        {exploreLink}
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
              <Fragment key={i}>
              {folder === "guides" && (i === 0 || guideGroupOf(item) !== guideGroupOf(root[i - 1])) && (
                <li
                  className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ${
                    i === 0 ? "pt-1" : "mt-3 border-t border-slate-200 pt-3 dark:border-white/10"
                  }`}
                >
                  {chromeLabel(
                    guideGroupOf(item) === GUIDE_GROUPS.length ? "More guides" : GUIDE_GROUPS[guideGroupOf(item)].title,
                  )}
                </li>
              )}
              {i === firstUpgradeIndex && (
                <li className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {chromeLabel("Network Upgrades")}
                </li>
              )}
              <NavItem
                href={`/${transformGithubFilePathToWikiLink(item)}`}
                label={folder === "zero-to-zero-knowledge" && seriesRank(item) === 0 ? "Overview" : item ? menuLabel(item) : ""}
                pathname={pathname}
              />
              </Fragment>
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
        <div className="mt-6 hidden px-3 lg:block">{exploreLink}</div>
      </nav>
    </div>
  );
};

export default SideMenu;
