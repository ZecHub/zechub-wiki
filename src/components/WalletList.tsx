'use client'
import React, { useState, useEffect } from "react";
import WalletItem from "@/components/WalletItem";

export default function WalletList({ allWallets }) {
  const [activeFilters, setActiveFilters] = useState([]);
  const [filters, setFilters] = useState({
    Devices: new Set(),
    Pools: new Set(),
    Features: new Set()
  });

  // Extract and store unique filter options
  useEffect(() => {
    const devicesSet = new Set();
    const poolsSet = new Set();
    const featuresSet = new Set();

    allWallets.forEach(wallet => {
      devicesSet.add(wallet.devices.trim());
      wallet.pools.forEach(pool => poolsSet.add(pool));
      wallet.features.forEach(feature => featuresSet.add(feature));
    });

    setFilters({
      Devices: devicesSet,
      Pools: poolsSet,
      Features: featuresSet
    });
  }, [allWallets]);

  // Toggle filters
  function toggleFilter(filterCategory, filterValue) {
    const filterKey = `${filterCategory}:${filterValue}`;
    setActiveFilters(prev => prev.includes(filterKey)
      ? prev.filter(f => f !== filterKey)
      : [...prev, filterKey]);
  }

  // Filter wallets based on active filters
  const filteredWallets = allWallets.filter(wallet => {
    return activeFilters.every(filter => {
      const [category, value] = filter.split(':');
      if (category === 'Devices') return wallet.devices.trim() === value;
      if (category === 'Pools') return wallet.pools.includes(value);
      if (category === 'Features') return wallet.features.includes(value);
      return false;
    });
  });

  return (
    <>
      <div>
        {/* Display checkboxes for each filter category */}
        {Object.entries(filters).map(([category, values]) => (
          <div key={category}>
            <h3>{category}</h3>
            {[...values].map(value => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={activeFilters.includes(`${category}:${value}`)}
                  onChange={() => toggleFilter(category, value)}
                />
                {value}
              </label>
            ))}
          </div>
        ))}
      </div>
      <div className="flex-auto px-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {filteredWallets.map(wallet => (
          <WalletItem
            key={wallet.title}
            title={wallet.title}
            link={wallet.url}
            logo={wallet.imageUrl}
            tags={[wallet.devices, ...wallet.pools, ...wallet.features]}
          />
        ))}
      </div>
    </>
  );
}
