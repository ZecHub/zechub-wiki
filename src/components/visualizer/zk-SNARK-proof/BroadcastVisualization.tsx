import { motion } from "framer-motion";
import { Radio } from "lucide-react";

export const BroadcastVisualization = () => (
  <div className="space-y-8 w-full">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex justify-center"
    >
      <div className="relative">
        <Radio className="w-20 h-20 text-secondary" />
        <motion.div
          animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full border-4 border-secondary"
        />
      </div>
    </motion.div>

    <div className="grid grid-cols-2 gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-lg bg-card border border-border"
      >
        <p className="text-xs text-muted-foreground mb-2">Proof (π)</p>
        <div className="h-2 rounded bg-accent/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg bg-card border border-border"
      >
        <p className="text-xs text-muted-foreground mb-2">Nullifiers</p>
        <div className="h-2 rounded bg-destructive/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="p-4 rounded-lg bg-card border border-border"
      >
        <p className="text-xs text-muted-foreground mb-2">Commitments</p>
        <div className="h-2 rounded bg-primary/20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg bg-card border border-border"
      >
        <p className="text-xs text-muted-foreground mb-2">Ephemeral Key</p>
        <div className="h-2 rounded bg-secondary/20" />
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-center text-sm text-muted-foreground"
    >
      Broadcasting to network validators...
    </motion.div>
  </div>
);
