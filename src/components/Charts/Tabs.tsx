import { cn } from "@/lib/util";
import React, { useState, useMemo, ReactNode } from "react";

// Improved performant Tabs - only mounts the active tab
export const Tabs = ({
  children,
  defaultValue,
  value,
  onValueChange,
}: {
  children: (props: { activeTab: string; setActiveTab: (value: string) => void }) => ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value || "");

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  const tabContent = useMemo(() => {
    return children({ activeTab, setActiveTab: handleTabChange });
  }, [children, activeTab]);

  return <div className="tabs-container">{tabContent}</div>;
};

export const TabsList = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-wrap gap-1 bg-muted dark:bg-gray-800 bg-slate-100 p-1.5 rounded-2xl mb-6">
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
TabsList2.displayName = "TabsList2";

export const TabsTrigger = ({
  value,
  children,
  activeTab,
  setActiveTab,
  borderBottom,        // ← added for backward compatibility
  ...props             // ← accepts any extra props
}: {
  value: string;
  children: ReactNode;
  activeTab: string;
  setActiveTab: (value: string) => void;
  borderBottom?: boolean;
}) => (
  <button
    className={cn(
      "cursor-pointer px-3 py-1.5 text-xs font-medium rounded-xl transition-all flex-shrink-0 whitespace-nowrap min-w-[65px]",
      activeTab === value
        ? "bg-white dark:bg-slate-700 shadow-sm text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-slate-700",
      borderBottom && activeTab === value && "border-b-2 border-blue-500" // optional styling
    )}
    onClick={() => setActiveTab(value)}
    {...props}
  >
    {children}
  </button>
);

// PERFORMANCE KEY CHANGE: Only render the active tab's content
export const TabsContent = ({
  value,
  children,
  activeTab,
}: {
  value: string;
  children: ReactNode;
  activeTab: string;
}) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};
