import { motion } from "framer-motion";
import { CheckCircle2, Shield } from "lucide-react";

export const ProofVisualization = () => (
  <div className="space-y-6 w-full">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <div className="relative inline-block">
        <Shield className="w-20 h-20 text-accent" />
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
        />
      </div>
      <p className="mt-4 text-lg font-semibold">Generating zk-SNARK Proof</p>
    </motion.div>

    <div className="space-y-3">
      {[
        "Valid ownership",
        "Correct nullifiers",
        "Valid commitments",
        "Balanced amounts",
      ].map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2 + 0.3 }}
          >
            <CheckCircle2 className="w-5 h-5 text-secondary" />
          </motion.div>
          <span className="text-sm">{item}</span>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center"
    >
      <p className="text-xs text-muted-foreground mb-2">Proof Generated</p>
      <p className="font-mono text-xs break-all">
        π = zk-SNARK(statements, witness)
      </p>
    </motion.div>
  </div>
);
