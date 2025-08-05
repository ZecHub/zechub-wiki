import { useState } from "react";

// Tabs component - simple implementation
export const Tabs = ({ children, defaultValue, value, onValueChange }: any) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  return (
    <div className="tabs-container">
      {children({ activeTab, setActiveTab: handleTabChange })}
    </div>
  );
};

export const TabsList = ({ children }: any) => (
  <div className="flex space-x-1 rounded-lg bg-muted bg-slate-100 p-1 mb-4 overflow-x-auto">
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }: any) => (
  <button
    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-slate-600"
    }`}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, children, activeTab }: any) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
);
