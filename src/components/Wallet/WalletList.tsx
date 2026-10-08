"use client";
import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import WalletItem from "@/components/Wallet/WalletItem";
import FilterToggle from "@/components/FilterToggle";
import { useLanguage } from "@/context/LanguageContext";

interface Wallet {
  title: string;
  url: string;
  imageUrl: string;
  devices: string[];
  pools: string[];
  features: string[];
  operatingSystem: string[];
  walletSupport: string[];
  syncSpeed: string;
  ironwood: string;
  status?: string;
  statusReason?: string;
  stage?: string;
}

// A deprecated wallet (end-of-life, archived, or no longer supports Zcash)
// leaves the directory — no filters, no counts — and is listed at the bottom.
const isDeprecated = (w: Wallet) => w.status?.toLowerCase() === "deprecated";

const IRONWOOD_ORDER = ["ready", "in progress", "not ready", "transparent only"];
const ironwoodRank = (w: Wallet) => {
  const i = IRONWOOD_ORDER.indexOf(w.ironwood?.trim().toLowerCase() ?? "");
  return i === -1 ? IRONWOOD_ORDER.length : i;
};

interface Props {
  allWallets: Wallet[];
}

const WalletList: React.FC<Props> = ({ allWallets }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    Devices: new Set<string>(),
    "Operating System": new Set<string>(),
    Pools: new Set<string>(),
    "Wallet Support": new Set<string>(),
    Features: new Set<string>(),
    Ironwood: new Set<string>(),
  });
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string }>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const closeFilterRef = useRef<HTMLButtonElement>(null);

  const { t } = useLanguage();
  const filtersLabel = t?.wallets?.filters ?? "Filters";
  const walletCountLabel = (count: number) =>
    count === 1
      ? (t?.wallets?.walletCountOne ?? "1 wallet")
      : (t?.wallets?.walletCount ?? "{count} wallets").replace("{count}", String(count));
  const activeCountLabel = (count: number) =>
    (t?.wallets?.activeCount ?? "{count} active").replace("{count}", String(count));
  const closeLabel = t?.wallets?.close ?? "Close";
  const clearAllLabel = t?.wallets?.clearAll ?? "Clear all";
  const savedReviewMsg = t?.wallets?.savedReview ?? "We saved your review!";
  const errorGettingLikesMsgPrefix =
    t?.wallets?.errorGettingLikes ?? "Error getting likes:";
  const errorUpdatingRatingPrefix =
    t?.wallets?.errorUpdatingRating ?? "Error updating rating:";

  const deprecatedTitle =
    t?.wallets?.deprecatedTitle ?? "Deprecated / no longer supports Zcash";
  const deprecatedNote =
    t?.wallets?.deprecatedNote ??
    "Kept for reference only. Do not use these wallets for new funds.";

  const handleToggleFilter = () => setIsFilterVisible((v) => !v);
  const showWalletsLabel = (count: number) =>
    count === 1
      ? (t?.wallets?.showWallet ?? "Show 1 wallet")
      : (t?.wallets?.showWallets ?? "Show {count} wallets").replace("{count}", String(count));

  const activeWallets = allWallets.filter((w) => !isDeprecated(w));
  const deprecatedWallets = allWallets
    .filter(isDeprecated)
    .sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    const fetchLikes = async () => {
      const devicesSet = new Set<string>();
      const operatingSystemSet = new Set<string>();
      const poolsSet = new Set<string>();
      const walletSupportSet = new Set<string>();
      const featuresSet = new Set<string>();
      const ironwoodSet = new Set<string>();

      allWallets.filter((w) => !isDeprecated(w)).forEach((wallet) => {
        wallet.devices.forEach((d) => devicesSet.add(d.trim()));
        wallet.operatingSystem?.forEach((os) => operatingSystemSet.add(os.trim()));
        wallet.pools.forEach((p) => poolsSet.add(p.trim()));
        wallet.walletSupport?.forEach((ws) => walletSupportSet.add(ws.trim()));
        wallet.features.forEach((f) => featuresSet.add(f.trim()));
        if (wallet.ironwood) ironwoodSet.add(wallet.ironwood.trim());
      });

      setFilters({
        Devices: new Set(Array.from(devicesSet).sort((a, b) => a.localeCompare(b))),
        "Operating System": new Set(
          Array.from(operatingSystemSet).sort((a, b) => a.localeCompare(b)),
        ),
        Pools: new Set(Array.from(poolsSet).sort((a, b) => a.localeCompare(b))),
        "Wallet Support": new Set(
          Array.from(walletSupportSet).sort((a, b) => a.localeCompare(b)),
        ),
        Features: new Set(Array.from(featuresSet).sort((a, b) => a.localeCompare(b))),
        Ironwood: new Set(Array.from(ironwoodSet).sort((a, b) => a.localeCompare(b))),
      });

      let initialLikes: { [key: string]: number } = {};
      try {
        const response = await fetch("/api/wallet-likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: "", delta: 0 }),
        });
        if (response.ok) {
          initialLikes = await response.json();
        }
      } catch (error) {
        console.log(`${errorGettingLikesMsgPrefix} ${error}`);
      }

      allWallets.forEach((wallet) => {
        if (!initialLikes[wallet.title]) initialLikes[wallet.title] = 0;
      });
      setLikes(initialLikes);
    };

    fetchLikes();
  }, [allWallets]);

  function toggleFilter(filterCategory: string, filterValue: string) {
    const filterKey = `${filterCategory}:${filterValue}`;
    setActiveFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((f) => f !== filterKey)
        : [...prev, filterKey],
    );
  }

  const handleLike = async (walletTitle: string) => {
    setSuccess({});
    setError({});
    try {
      const response = await fetch("/api/wallet-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: walletTitle, delta: 1 }),
      });
      if (response.ok) {
        setLikes((prev) => ({ ...prev, [walletTitle]: prev[walletTitle] + 1 }));
        setSuccess({ [walletTitle]: savedReviewMsg });
      } else {
        const data = await response.json();
        setError({ [walletTitle]: data.message });
      }
    } catch (error) {
      setError({ [walletTitle]: `${errorUpdatingRatingPrefix} ${error}` });
    }
  };

  const handleDislike = async (walletTitle: string) => {
    setSuccess({});
    setError({});
    try {
      const response = await fetch("/api/wallet-likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: walletTitle, delta: -1 }),
      });
      if (response.ok) {
        setLikes((prev) => ({ ...prev, [walletTitle]: prev[walletTitle] - 1 }));
        setSuccess({ [walletTitle]: savedReviewMsg });
      } else {
        const data = await response.json();
        setError({ [walletTitle]: data.message });
      }
    } catch (error) {
      setError({ [walletTitle]: `${errorUpdatingRatingPrefix} ${error}` });
    }
  };

  const filteredWallets = activeWallets.filter((wallet) =>
    activeFilters.every((filter) => {
      const [category, value] = filter.split(":");
      if (category === "Devices") return wallet.devices.includes(value);
      if (category === "Operating System") return wallet.operatingSystem?.includes(value) ?? false;
      if (category === "Pools") return wallet.pools.includes(value);
      if (category === "Wallet Support") return wallet.walletSupport?.includes(value) ?? false;
      if (category === "Features") return wallet.features.includes(value);
      if (category === "Ironwood") return wallet.ironwood === value;
      return true;
    }),
  );

  // Ironwood-ready wallets first, then In Progress, Not Ready, Transparent only
  // and wallets without a status; the rating orders wallets within each group.
  const sortedWallets = [...filteredWallets].sort(
    (a, b) =>
      ironwoodRank(a) - ironwoodRank(b) ||
      (likes[b.title] ?? 0) - (likes[a.title] ?? 0),
  );

  return (
    <>
      <div className="wl-root">
        {/* Mobile header */}
        <div className="wl-mobile-header">
          {/* The heading is the result count; the button says what it opens. */}
          <span className="wl-mobile-title" aria-live="polite">
            {walletCountLabel(sortedWallets.length)}
          </span>
          <button
            type="button"
            ref={filterTriggerRef}
            aria-haspopup="dialog"
            aria-expanded={isFilterVisible}
            className="wl-btn focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            onClick={handleToggleFilter}
          >
            <svg className="wl-btn-icon" aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
              <circle cx="16" cy="6" r="2" />
              <circle cx="10" cy="12" r="2" />
              <circle cx="18" cy="18" r="2" />
            </svg>
            {filtersLabel}
            {activeFilters.length > 0 && (
              <>
                <span className="wl-active-count" aria-hidden="true">{activeFilters.length}</span>
                <span className="sr-only">, {activeCountLabel(activeFilters.length)}</span>
              </>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="wl-active-chips">
            {activeFilters.map((item) => (
              <button
                type="button"
                key={item}
                className="wl-chip focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                onClick={(event) => {
                  const neighbor = event.currentTarget.nextElementSibling ?? event.currentTarget.previousElementSibling;
                  setActiveFilters((prev) => prev.filter((filter) => filter !== item));
                  if (neighbor instanceof HTMLButtonElement) neighbor.focus();
                  else filterTriggerRef.current?.focus();
                }}
              >
                {item.split(":")[1]}
                <span className="wl-chip-x">{closeLabel}</span>
              </button>
            ))}
          </div>
        )}

        <div className="wl-layout">
          {/* Desktop sidebar */}
          <aside className="wl-sidebar">
            <p className="wl-sidebar-title">{filtersLabel}</p>
            <div className="wl-sidebar-panel">
              <FilterToggle
                filters={filters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                handleToggleFilter={handleToggleFilter}
              />
            </div>
          </aside>

          {/* Results - 3-column grid + correct tags format */}
          <section className="wl-results">
            <div className="wl-results-meta">
              <span className="wl-results-count">
                {walletCountLabel(sortedWallets.length)}
              </span>
            </div>

            <div className="wl-wallet-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedWallets.map((wallet) => (
                <WalletItem
                  key={wallet.title}
                  title={wallet.title}
                  link={wallet.url}
                  logo={wallet.imageUrl}
                  tags={[
                    { category: "Devices", values: wallet.devices },
                    { category: "Pools", values: wallet.pools },
                    { category: "Features", values: wallet.features },
                  ]}
                  likes={likes[wallet.title] || 0}
                  syncSpeed={wallet.syncSpeed}
                  ironwood={wallet.ironwood}
                  stage={wallet.stage}
                  onLike={() => handleLike(wallet.title)}
                  onDislike={() => handleDislike(wallet.title)}
                  error={error[wallet.title]}
                  success={success[wallet.title]}
                />
              ))}
            </div>

            {deprecatedWallets.length > 0 && (
              <details open className="wl-deprecated mt-10 rounded-2xl border border-rose-200 dark:border-rose-900/60">
                <summary className="cursor-pointer px-5 py-4 font-semibold text-rose-700 dark:text-rose-300">
                  {deprecatedTitle} ({deprecatedWallets.length})
                </summary>
                <p className="px-5 text-sm text-slate-500 dark:text-slate-400">{deprecatedNote}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
                  {deprecatedWallets.map((wallet) => (
                    <WalletItem
                      key={wallet.title}
                      title={wallet.title}
                      link={wallet.url}
                      logo={wallet.imageUrl}
                      tags={[
                        { category: "Devices", values: wallet.devices },
                        { category: "Pools", values: wallet.pools },
                        { category: "Features", values: wallet.features },
                      ]}
                      likes={likes[wallet.title] || 0}
                      syncSpeed={wallet.syncSpeed}
                      deprecated={wallet.statusReason ?? ""}
                      onLike={() => handleLike(wallet.title)}
                      onDislike={() => handleDislike(wallet.title)}
                      error={error[wallet.title]}
                      success={success[wallet.title]}
                    />
                  ))}
                </div>
              </details>
            )}
          </section>
        </div>

        {/* Mobile drawer */}
        {isFilterVisible && (
          // z-[300]: above the site header (Navigation, z-200), which otherwise
          // covers the top of the panel on phones. dvh, not vh: vh includes the
          // area behind the browser's own toolbars, pushing the panel's top
          // row off-screen.
          <Dialog
            open={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            initialFocus={closeFilterRef}
            className="wl-root wl-mobile-drawer fixed inset-0 z-[300] bg-black/60 flex items-end"
          >
            <DialogPanel
              className="bg-white dark:bg-slate-900 w-full max-h-[85dvh] rounded-t-3xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="wl-drawer-header px-6 py-4 border-b flex items-center justify-between gap-3">
                <DialogTitle as="span" className="text-lg font-semibold">{filtersLabel}</DialogTitle>
                <div className="flex items-center gap-4">
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                      onClick={() => setActiveFilters([])}
                    >
                      {clearAllLabel}
                    </button>
                  )}
                  <button
                    type="button"
                    ref={closeFilterRef}
                    aria-label={closeLabel}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-blue-600"
                    onClick={() => setIsFilterVisible(false)}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
              </div>

              {/* Apply: at the top, before the filters, so it is visible without
                  scrolling; the count follows every toggle. */}
              <div className="px-6 pt-4 pb-2">
                <button
                  type="button"
                  className="wl-btn-apply w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                  onClick={() => setIsFilterVisible(false)}
                >
                  {showWalletsLabel(sortedWallets.length)}
                </button>
              </div>

              <div className="wl-drawer-content px-6 pb-6 pt-2 overflow-y-auto flex-1 min-h-0">
                <FilterToggle
                  filters={filters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  handleToggleFilter={handleToggleFilter}
                />
              </div>
            </DialogPanel>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default WalletList;
