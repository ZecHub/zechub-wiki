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


    </div>
  );}
