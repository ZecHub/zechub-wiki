import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const OrchardKeyContent = () => {
  const features = [
    {
      title: "Unified Addresses",
      desc: "Single address encodes multiple receivers (transparent, sapling, orchard)",
    },
    {
      title: "Improved Crypto",
      desc: "Uses Pallas curve instead of Jubjub, with Poseidon hash",
    },
    {
      title: "Action-based",
      desc: 'Replaces input/output model with unified "actions" for better privacy',
    },
    {
      title: "Forwards Compatible",
      desc: "Designed to support future protocol upgrades",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Unified Address explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl dark:bg-pool-orchard/10 bg-pool-orchard/20 border border-pool-orchard/30"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-pool-orchard" />
          Unified Addresses (UA)
        </h4>

        <div className="p-4 rounded-lg dark:bg-card bg-card/10 dark:border border-border mb-4">
          <h5 className="font-medium text-foreground mb-2">Address Format</h5>
          <code className="px-2 py-1 rounded bg-muted/30 text-sm font-mono break-all">
            u1...
          </code>
          <p className="text-sm dark:text-muted-foreground text-slate-600 mt-2">
            Encodes multiple receiver types in a single address
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg dark:bg-background/50 bg-slate-300/40">
            <div className="w-3 h-3 rounded-full bg-pool-transparent" />
            <span className="text-sm text-foreground">
              Transparent receiver (optional)
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg dark:bg-background/50 bg-slate-300/70">
            <div className="w-3 h-3 rounded-full bg-pool-sapling" />
            <span className="text-sm text-foreground">
              Sapling receiver (optional)
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg   dark:bg-background/50 bg-slate-300/90">
            <div className="w-3 h-3 rounded-full bg-pool-orchard" />
            <span className="text-sm text-foreground">
              Orchard receiver (required)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Features grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="p-4 rounded-lg dark:bg-pool-orchard/10 bg-pool-orchard/10  border border-border"
          >
            <h5 className="font-medium text-pool-orchard mb-1">
              {feature.title}
            </h5>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
