// components/FilterToggle.tsx
import React from "react";

interface FilterToggleProps {
  filters: {
    Devices: Set<string>;
    "Operating System": Set<string>;
    Pools: Set<string>;
    "Wallet Support": Set<string>;
    Features: Set<string>;
    Ironwood?: Set<string>;
  };
  activeFilters: string[];
  toggleFilter: (filterCategory: string, filterValue: string) => void;
  handleToggleFilter: () => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
  filters,
  activeFilters,
  toggleFilter,
  handleToggleFilter,
}) => {
  return (
    <div className="pb-6 imd:block flex flex-wrap justify-between">
      {Object.entries(filters)
        .filter(([, values]) => values && values.size > 0)
        .map(([category, values]) => (
        <div key={category} className="mt-7 first:mt-0">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{category}</h4>
          <div className="imd:block flex flex-wrap gap-2">
            {[...values].map((value) => (
              <label
                key={value}
                className="mb-1.5 flex cursor-pointer items-center"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={activeFilters.includes(`${category}:${value}`)}
                    onChange={() => {
                      toggleFilter(category, value);
                    }}
                  />

                  <div className="w-8 h-4 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 dark:bg-white/20 dark:peer-focus-visible:ring-offset-slate-900"></div>

                  <div className="dot absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="ml-2.5 text-sm text-slate-700 dark:text-slate-200">{value}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterToggle;
