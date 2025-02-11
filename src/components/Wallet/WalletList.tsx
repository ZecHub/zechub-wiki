"use client"
import React, { useState, useEffect } from "react";
import WalletItem from "@/components/Wallet/WalletItem";
import FilterToggle from "@/components/FilterToggle";

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
    Pools: new Set<string>(),
    Features: new Set<string>(),
  });
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<{ [key: string]: string }>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  useEffect(() => {
    const fetchLikes = async () => {
      const devicesSet = new Set<string>();
      const poolsSet = new Set<string>();
      const featuresSet = new Set<string>();

      allWallets.forEach((wallet) => {
        wallet.devices.forEach((device) => devicesSet.add(device.trim()));
        wallet.pools.forEach((pool) => poolsSet.add(pool.trim()));
        wallet.features.forEach((feature) => featuresSet.add(feature.trim()));
      });

      setFilters({
        Devices: devicesSet,
        Pools: poolsSet,
        Features: featuresSet,
      });

      
      let initialLikes: { [key: string]: number } = {};
      try {
        const response = await fetch("/api/wallet-likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: "", delta: 0 }),
        });

        if (response.ok) {
          initialLikes = await response.json();
        } else {
          console.log("You reviewed this in the past.");
        }
      } catch (error) {
        console.log("Error getting likes: " + error);
      }

      allWallets.forEach((wallet) => {
        if (!initialLikes[wallet.title])
          initialLikes[wallet.title] = 0; // Initialize likes to zero
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
        : [...prev, filterKey]
    );
  }

  const handleLike = async (walletTitle: string) => {
    setSuccess({});
    setError({}); // Reset error before attempting to like
    try {
      const response = await fetch("/api/wallet-likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: walletTitle, delta: 1 }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received message:", data);
        // Update likes state only if the API call was successful
        setLikes((prevLikes) => ({
          ...prevLikes,
          [walletTitle]: prevLikes[walletTitle] + 1,
        }));
        setSuccess({ [walletTitle]: "We saved your review!" });
      } else {
        const data = await response.json();
        setError({ [walletTitle]: data.message });
      }
    } catch (error) {
      setError({ [walletTitle]: "Error updating rating: " + error });
    }
  };

  const handleDislike = async (walletTitle: string) => {
    setSuccess({});
    setError({}); // Reset error before attempting to dislike
    try {
      const response = await fetch("/api/wallet-likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: walletTitle, delta: -1 }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Received message:", data);
        // Update likes state only if the API call was successful
        setLikes((prevLikes) => ({
          ...prevLikes,
          [walletTitle]: prevLikes[walletTitle] - 1,
        }));
        setSuccess({ [walletTitle]: "We saved your review!" });
      } else {
        const data = await response.json();
        setError({ [walletTitle]: data.message });
      }
    } catch (error) {
      setError({ [walletTitle]: "Error updating rating: " + error });
    }
  };

  const filteredWallets = allWallets.filter((wallet) =>
    activeFilters.every((filter) => {
      const [category, value] = filter.split(":");
      if (category === "Devices") return wallet.devices.includes(value);
      if (category === "Pools") return wallet.pools.includes(value);
      if (category === "Features") return wallet.features.includes(value);
      return false;
    })
  );

  const sortedWallets = filteredWallets.sort((a, b) => likes[b.title] - likes[a.title]);
  
  return (
    <div className="flex flex-col w-full md:flex-row">
      <div className="wallet-filter w-auto md:w-[30%] relative">
        <h2 className="text-4xl font-bold mb-6">
          Filters
          <button
            onClick={handleToggleFilter}
            className="float-right bg-blue-500 text-white px-4 py-2 rounded text-sm md:text-lg md:hidden">
            {isFilterVisible ? 'Hide' : 'Show'}
          </button>
        </h2>
        <div className={`md:block ${isFilterVisible ? 'block' : 'hidden'}`}>
          <FilterToggle
            filters={filters}
            activeFilters={activeFilters}
            toggleFilter={toggleFilter}
          />
        </div>
      </div>
      <section className="h-auto w-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {sortedWallets.map((wallet) => (
            <WalletItem
              key={wallet.title}
              title={wallet.title}
              link={wallet.url}
              logo={wallet.imageUrl}
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
  );
};

export default WalletList;
