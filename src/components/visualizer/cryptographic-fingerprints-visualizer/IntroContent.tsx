import { motion } from "framer-motion";
import { Coins, Eye, Shield } from "lucide-react";
import {  Stage } from "./types";
 
export const IntroContent = ({ stage }: { stage: Stage }) => {
 

  return (
    <div className="space-y-12">
      {/* Animated icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-12 my-16"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="p-4 rounded-xl bg-pool-transparent/10 border border-pool-transparent/30">
            <Eye className="w-8 h-8 text-pool-transparent" />
          </div>
          <span className="text-xs text-muted-foreground">Transparent</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="p-4 rounded-xl bg-pool-sapling/10 border border-pool-sapling/30">
            <Shield className="w-8 h-8 text-pool-sapling" />
          </div>
          <span className="text-xs text-muted-foreground">Sapling</span>
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="p-4 rounded-xl bg-pool-orchard/10 border border-pool-orchard/30">
            <Coins className="w-8 h-8 text-pool-orchard" />
          </div>
          <span className="text-xs text-muted-foreground">Orchard</span>
        </motion.div>
      </motion.div>
      
    </div>
  );
};
