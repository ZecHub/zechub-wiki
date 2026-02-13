import { Coins, FileText, TrendingUp, Users } from "lucide-react";

export function StatusBar() {
  const stats = [
    { icon: FileText, label: "ZIPs Tracked", value: 0 },
    {
      icon: Coins,
      label: "Total Funding",
      value: 2000,
    },
    {
      icon: TrendingUp,
      label: "Active Grants",
      value: 2000,
    },
    {
      icon: Users,
      label: "Organizations",
      value: 3999,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-slate-300 dark:border-slate-600 border-border 
          bg-slate-100 dark:bg-slate-800 p-4 flex items-center gap-3"
        >
          <div className="rounded-md bg-slate-600 dark:bg-primary/5 p-2">
            <stat.icon className="h-4 w-4 text-primary " />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground font-mono">
              {stat.value}
            </p>
            <p className="text-[12px] text-slate-800 dark:text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
