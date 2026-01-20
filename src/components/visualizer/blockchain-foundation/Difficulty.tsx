import { motion } from "framer-motion";
import { Clock, Gauge, TrendingUp } from "lucide-react";

export const Difficulty = () => {
  return (
    <div className="space-y-6">
      {/* Block time comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-bold text-foreground">Zcash</h3>
              <p className="text-2xl font-bold text-primary">75 seconds</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Target block time</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
            <div>
              <h3 className="font-bold text-foreground">Bitcoin</h3>
              <p className="text-2xl font-bold text-muted-foreground">
                10 minutes
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">For comparison</p>
        </div>
      </motion.div>

      {/* Difficulty adjustment explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-primary" />
          Difficulty Adjustment
        </h3>

        <div className="space-y-4">
          {/* Visual representation */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-center flex-1">
              <TrendingUp className="w-8 h-8 text-pool-sapling mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                Hashrate Increases
              </p>
              <p className="text-xs text-muted-foreground">
                Difficulty goes up
              </p>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="text-center flex-1">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Gauge className="w-8 h-8 text-primary mx-auto mb-2" />
              </motion.div>
              <p className="text-sm font-semibold text-foreground">
                Target: 75 sec
              </p>
              <p className="text-xs text-muted-foreground">Stays constant</p>
            </div>
            <div className="h-px flex-1 bg-border" />
            <div className="text-center flex-1">
              <TrendingUp className="w-8 h-8 text-destructive mx-auto mb-2 rotate-180" />
              <p className="text-sm font-semibold text-foreground">
                Hashrate Decreases
              </p>
              <p className="text-xs text-muted-foreground">
                Difficulty goes down
              </p>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4 mt-4">
            <p className="text-sm text-foreground">
              The network automatically adjusts mining difficulty to maintain
              consistent block times, regardless of how many miners are
              competing.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
