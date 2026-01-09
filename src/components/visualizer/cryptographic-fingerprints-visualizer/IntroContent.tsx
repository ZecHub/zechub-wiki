import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Stage } from "./types";

export const IntroContent = ({ stage }: { stage: Stage }) => {
  return (
    <div className="space-y-12">
      {/* Animated icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col justify-center items-center gap-12 my-16"
      >
        {/* Forward direction - easy */}
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <code className="text-sm font-mono text-foreground">
              &quot;password123&quot;
            </code>
          </div>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 20 }}
              transition={{
                duration: 1.2,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <ArrowRight className="w-8 h-8 text-emerald-500" />
            </motion.div>

            <span className="text-xs text-emerald-500 mt-1">
              HashFucntion("password123")
            </span>
          </div>
          <div className="flex-1 p-4 rounded-lg dark:bg-card/40  bg-emerald-400/30 dark:border border-border text-center">
            <code className="text-xs font-mono dark:text-muted-foreground break-all">
              ef92b778...2d3f
            </code>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <code className="text-sm font-mono text-foreground">
              200GB of data
            </code>
          </div>
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ x: -20 }}
              animate={{ x: 20 }}
              transition={{
                duration: 1.2,
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <ArrowRight className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <span className="text-xs text-emerald-500 mt-1">
              HashFucntion("200GB")
            </span>
          </div>
          <div className="flex-1 p-4 rounded-lg dark:bg-card/40  bg-emerald-400/30 dark:border border-border text-center">
            <code className="text-xs font-mono dark:text-muted-foreground break-all">
              awoh82wq...pzs8
            </code>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
