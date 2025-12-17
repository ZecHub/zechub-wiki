import { motion } from "framer-motion";
import { PoolContainer } from "./PoolContainer";
import { POOLS, PoolType, Stage } from "./types";

export const PoolContent = ({ stage }: { stage: Stage }) => {
  if (!stage.focusPool) return null;

  const focusedPool = POOLS[stage.focusPool];
  const otherPools: PoolType[] = (
    ["transparent", "sapling", "orchard"] as PoolType[]
  ).filter((p) => p !== stage.focusPool);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Other pools (dimmed) */}
      <div className="lg:col-span-1 space-y-4">
        {otherPools.map((poolType, index) => (
          <motion.div
            key={poolType}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <PoolContainer
              pool={POOLS[poolType]}
              isActive={false}
              isFocused={false}
              showDetails={false}
            />
          </motion.div>
        ))}
      </div>

      {/* Focused pool (large) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-2"
      >
        <PoolContainer
          pool={focusedPool}
          isActive={true}
          isFocused={true}
          showDetails={true}
          amount="5.25 ZEC"
        />
      </motion.div>
    </div>
  );
};
