"use client";

import { useEffect, useState } from "react";

export enum NamadaToolOptions {
  supply = "supply", 
  rewards = "rewards", 
}

export const namadatoolOptionLabels: Record<NamadaToolOptions, string> = {
  [NamadaToolOptions.supply]: "Shielded Supply Chart",
  [NamadaToolOptions.rewards]: "Namada Rewards Chart",
};

interface NamadaToolsProps {
  onNamadaToolChange: (selectedNamadaTool: NamadaToolOptions) => void;
  defaultSelected?: NamadaToolOptions;
}

export const NamadaTools: React.FC<NamadaToolsProps> = ({ 
  onNamadaToolChange, 
  defaultSelected = NamadaToolOptions.supply 
}) => {
  const [selectedNamadaTool, setSelectedNamadaTool] = useState<NamadaToolOptions>(defaultSelected);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as NamadaToolOptions;
    setSelectedNamadaTool(value);
    onNamadaToolChange(value);
  };

  console.log("NamadaTools selectedNamadaTool", selectedNamadaTool);
  // Initialize with default selection
  useEffect(() => {
    onNamadaToolChange(defaultSelected);
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className="flex justify-end gap-2 text-right my-4 text-sm text-gray-500">
      <span className="px-3 py-2">Tools:</span>
      <select
        onChange={handleSelectChange}
        value={selectedNamadaTool}
        className="outline-none focus:outline-none dark:bg-gray-800 dark:text-gray-200 focus:border-slate-300 active:border-slate-300 border-solid border-slate-300 rounded-md px-3 py-2"
      >
        {Object.values(NamadaToolOptions).map((option) => (
          <option key={option} value={option}>
            {namadatoolOptionLabels[option]}
          </option>
        ))}
      </select>
    </div>
  );
};