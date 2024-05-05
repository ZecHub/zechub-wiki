"use client";
import React, { useState, useEffect } from "react";
import WalletItem from "@/components/WalletItem";
import FilterToggle from "@/components/FilterToggle";

interface Wallet {
  title: string;
  url: string;
  imageUrl: string;
  devices: string;
  pools: string[];
  features: string[];
}
interface Props {
  allWallets: Wallet[];
}

const WalletList: React.FC<Props> = ({ allWallets }) => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    Devices: new Set<string>(),
    Pools: new Set<string>(),
    Features: new Set<string>(),
  });

  useEffect(() => {
    const devicesSet = new Set<string>();
    const poolsSet = new Set<string>();
    const featuresSet = new Set<string>();

    allWallets.forEach((wallet) => {
      devicesSet.add(wallet.devices.trim());
      wallet.pools.forEach((pool) => poolsSet.add(pool));
      wallet.features.forEach((feature) => featuresSet.add(feature));
    });

    setFilters({
      Devices: devicesSet,
      Pools: poolsSet,
      Features: featuresSet,
    });
  }, [allWallets]);

  function toggleFilter(filterCategory: string, filterValue: string) {
    const filterKey = `${filterCategory}:${filterValue}`;
    setActiveFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((f) => f !== filterKey)
        : [...prev, filterKey]
    );
  }

  const filteredWallets = allWallets.filter((wallet) =>
    activeFilters.every((filter) => {
      const [category, value] = filter.split(":");
      if (category === "Devices") return wallet.devices.trim() === value;
      if (category === "Pools") return wallet.pools.includes(value);
      if (category === "Features") return wallet.features.includes(value);
      return false;
    })
  );

  return (
    <div className="flex flex-col md:flex-row">
      <div className="wallet-filter w-auto md:w-1/5 relative">
        <h2 className="text-4xl font-bold mb-6">Filters</h2>
        <FilterToggle
          filters={filters}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
        />
      </div>
      <section className="h-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filteredWallets.map((wallet) => (
            <WalletItem
              key={wallet.title}
              title={wallet.title}
              link={wallet.url}
              logo={wallet.imageUrl}
              tags={[
                { category: "Devices", values: [wallet.devices.trim()] },
                { category: "Pools", values: [...wallet.pools] },
                { category: "Features", values: [...wallet.features] },
              ]}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default WalletList;
