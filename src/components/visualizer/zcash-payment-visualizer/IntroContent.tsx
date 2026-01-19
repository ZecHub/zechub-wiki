import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, BadgeCheck } from "lucide-react";

export const IntroContent = () => {
  return (
    <div className="space-y-12">
      {/* Payment flow visualization */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Zcash logo/icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-4xl font-bold text-primary">Z</span>
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
          Privacy-Preserving Digital Cash
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
        </motion.div>

        {/* Payment destination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 rounded-xl bg-card/40 border border-border"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Globe className="w-6 h-6 text-primary" />
            </div>

            <div>
              <h4 className="font-semibold text-foreground">
                Global Merchant Network
              </h4>
              <p className="text-sm text-muted-foreground">
                Pay privately at thousands of merchants worldwide
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Key features grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Privacy First</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Shielded transactions keep your financial data completely private
          </p>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Fast & Low Cost</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Efficient transactions with minimal fees for everyday payments
          </p>
        </div>

        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <BadgeCheck className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Widely Accepted</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Use ZEC at major retailers, online stores, and specialized services
          </p>
        </div>
      </motion.div>
    </div>
  );
};