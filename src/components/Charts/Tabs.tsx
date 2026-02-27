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
  <div className="flex space-x-1 rounded-lg bg-muted dark:bg-gray-800 bg-slate-100 p-1 mb-4 overflow-x-auto">
    {children}
  </div>
);

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

TabsList2.displayName = "CardHeader";

export const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
  borderBottom,
}: any) => (
  <button
    className={`px-3 py-2 text-sm inline-flex flex-shrink-0 font-medium rounded-md transition-colors ${
      activeTab === value
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:text-slate-600"
    }
    ${borderBottom && activeTab === value ? "border-b-2 dark:border-primary rounded-none" : ""}
    `}
    onClick={() => setActiveTab(value)}
  >
    {children}
  </button>
);

export const TabsContent = ({ value, children, activeTab }: any) => (
  <div className={activeTab === value ? "block" : "hidden"}>{children}</div>
);
