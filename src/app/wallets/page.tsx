// src/app/wallets/page.tsx
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { getFileContent, getRoot } from '@/lib/authAndFetch'
import { getBanner } from '@/lib/helpers'
import { parseMarkdown } from '@/lib/parseMarkdown';
import WalletList from '@/components/WalletList';

export default async function Page({ params }: { params: { slug: string } }) {
    
  const { slug } = params
  const url = `/site/Using_Zcash/Wallets.md`

  const markdown = await getFileContent(url)

  const content = markdown ? markdown : 'No Data or Wrong file'
  const urlRoot = `/site/using-zcash`
  const roots = await getRoot(urlRoot)

  const imgUrl = getBanner(`using-zcash`)

  const walletsParsed = parseMarkdown(content);
  console.log("Parsed Wallets:", walletsParsed); // Check parsed markdown output

  return (
    
      <main>
          <div className='flex justify-center w-full  mb-5 bg-transparent rounded pb-4'>
              <Image
                  className="w-full mb-5 object-cover "
                  alt="wiki-banner"
                  width={800}
                  height={50}
                  src={imgUrl != undefined ? imgUrl : '/wiki-banner.avif'}
              />
          </div>

          <div id="content" className={`flex flex-col space-y-5 ${roots && roots.length > 0 ? 'md:flex-row md:space-x-5' : 'md:flex-col'} h-auto w-full p-5`}>
              <section className='h-auto w-auto px-3'>
                  <div>                    
                      <WalletList allWallets={walletsParsed} />
                  </div>
              </section>
          </div>
      </main>
  )
}

/* export default function Page() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [imgUrl, setImgUrl] = useState<string>("/wiki-banner.avif");
  const [roots, setRoots] = useState<any[]>([]); // Update this to match the actual data type for roots.
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching data...");
    async function fetchData() {
      try {
        const response = await fetch('/api/wallets');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: FetchResponse = await response.json();
        console.log("API data:", data); // Check raw data from API
        const walletsParsed = parseMarkdown(data.content);
        console.log("Parsed Wallets:", walletsParsed); // Check parsed markdown output
        setWallets(walletsParsed);
        setImgUrl(data.imgUrl);
        setRoots(data.roots);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
  
    fetchData();
  }, []);
  

  function toggleFilter(tag: string) {
    setActiveFilters(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  const filteredWallets = activeFilters.length > 0
    ? wallets.filter(wallet => wallet.features.some(tag => activeFilters.includes(tag)))
    : wallets;
console.log('Wallets items', wallets)
  return (
    <main>
      <div className="flex justify-center w-full mb-5 bg-transparent rounded pb-4">
        <Image className="w-full mb-5 object-cover" alt="wiki-banner" width={800} height={50} src={imgUrl} />
      </div>

     
      <div>
        {['Web', 'Transparent', 'Orchard (in-development)', 'Spend before Sync', 'Shielded Memo', 'Automatic Shielding', 'Unified Address', 'Secure File Transfer', 'Synchronizer', 'Multi Coin'].map(tag => (
          <button key={tag} onClick={() => toggleFilter(tag)} className={activeFilters.includes(tag) ? 'active-filter' : ''}>
            {tag}
          </button>
        ))}
      </div>

      <div id="content" className={`flex flex-col space-y-5 ${roots.length > 0 ? "md:flex-row md:space-x-5" : "md:flex-col"} h-auto w-full p-5`}>
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
 */