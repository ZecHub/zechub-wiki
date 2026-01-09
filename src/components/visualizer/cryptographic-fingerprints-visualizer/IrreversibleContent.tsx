import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, XCircle } from "lucide-react";

export const IrreversibleContent = () => {
  return (
    <div className="space-y-8">
      {/* One-way function visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Forward direction - easy */}
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="flex-1 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
            <code className="text-sm font-mono text-foreground">
              &quot;password123&quot;
            </code>
          </div>
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, repeat: Infinity, repeatDelay: 3 }}
            className="flex flex-col items-center"
          >
            <ArrowRight className="w-8 h-8 text-emerald-500" />
            <span className="text-xs text-emerald-500 mt-1">Easy ✓</span>
          </motion.div>
          <div className="flex-1 p-4 rounded-lg bg-card border border-border text-center">
            <code className="text-xs font-mono text-muted-foreground break-all">
              ef92b778...2d3f
            </code>
          </div>
        </div>

        {/* Reverse direction - impossible */}
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="flex-1 p-4 rounded-lg bg-card border border-border text-center">
            <code className="text-xs font-mono text-muted-foreground">???</code>
          </div>
          <motion.div className="flex flex-col items-center">
            <div className="relative">
              <ArrowRight className="w-8 h-8 text-destructive rotate-180" />
              <XCircle className="w-4 h-4 text-destructive absolute -top-1 -right-1" />
            </div>
            <span className="text-xs text-destructive mt-1">Impossible ✗</span>
          </motion.div>
          <div className="flex-1 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-center">
            <code className="text-xs font-mono text-foreground break-all">
              ef92b778...2d3f
            </code>
          </div>
        </div>
      </motion.div>

      {/* Why it matters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-5 rounded-xl bg-primary/10 border border-primary/30">
          <Lock className="w-6 h-6 text-primary mb-3" />
          <h4 className="font-semibold text-foreground mb-2">
            Password Storage
          </h4>
          <p className="text-sm text-muted-foreground">
            Websites store hashes, not passwords. Even if database is stolen,
            attackers can&apo;t reverse the hashes.
          </p>
        </div>
        <div className="p-5 rounded-xl bg-primary/10 border border-primary/30">
          <Shield className="w-6 h-6 text-primary mb-3" />
          <h4 className="font-semibold text-foreground mb-2">
            Commitment Schemes
          </h4>
          <p className="text-sm text-muted-foreground">
            Commit to a value by publishing its hash. Reveal later — others can
            verify you haven&apo;t changed it.
          </p>
        </div>
      </motion.div>

      {/* Mathematical explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h4 className="font-semibold text-foreground mb-3">
          Why Irreversible?
        </h4>
        <p className="text-sm text-muted-foreground">
          Hash functions compress data (many-to-one). A 256-bit hash could
          represent infinite possible inputs. Finding the original is
          computationally infeasible — it would take longer than the age of the
          universe.
        </p>
      </motion.div>
    </div>
  );
};
