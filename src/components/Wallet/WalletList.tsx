"use client";
import React, { useState, useEffect } from "react";
import WalletItem from "@/components/Wallet/WalletItem";
import FilterToggle from "@/components/FilterToggle";
import { useLanguage } from "@/context/LanguageContext";
import { SlidersHorizontal, X } from "lucide-react";

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
}

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

  const { t } = useLanguage();
  const filtersLabel = t?.wallets?.filters ?? "Filters";
  const showNavLabel = t?.wallets?.showNavigation ?? "Show Navigation";
  const closeLabel = t?.wallets?.close ?? "Close";
  const savedReviewMsg = t?.wallets?.savedReview ?? "We saved your review!";
  const errorGettingLikesMsgPrefix =
    t?.wallets?.errorGettingLikes ?? "Error getting likes:";
  const errorUpdatingRatingPrefix =
    t?.wallets?.errorUpdatingRating ?? "Error updating rating:";

  const handleToggleFilter = () => setIsFilterVisible((v) => !v);

  useEffect(() => {
    const fetchLikes = async () => {
      const devicesSet = new Set<string>();
      const operatingSystemSet = new Set<string>();
      const poolsSet = new Set<string>();
      const walletSupportSet = new Set<string>();
      const featuresSet = new Set<string>();
      const ironwoodSet = new Set<string>();

      allWallets.forEach((wallet) => {
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

  const filteredWallets = allWallets.filter((wallet) =>
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

  // Featured wallets are always listed first, in this order; the rest follow by rating.
  const featuredOrder = ["zodl", "zkool", "vizor", "zingo", "ywallet"];
  const featuredRank = (title: string) => {
    const i = featuredOrder.indexOf(title.toLowerCase().replace(/[^a-z0-9]/g, ""));
    return i === -1 ? featuredOrder.length : i;
  };
  const sortedWallets = [...filteredWallets].sort(
    (a, b) =>
      featuredRank(a.title) - featuredRank(b.title) ||
      (likes[b.title] ?? 0) - (likes[a.title] ?? 0),
  );

  return (
    <>
      <div className="wl-root">
        {/* Mobile header */}
        <div className="wl-mobile-header">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {sortedWallets.length} wallet{sortedWallets.length !== 1 ? "s" : ""}
          </span>
          <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white" onClick={handleToggleFilter}>
            <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
            {filtersLabel}
            {activeFilters.length > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-white">
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="wl-active-chips">
            {activeFilters.map((item, i) => (
              <span
                key={i}
                className="wl-chip"
                onClick={() => {
                  const [cat, val] = item.split(":");
                  toggleFilter(cat, val);
                }}
              >
                {item.split(":")[1]}
                <X aria-hidden="true" className="h-3.5 w-3.5 opacity-70" />
              </span>
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
                {sortedWallets.length} wallet{sortedWallets.length !== 1 ? "s" : ""}
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
                  onLike={() => handleLike(wallet.title)}
                  onDislike={() => handleDislike(wallet.title)}
                  error={error[wallet.title]}
                  success={success[wallet.title]}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Mobile drawer */}
        {isFilterVisible && (
          <div className="wl-mobile-drawer fixed inset-0 z-50 bg-black/60 flex items-end">
            <div 
              className="bg-white dark:bg-slate-900 w-full max-h-[85vh] rounded-t-3xl overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="wl-drawer-header px-6 py-4 border-b flex items-center justify-between">
                <span className="text-lg font-semibold">{filtersLabel}</span>
                <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-brand/50 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10 dark:text-brand-soft dark:hover:text-white" onClick={handleToggleFilter}>
                  <X aria-hidden="true" className="h-4 w-4" />
                  {closeLabel}
                </button>
              </div>
              
              <div className="wl-drawer-content p-6 overflow-y-auto max-h-[calc(85vh-65px)]">
                <FilterToggle
                  filters={filters}
                  activeFilters={activeFilters}
                  toggleFilter={toggleFilter}
                  handleToggleFilter={handleToggleFilter}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WalletList;
