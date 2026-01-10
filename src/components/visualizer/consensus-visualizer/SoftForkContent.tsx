import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, GitMerge } from "lucide-react"

export const SoftForkContent = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center"
      >
        <div className="relative w-full max-w-lg">
          {/* Main chain */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="w-16 h-16 rounded-lg bg-card border border-border flex items-center justify-center"
              >
                <span className="text-xs text-muted-foreground">Block {i}</span>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="w-16 h-16 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
            >
              <span className="text-xs text-emerald-500 font-medium">
                New Rules
              </span>
            </motion.div>
          </div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center mt-4"
          >
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">Old nodes still accept new blocks</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <GitMerge className="w-5 h-5 text-primary" />
          What is a Soft Fork?
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          A backward-compatible protocol upgrade. New rules are a{" "}
          <em>subset</em> of old rules. Upgraded nodes enforce stricter rules,
          but old nodes still accept new blocks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <CheckCircle className="w-4 h-4 text-emerald-500 mb-2" />
            <span className="text-sm font-medium text-foreground">
              Advantages
            </span>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• No forced upgrade for all nodes</li>
              <li>• Maintains network unity</li>
              <li>• Lower coordination overhead</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-warning/10">
            <AlertTriangle className="w-4 h-4 text-warning mb-2" />
            <span className="text-sm font-medium text-foreground">
              Limitations
            </span>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Can only tighten rules, not relax</li>
              <li>• Old nodes get reduced security</li>
              <li>• Complex to implement safely</li>
            </ul>
          </div>
        </div>
      </motion.div>


    </div>
  );}
