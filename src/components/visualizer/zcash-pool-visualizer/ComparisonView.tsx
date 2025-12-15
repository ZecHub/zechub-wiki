import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Lock, Check, X } from "lucide-react";
import { POOLS, PoolType } from "./types";
import { cn } from "@/lib/util";

const comparisonData = [
  {
    feature: "Address Visibility",
    transparent: { value: "Public", icon: Eye, positive: false },
    sapling: { value: "Hidden", icon: EyeOff, positive: true },
    orchard: { value: "Hidden", icon: EyeOff, positive: true },
  },
  {
    feature: "Transaction Amount",
    transparent: { value: "Visible", icon: Eye, positive: false },
    sapling: { value: "Encrypted", icon: Shield, positive: true },
    orchard: { value: "Encrypted", icon: Lock, positive: true },
  },
  {
    feature: "Sender Identity",
    transparent: { value: "Traceable", icon: Eye, positive: false },
    sapling: { value: "Anonymous", icon: Shield, positive: true },
    orchard: { value: "Anonymous", icon: Lock, positive: true },
  },
  {
    feature: "Blockchain Analysis",
    transparent: { value: "Easy", icon: X, positive: false },
    sapling: { value: "Difficult", icon: Shield, positive: true },
    orchard: { value: "Very Hard", icon: Lock, positive: true },
  },
];

const poolOrder: PoolType[] = ["transparent", "sapling", "orchard"];


export const ComparisonView = () => {
  const getPoolStyles = (type: PoolType) => {
    switch (type) {
      case 'transparent':
        return { text: 'text-pool-transparent', bg: 'bg-pool-transparent/10', border: 'border-pool-transparent/30' };
      case 'sapling':
        return { text: 'text-pool-sapling', bg: 'bg-pool-sapling/10', border: 'border-pool-sapling/30' };
      case 'orchard':
        return { text: 'text-pool-orchard', bg: 'bg-pool-orchard/10', border: 'border-pool-orchard/30' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Pool Headers */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div /> {/* Empty cell for feature column */}
        {poolOrder.map((poolType, index) => {
          const pool = POOLS[poolType];
          const styles = getPoolStyles(poolType);

          return (
            <motion.div
              key={pool.type}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "text-center p-4 rounded-xl border",
                styles.bg,
                styles.border
              )}
            >
              <h3 className={cn("font-semibold text-lg", styles.text)}>
                {pool.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {pool.addressPrefix}...
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
