import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Key, Sparkles } from "lucide-react";

export const IntroContent = () => {
  return (
    <div className="space-y-12">
      {/* Key generation flow */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Entropy visualization */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br dark:from-primary/20 dark:to-primary/5 border from-primary/30 to-primary/25 dark:border-primary/30 border-primary/80  flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
          </div>

          <motion.div
            className="absolute -inset-4 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-muted-foreground text-center"
        >
          Random Entropy (256 bits)
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </motion.div>

        {/* Key derivation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-xl dark:bg-card/40 bg-card/10 dark:border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Key className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h4 className="font-semibold text-foreground">
                Private Key (Spending Key)
              </h4>
              <p className="text-sm text-muted-foreground">
                The master secret that controls your funds
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Key types grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="p-4 rounded-lg bg-pool-transparent/10 border border-pool-transparent/30">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-pool-transparent" />
            <h4 className="font-medium text-foreground">Transparent Keys</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Similar to Bitcoin - public keys and addresses are derived from
            private keys using Elliptic Curve cryptography.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-pool-sapling/10 border border-pool-sapling/30">
          <div className="flex items-center gap-3 mb-2">
            <EyeOff className="w-5 h-5 text-pool-sapling" />
            <h4 className="font-medium text-foreground">Shielded Keys</h4>
          </div>

          <p className="text-sm text-muted-foreground">
            Complex key hierarchy with spending keys, viewing keys, and
            diversified addresses for maximum privacy.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
