import { motion } from "framer-motion";
import { Key } from "lucide-react";

export const NullifierVisualization = () => (
  <div className="space-y-8 w-full">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-lg bg-card border border-primary/20"
    >
      <Key className="w-12 h-12 text-primary mb-4" />
      <p className="text-sm font-semibold mb-2">Spending Key</p>
      <p className="font-mono text-xs text-muted-foreground">sk = 0xa7b3c...</p>
    </motion.div>

    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      className="flex justify-center"
    >
      <div className="w-16 h-16 rounded-full border-4 border-secondary border-t-transparent" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-lg bg-destructive/10 border border-destructive/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <p className="text-sm font-semibold">Unique Nullifier</p>
          <p className="font-mono text-xs text-muted-foreground">
            nf = HASH(sk, note)
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Once published, prevents double-spending
      </p>
    </motion.div>
  </div>
);
