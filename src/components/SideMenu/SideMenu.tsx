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
  // Long tabs are grouped by topic, with a small heading per group, instead of one alphabetical list.
  // A page that is not listed here goes to the last group ("More"), so a new page never disappears from the menu.
  // Keys are page slugs; "__x" keys are the fixed entries that are not plain pages (see EXTRA_ITEMS).
  const GROUPS: Record<string, Array<{ title: string; slugs: string[] }>> = {
    guides: [
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
    ],
    "using-zcash": [
      { title: "Get started", slugs: ["buying-zec", "__wallets", "__custodial-exchanges", "faucets", "recovering-funds"] },
      { title: "Swaps and exchanges", slugs: ["centralized-swaps", "non-custodial-exchanges", "dex", "encifher-swaps", "solana-zec-to-shielded", "solswap"] },
      { title: "Pay and get paid", slugs: ["__payment-processors", "payment-request-uris", "mobile-top-ups", "creators-and-tips", "zimppy", "metamask-snap"] },
      { title: "Understand", slugs: ["transactions", "shielded-pools", "unified-addresses", "transparent-exchange-addresses", "memos"] },
      { title: "Mining", slugs: ["zcash-mining-guide", "zcash-mining-pools"] },
      { title: "Tools", slugs: ["zallet-quick-reference-guide", "zecmap", "testnet", "shielded-newsletter"] },
    ],
    "zcash-community": [
      { title: "Community", slugs: ["community-links", "community-projects", "community-blogs", "zcash-global-ambassadors", "cypherpunk-zero-nft"] },
      { title: "Governance and security", slugs: ["zcash-governance", "zcap", "zcash-ecosystem-security"] },
      { title: "Calls and events", slugs: ["arborist-calls", "zcash-engineering-office-hours", "zcon-archive", "zcon-vozes"] },
      { title: "Media", slugs: ["zcash-media", "zcash-podcasts"] },
    ],
  };
  // Fixed entries of Using Zcash that open pages outside /using-zcash, placed inside their groups.
  const EXTRA_ITEMS: Record<string, { href: string; label: string }> = {
    __wallets: { href: "/wallets", label: "Wallets" },
    "__custodial-exchanges": { href: "/using-zcash/custodial-exchanges", label: "Custodial Exchanges" },
    "__payment-processors": { href: "/payment-processors", label: "Payment Processors" },
  };
  const groups = GROUPS[folder];
  const itemSlug = (item: string) =>
    item.startsWith("__") ? item : (transformGithubFilePathToWikiLink(item).split("/").pop()?.toLowerCase() ?? "");
  const groupOf = (item: string) => {
    if (!groups) return 0;
    const gi = groups.findIndex((g) => g.slugs.includes(itemSlug(item)));
    return gi === -1 ? groups.length : gi;
  };
  const rankOf = (item: string) => {
    const gi = groupOf(item);
    return !groups || gi === groups.length ? 0 : groups[gi].slugs.indexOf(itemSlug(item));
  };
  let root = roots
    .map((item) => item.slice(0, -3))
    .sort((a, b) => (folder === "zero-to-zero-knowledge" ? seriesRank(a) - seriesRank(b) : 0));
  if (groups) {
    // Fixed entries join the list, then everything is ordered by group and by position inside the group.
    const extras = folder === "using-zcash" ? Object.keys(EXTRA_ITEMS) : [];
    root = [...root.filter((item) => !["Wallets", "Payment Processors", "Custodial Exchanges"].includes(getName(item))), ...extras]
      .map((item, i) => ({ item, i }))
      .sort((x, y) => groupOf(x.item) - groupOf(y.item) || rankOf(x.item) - rankOf(y.item) || x.i - y.i)
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
            const extra = EXTRA_ITEMS[item];
            const itemName = extra ? "" : getName(item);
            if (
              !groups &&
              (itemName === "Wallets" || itemName === "Payment Processors" || itemName === "Custodial Exchanges")
            )
              return null;
            return (
              <Fragment key={i}>
              {groups && (i === 0 || groupOf(item) !== groupOf(root[i - 1])) && (
                <li
                  className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 ${
                    i === 0 ? "pt-1" : "mt-3 border-t border-slate-200 pt-3 dark:border-white/10"
                  }`}
                >
                  {chromeLabel(groupOf(item) === groups.length ? "More" : groups[groupOf(item)].title)}
                </li>
              )}
              {i === firstUpgradeIndex && (
                <li className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {chromeLabel("Network Upgrades")}
                </li>
              )}
              {extra ? (
                <NavItem href={extra.href} label={chromeLabel(extra.label)} pathname={pathname} />
              ) : (
                <NavItem
                  href={`/${transformGithubFilePathToWikiLink(item)}`}
                  label={folder === "zero-to-zero-knowledge" && seriesRank(item) === 0 ? "Overview" : item ? menuLabel(item) : ""}
                  pathname={pathname}
                />
              )}
              </Fragment>
            );
          })}
        </ul>
        <div className="mt-6 hidden px-3 lg:block">{exploreLink}</div>
      </nav>
    </div>
  );
};

export default SideMenu;
