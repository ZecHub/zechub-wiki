// components/FilterToggle.tsx
import React from "react";

interface FilterToggleProps {
  filters: {
    Devices: Set<string>;
    Pools: Set<string>;
    Features: Set<string>;
  };
  activeFilters: string[];
  toggleFilter: (filterCategory: string, filterValue: string) => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
  filters,
  activeFilters,
  toggleFilter,
}) => {
  return (
    <div class="pb-6">
      {Object.entries(filters).map(([category, values]) => (
        <div key={category}>
          <h4 className="text-xl font-bold mt-6 mb-3">{category}</h4>
          {[...values].map((value) => (
            <label
              key={value}
              className="flex items-center cursor-pointer mb-1"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={activeFilters.includes(`${category}:${value}`)}
                  onChange={() => toggleFilter(category, value)}
                />

                <div className="w-8 h-4 bg-gray-200 dark:bg-gray-400 rounded-full peer-checked:bg-blue-500 transition-colors"></div>

                <div className="dot absolute left-[2px] top-[2px] w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
              </div>
              <span className="ml-2 text-sm">{value}</span>
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FilterToggle;
