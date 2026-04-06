import { cn } from "@/lib/util";
import React, { useState } from "react";

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
  <div className="flex flex-wrap gap-1 bg-muted dark:bg-gray-800 bg-slate-100 p-1.5 rounded-2xl mb-6">
    {children}
  </div>
);

// Kept for backward compatibility
export const TabsList2 = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex space-x-1 overflow-x-auto", className)}
    {...props}
  />
));
TabsList2.displayName = "TabsList2";

export const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
}: any) => (
  <button
    className={cn(
      "cursor-pointer px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex-shrink-0 whitespace-nowrap min-w-[65px]",
      activeTab === value
        ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-700",
    )}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, children, activeTab }: any) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
);
