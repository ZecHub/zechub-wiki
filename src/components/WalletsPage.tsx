'use client';
import React, { useState } from 'react';
import Image from "next/image";
import WalletItem from "@/components/WalletItem";

export default function Page({ allWallets, roots, imgUrl }) {
  const [activeFilters, setActiveFilters] = useState([]);

  function toggleFilter(tag) {
    setActiveFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  const filteredWallets = activeFilters.length > 0
    ? allWallets.filter(wallet => wallet.tags.some(tag => activeFilters.includes(tag)))
    : allWallets;

  return (
    <main>
      <div className="flex justify-center w-full mb-5 bg-transparent rounded pb-4">
        <Image className="w-full mb-5 object-cover" alt="wiki-banner" width={800} height={50} src={imgUrl} />
      </div>

      <div>
        {['Web', 'Transparent', 'Orchard (in-development)', ...].map(tag => (
          <button key={tag} onClick={() => toggleFilter(tag)} className={activeFilters.includes(tag) ? 'active-filter' : ''}>
            {tag}
          </button>
        ))}
      </div>

      <div id="content" className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"} h-auto w-full p-5`}>
        <section className="h-auto w-auto px-3">
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
        </section>
      </div>
    </main>
  );
}
