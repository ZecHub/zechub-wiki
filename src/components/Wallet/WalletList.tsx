"use client";
import React, { useState, useEffect } from "react";
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
  syncSpeed: string;
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
      const poolsSet = new Set<string>();
      const featuresSet = new Set<string>();

      allWallets.forEach((wallet) => {
        wallet.devices.forEach((d) => devicesSet.add(d.trim()));
        wallet.pools.forEach((p) => poolsSet.add(p.trim()));
        wallet.features.forEach((f) => featuresSet.add(f.trim()));
      });

      setFilters({
        Devices: new Set(
          Array.from(devicesSet).sort((a, b) => a.localeCompare(b)),
        ),
        "Operating System": new Set<string>(),
        Pools: new Set(Array.from(poolsSet).sort((a, b) => a.localeCompare(b))),
        "Wallet Support": new Set<string>(),
        Features: new Set(
          Array.from(featuresSet).sort((a, b) => a.localeCompare(b)),
        ),
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
      if (category === "Pools") return wallet.pools.includes(value);
      if (category === "Features") return wallet.features.includes(value);
      return false;
    }),
  );

  const sortedWallets = [...filteredWallets].sort(
    (a, b) => likes[b.title] - likes[a.title],
  );

  return (
    <>
      {/* Inject scoped styles */}
      {/* <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

      `}</style> */}

      <div className="wl-root">
        {/* ── Mobile header ── */}
        <div className="wl-mobile-header">
          <span className="wl-mobile-title">{filtersLabel}</span>
          <button className="wl-btn" onClick={handleToggleFilter}>
            <span className="wl-btn-icon">⚙</span>
            {showNavLabel}
            {activeFilters.length > 0 && (
              <span className="wl-active-count">{activeFilters.length}</span>
            )}
          </button>
        </div>

        {/* ── Active filter chips (mobile) ── */}
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
                <span className="wl-chip-x">✕</span>
              </span>
            ))}
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="wl-layout">
          {/* Sidebar (desktop) */}
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

          {/* Results */}
          <section className="wl-results">
            <div className="wl-results-meta">
              <span className="wl-results-count">
                {sortedWallets.length} wallet
                {sortedWallets.length !== 1 ? "s" : ""}
                {activeFilters.length > 0 && (
                  <span className="wl-active-count">
                    {activeFilters.length}
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedWallets.map((wallet) => (
                <WalletItem
                  key={wallet.title}
                  title={wallet.title}
                  link={wallet.url}
                  logo={wallet.imageUrl.trim()}
                  tags={[
                    { category: "Devices", values: [...wallet.devices] },
                    { category: "Pools", values: [...wallet.pools] },
                    { category: "Features", values: [...wallet.features] },
                  ]}
                  syncSpeed={wallet.syncSpeed}
                  likes={likes[wallet.title]}
                  onLike={() => handleLike(wallet.title)}
                  onDislike={() => handleDislike(wallet.title)}
                  error={error[wallet.title]}
                  success={success[wallet.title]}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ── Mobile filter drawer ── */}
        {isFilterVisible && (
          <div className="wl-drawer-overlay open" onClick={handleToggleFilter}>
            <div className="wl-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="wl-drawer-handle" />
              <div className="wl-drawer-top">
                <span className="wl-drawer-title">{filtersLabel}</span>
                <button
                  className="wl-drawer-close"
                  onClick={handleToggleFilter}
                >
                  {closeLabel}
                </button>
              </div>
              {/* Pass a no-op so FilterToggle cannot close the drawer on its own */}
              <FilterToggle
                filters={filters}
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                handleToggleFilter={() => {}}
              />
              {/* Done button — closes drawer and shows results */}
              <button
                className="wl-btn wl-btn-done"
                onClick={handleToggleFilter}
              >
                {activeFilters.length > 0
                  ? `Show ${sortedWallets.length} wallet${sortedWallets.length !== 1 ? "s" : ""}`
                  : "Done"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WalletList;
