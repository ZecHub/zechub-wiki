import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";

export const MerkleVisualization = () => (
  <div className="space-y-6 w-full">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <GitBranch className="w-16 h-16 mx-auto text-primary mb-2" />
      <p className="text-sm text-muted-foreground">Merkle Tree Structure</p>
    </motion.div>

    <div className="relative">
      {/* Root */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="p-3 rounded-lg bg-primary/20 border border-primary/30">
          <p className="text-xs font-mono">Root</p>
        </div>
      </motion.div>

      {/* Level 1 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center gap-8 mb-8"
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            className="p-2 rounded bg-secondary/10 border border-secondary/20"
          >
            <p className="text-xs font-mono">H{i}</p>
          </div>
        ))}
      </motion.div>

      {/* Level 2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center gap-4"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`p-2 rounded border text-xs font-mono ${
              i === 3
                ? "bg-accent/20 border-accent/30 text-accent"
                : "bg-muted/20 border-border"
            }`}
          >
            {i === 3 ? "New" : `C${i}`}
          </div>
        ))}
      </motion.div>
      {/* Connection lines */}
      <svg className="absolute inset-0 -z-10" width="100%" height="100%">
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          x1="50%"
          y1="15%"
          x2="40%"
          y2="35%"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.3"
        />
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          x1="50%"
          y1="15%"
          x2="60%"
          y2="35%"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          opacity="0.3"
        />
      </svg>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-xs text-center text-muted-foreground"
    >
      New commitment added to tree
    </motion.p>
  </div>
);
