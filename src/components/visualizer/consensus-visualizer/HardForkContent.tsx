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
                className="w-14 h-14 rounded-lg dark:bg-card/40 bg-slate-100 border dark:border-slate-700 border-slate-300 border-border flex items-center justify-center"
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
                    className="w-12 h-12 rounded-lg dark:bg-muted/50 bg-muted/20 border dark:border-slate-700 border-slate-300 border-border flex items-center justify-center"
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

      {/* Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl dark:bg-card/40 bg-slate-100 border dark:border-slate-700 border-slate-300 border-border"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-destructive" />
          What is a Hard Fork?
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          A non-backward-compatible change. Old nodes <em>reject</em> new
          blocks. Without universal upgrade, the chain splits into two separate
          networks.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <CheckCircle className="w-4 h-4 text-emerald-500 mb-2" />
            <span className="text-sm font-medium text-foreground">
              Advantages
            </span>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Can add any new feature</li>
              <li>• Clean protocol upgrades</li>
              <li>• All nodes on same rules</li>
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10">
            <XCircle className="w-4 h-4 text-destructive mb-2" />
            <span className="text-sm font-medium text-foreground">Risks</span>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Can split the community</li>
              <li>• Requires coordination</li>
              <li>• May create competing coins</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Famous examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg bg-muted/20 dark:border  dark:border-slate-700 border-slate-300 border border-border"
      >
        <span className="text-sm font-medium text-foreground">
          Famous Hard Forks:{" "}
        </span>
        <span className="text-sm dark:text-muted-foreground text-slate-700">
          Bitcoin Cash (from Bitcoin), Ethereum Classic (from Ethereum)
        </span>
      </motion.div>
    </div>
  );
};
