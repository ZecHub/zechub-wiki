import { motion } from "framer-motion";
import { Lock, Shield } from "lucide-react";

export const CommitmentVisualization = () => {
  <div className="space-y-6 w-full">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <Lock className="w-16 h-16 mx-auto text-primary mb-4" />
      <p className="text-sm text-muted-foreground">Input Data</p>
    </motion.div>

    <div className="grid grid-cols-3 gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center"
      >
        <p className="text-xs text-muted-foreground mb-1">Value</p>
        <p className="font-mono text-sm">1.0 ZEC</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-lg bg-primary/10 border-primary/20 text-center"
      >
        <p className="text-sm text-muted-foreground mb-1">Recipient</p>
        <p className="text-sm font-mono">zs1...</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center"
      >
        <p className="text-xs text-muted-foreground mb-1">Random</p>
        <p className="font-mono text-sm">0x9f3...</p>
      </motion.div>
    </div>

    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.8 }}
      className="flex justify-center"
    >
      <div className="text-4xl text-muted-foreground">↓</div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="p-6 rounded-lg bg-secondary/10 border border-secondary/20 text-center"
    >
      <Shield className="w-12 h-12 mx-auto text-secondary mb-2" />
      <p className="text-xs text-muted-foreground mb-2">Commitment (Hash)</p>
      <p className="font-mono text-xs break-all">
        cm = HASH(value, recipient, random)
      </p>
    </motion.div>
  </div>;
};
