import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";

export const ShieldedOverviewContent = () => {
  const protocols = [
    {
      name: "Sprout",
      era: "2016",
      status: "Deprecated",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    {
      name: "Sapling",
      era: "2018",
      status: "Active",
      color: "text-pool-sapling",
      bgColor: "bg-pool-sapling/10",
    },
    {
      name: "Orchard",
      era: "2022",
      status: "Latest",
      color: "text-pool-orchard",
      bgColor: "bg-pool-orchard/10",
    },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-card. border border-border"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Shielded Key Hierarchy
        </h4>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <Lock className="w-5 h-5 text-destructive" />
            <div>
              <span className="font-medium text-foreground">Spending Key</span>
              <span className="text-sm text-muted-foreground ml-2">
                - Full control, can spend funds
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30 ml-4">
            <Eye className="w-5 h-5 text-primary" />
            <div>
              <span className="font-medium text-foreground">Spending Key</span>
              <span className="text-sm text-muted-foreground ml-2">
                - Full control, can spend funds
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/30 ml-8">
            <EyeOff className="w-5 h-5 text-primary" />
            <div>
              <span className="font-medium text-foreground">
                Incoming Viewing Key
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                - View incoming only
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {protocols.map((p, idx) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className={`p-4 rounded-xl ${p.bgColor} border border-border`}
          >
            <div className="flex items-center justify-center mb-2">
              <h4 className={`font-semibold ${p.color}`}>{p.name}</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-background/50 text-muted-foreground">
                {p.era}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{p.status}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
