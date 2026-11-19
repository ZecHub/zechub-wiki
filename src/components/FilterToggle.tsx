"use client";

import React, { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import FilterInfoDialog from "@/components/FilterInfoDialog";
import type {
  WalletFilterCategory,
  WalletFilterDescriptions,
  WalletFilterItemDescriptions,
} from "@/lib/walletFilterInfo";

export type WalletFilterGroups = Partial<
  Record<WalletFilterCategory, Set<string>>
>;

interface FilterToggleProps {
  filters: WalletFilterGroups;
  activeFilters: string[];
  toggleFilter: (filterCategory: string, filterValue: string) => void;
  handleToggleFilter: () => void;
  descriptions?: WalletFilterDescriptions;
  itemDescriptions?: WalletFilterItemDescriptions;
}

interface OpenFilterInfo {
  key: string;
  title: string;
  markdown: string;
}

const infoButtonClass =
  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:text-slate-500 dark:hover:bg-white/10 dark:hover:text-slate-200 dark:focus-visible:ring-offset-slate-900";

const fallbackDescription = (category: WalletFilterCategory) =>
  `Use **${category}** to narrow the wallet list to wallets that match the options in this category. Selecting an option applies the filter, and selecting it again removes it.`;

const fallbackItemDescription = (
  category: WalletFilterCategory,
  value: string,
) =>
  `**${value}** is one of the **${category}** filter options. Selecting it narrows the wallet list to wallets that include this value; select it again to remove the filter.`;

const FilterToggle: React.FC<FilterToggleProps> = ({
  filters,
  activeFilters,
  toggleFilter,
  descriptions = {},
  itemDescriptions = {},
}) => {
  const [openInfo, setOpenInfo] = useState<OpenFilterInfo | null>(null);
  const infoButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const lastOpenKey = useRef<string | null>(null);

  useEffect(() => {
    if (openInfo !== null) return;

    const key = lastOpenKey.current;
    if (!key) return;

    const timeout = window.setTimeout(() => {
      infoButtonRefs.current[key]?.focus();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [openInfo]);

  const categories = Object.entries(filters) as [
    WalletFilterCategory,
    Set<string> | undefined,
  ][];

  const renderInfoButton = (key: string, title: string, markdown: string) => (
    <button
      ref={(node) => {
        infoButtonRefs.current[key] = node;
      }}
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        lastOpenKey.current = key;
        setOpenInfo({ key, title, markdown });
      }}
      onPointerDown={(event) => event.stopPropagation()}
      aria-label={title}
      aria-haspopup="dialog"
      aria-expanded={openInfo?.key === key}
      className={infoButtonClass}
    >
      <Info className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );

  return (
    <>
      <div className="pb-6 imd:block flex flex-wrap justify-between">
        {categories.map(([category, values]) => {
          if (!values || values.size === 0) return null;

          const categoryInfo =
            descriptions[category] ?? fallbackDescription(category);

          return (
            <div key={category} className="mt-7 first:mt-0">
              <div className="mb-3 flex items-center gap-1.5">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {category}
                </h4>
                {renderInfoButton(
                  `category:${category}`,
                  `About the ${category} filter`,
                  categoryInfo,
                )}
              </div>

              <div className="imd:block flex flex-wrap gap-2">
                {[...values].map((value) => (
                  <div key={value} className="mb-1.5 flex items-center gap-0.5">
                    <label className="flex cursor-pointer items-center">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={activeFilters.includes(
                            `${category}:${value}`,
                          )}
                          onChange={() => {
                            toggleFilter(category, value);
                          }}
                        />

                        <div className="w-8 h-4 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 dark:bg-white/20 dark:peer-focus-visible:ring-offset-slate-900"></div>

                        <div className="dot absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                      </div>
                      <span className="ml-2.5 text-sm text-slate-700 dark:text-slate-200">
                        {value}
                      </span>
                    </label>
                    {renderInfoButton(
                      `item:${category}:${value}`,
                      `About ${value}`,
                      itemDescriptions[category]?.[value] ??
                        fallbackItemDescription(category, value),
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {openInfo && (
        <FilterInfoDialog
          title={openInfo.title}
          markdown={openInfo.markdown}
          onClose={() => setOpenInfo(null)}
        />
      )}
    </>
  );
};

export default FilterToggle;
