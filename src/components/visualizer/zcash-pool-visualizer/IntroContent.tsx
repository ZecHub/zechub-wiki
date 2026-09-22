import { motion } from "framer-motion";
import { Coins, Eye, Shield, VerifiedIcon } from "lucide-react";
import { PoolContainer } from "./PoolContainer";
import { POOLS, PoolType, Stage } from "./types";

export const IntroContent = ({ stage }: { stage: Stage }) => {
  const pools: PoolType[] = ["transparent", "sapling", "orchard", "ironwood"];
  const icons = [Eye, Shield, Coins, VerifiedIcon];

  const poolIcons = pools.map((p, i) => ({
    pool: p,
    icon: icons[i],
    delay: 0.3 * i,
  }));

  return (
    <div className="space-y-12">
      {/* Animated icons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-12 my-16"
      >
        {poolIcons.map((p) => (
          <motion.div
            key={p.pool}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: p.delay }}
            className="flex flex-col items-center gap-2"
          >
            <div className="p-4 rounded-xl bg-pool-transparent/10 border border-pool-transparent/30">
              {<p.icon className="w-8 h-8 text-pool-transparent" />}
            </div>
            <span className="text-xs text-muted-foreground">{p.pool}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Pool preview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
        {pools.map((poolType, index) => (
          <motion.div
            key={poolType}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.15 }}
          >
            <PoolContainer
              pool={POOLS[poolType]}
              isActive={true}
              isFocused={false}
              showDetails={true}
              amount="0.1 ZEC"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
