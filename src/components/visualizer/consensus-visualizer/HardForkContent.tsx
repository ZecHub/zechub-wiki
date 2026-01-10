import { motion } from "framer-motion"
import { CheckCircle, GitBranch, XCircle } from "lucide-react"

export const HardForkContent = () => {
  return (
    <div className="space-y-8">
      {/* Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-full max-w-lg">
          {/* Pre-fork chain */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="w-14 h-14 rounded-lg bg-card border border-border flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">B{i}</span>
              </motion.div>
            ))}
          </div>

          {/* Fork point */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex justify-center my-4"
          >
            <GitBranch className="w-8 h-8 text-destructive" />
          </motion.div>

          {/* Two chains */}
          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="flex gap-1">
                {[4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg bg-muted/50 border border-border flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground">B{i}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground mt-2">
                Old Chain
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="flex gap-1">
                {[4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-lg bg-primary/20 border-2 border-primary flex items-center justify-center"
                  >
                    <span className="text-xs text-primary">B{i}&apos;</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-primary mt-2">New Chain</span>
            </motion.div>
          </div>
        </div>
      </motion.div>


    </div>
  );
};
