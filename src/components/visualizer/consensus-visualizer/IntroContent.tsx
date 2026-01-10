import { motion } from "framer-motion";
import { Network } from "lucide-react";

export const IntroContent = () => {
  return (
    <div className="space-y-8">
      {/* Decentralized network visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="relative flex justify-center py-8"
      >
        <div className="relative w064 h-64">
          {/* Central concept */}

          <motion.div className="absolute top-1/2 -translate-x-1/2 -transy-1/2 z-10">
            <div className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/40">
              <Network className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
