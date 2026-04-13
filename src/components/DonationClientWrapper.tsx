'use client';

import { useState } from 'react';
import DonationComp from '@/components/Donation/Donation';
import ZcashUAZArt from './ZcashUAZArt';

type DonationVersion = 'v0' | 'v1';

const DonationClientWrapper = () => {
  const [version, setVersion] = useState<DonationVersion>('v1');

  return (
    <>
      <h1
        className="text-center pt-8 sm:pt-10 mb-8 sm:mb-10 text-[1.75rem] sm:text-[2.3rem] font-bold tracking-tight text-zinc-900 dark:text-white"
      >
        Donate to ZecHub
      </h1>

      <div className="flex justify-center mb-8 sm:mb-11 px-4">
        <div
          className="flex w-full max-w-[320px] bg-zinc-100 dark:bg-[#0f1720] rounded-xl p-1 border border-zinc-200 dark:border-[#1e2d3d]"
          role="tablist"
          aria-label="Donation page version"
        >
          {(['v0', 'v1'] as const).map((v) => {
            const isActive = version === v;
            return (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={isActive}
                id={`donation-version-${v}`}
                onClick={() => setVersion(v)}
                className={`
                  flex-1 relative py-2.5 sm:py-3 rounded-lg text-sm font-semibold
                  transition-all duration-200 ease-out cursor-pointer
                  ${isActive
                    ? 'bg-gradient-to-r from-[#F4B728] to-[#d9a520] text-[#151e29] shadow-md shadow-[#F4B728]/15'
                    : 'text-zinc-500 dark:text-[#5a6a7e] hover:text-zinc-700 dark:hover:text-[#8a9aae]'
                  }
                `}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {version === 'v0' ? <ZcashUAZArt /> : <DonationComp />}
    </>
  );
};

export default DonationClientWrapper;
