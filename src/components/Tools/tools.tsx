"use client";

import { useEffect, useState } from "react";

// ToolOptions is used to encapsulate each tool item
export enum ToolOptions {
  supply = "supply",
  transaction = "transaction",
  nodecount = "nodecount",
  difficulty = "difficulty",
  lockbox = "lockbox",
  net_inflows_outflows = "net_inflows_outflows",
  issuance = "issuance",
}

// Map enum values to display names in select tag
const toolOptionLabels: Record<ToolOptions, string> = {
  [ToolOptions.supply]: "Shielded Supply Chart (ZEC)",
  [ToolOptions.transaction]: "Shielded Transactions Chart",
  [ToolOptions.nodecount]: "Node Count",
  [ToolOptions.difficulty]: "Difficulty",
  [ToolOptions.lockbox]: "Lockbox ZEC Amount",
  [ToolOptions.net_inflows_outflows]: "Net Inflows & Outflows",
  [ToolOptions.issuance]: "Issuance Chart (ZEC)",
};

interface ToolsProps {
  onToolChange: (selectedTool: string) => void;
  defaultSelected?: ToolOptions;
}

export const Tools: React.FC<ToolsProps> = ({ 
  onToolChange, 
  defaultSelected = ToolOptions.supply 
}) => {
  const [selectedTool, setSelectedTool] = useState<ToolOptions>(defaultSelected);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ToolOptions;
    setSelectedTool(value);
    onToolChange(value);
  };

  useEffect(() => {
    // Initialize with default selection
    onToolChange(defaultSelected);
  }, [defaultSelected, onToolChange]);

  return (
    <div className="flex justify-end gap-2 text-right my-4 text-sm text-gray-500">
      <span className="px-3 py-2">Tools:</span>
      <span>
        <select
          onChange={handleSelectChange}
          value={selectedTool}
          className="outline-none focus:outline-none focus:border-slate-300 active:border-slate-300 border-solid border-slate-300 rounded-md px-3 py-2"
        >
          {Object.values(ToolOptions).map((option) => (
            <option 
              key={option} 
              value={option}
            >
              {toolOptionLabels[option]}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
};