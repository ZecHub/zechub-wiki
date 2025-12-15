import { cn } from "@/lib/util";
import { motion } from "framer-motion";
import { ArrowRight, Coins, UserIcon } from "lucide-react";
import { POOLS, PoolType } from "./types";

interface TransactionFlowProps {
  from: PoolType;
  to: PoolType;
  amount: string;
  isAnimating: boolean;
}

export const TransactionFlow = ({
  from,
  to,
  amount,
  isAnimating,
}: TransactionFlowProps) => {
  const fromPool = POOLS[from];
  const toPool = POOLS[to];

  const getPoolColor = (pool: PoolType) => {
    switch (pool) {
      case "transparent":
        return "text-pool-transparent";
      case "sapling":
        return "text-pool-sapling";
      case "orchard":
        return "text-pool-orchard";
    }
  };

  const getPoolBg = (pool: PoolType) => {
    switch (pool) {
      case "transparent":
        return "bg-pool-transparent/20";
      case "sapling":
        return "bg-pool-sapling/20";
      case "orchard":
        return "bg-pool-orchard/20";
    }
  };

  return (
    <div className="relative py-8">
      {/* Transaction Info Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-mono font-bold text-primary">{amount}</span>
        </div>
      </motion.div>

      {/* Flow Visualization */}
      <div className="flex items-center justify-center gap-4 md:gap-8">
        {/* Source Pool */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "flex flex-col items-center p-4 rounded-xl border-2",
            from === "transparent"
              ? "border-pool-transparent/50 bg-pool-transparent/10"
              : from === "sapling"
              ? "border-pool-sapling/50 bg-pool-sapling/10"
              : "border-pool-orchard/50 bg-pool-orchard/10"
          )}
        >
          <span className={cn("text-sm font-medium", getPoolColor(from))}>
            {fromPool.name}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {fromPool.addressPrefix}...
          </span>
          {/* Visibility indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={cn(
              "mt-2 px-2 py-1 rounded text-xs",
              getPoolBg(from),
              getPoolColor(from)
            )}
          >
            {from === "transparent" ? "Visible" : "Hidden"}
          </motion.div>
        </motion.div>

        {/* Flow Arrow with Coins */}
        <div className="relative flex-1 max-w-[200px]">
          {/* Track */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-muted via-primary/50 to-muted transform -translate-y-1/2" />

          {/* Animated Coins */}
          {isAnimating && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 transform -translate-y-1/2"
                  initial={{ left: "0%", opacity: 0, scale: 0.5 }}
                  animate={{
                    left: ["0%", "100%"],
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      "bg-primary text-primary-foreground shadow-lg"
                    )}
                  >
                    <span className="text-xs font-bold">Z</span>
                  </div>
                </motion.div>
              ))}
            </>
          )}
          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full"
          >
            <ArrowRight className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
        {/* Destination Pool */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={cn(
            "flex flex-col items-center p-4 rounded-xl border-2",
            to === "transparent"
              ? "border-pool-transparent/50 bg-pool-transparent/10"
              : to === "sapling"
              ? "border-pool-sapling/50 bg-pool-sapling/10"
              : "border-pool-orchard/50 bg-pool-orchard/10"
          )}
        >
          <span className={cn("text-sm font-medium", getPoolColor(to))}>
            {toPool.name}
          </span>
          <span className="text-xs text-muted-foreground mt-1">
            {toPool.addressPrefix}...
          </span>

          {/* Visibility indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={cn(
              "mt-2 px-2 py-1 rounded text-xs",
              getPoolBg(to),
              getPoolColor(to)
            )}
          >
            {to === "transparent" ? "Visible" : "Hidden"}
          </motion.div>
        </motion.div>
      </div>

      {/* Transaction Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8 grid grid-cols-3 gap-4 text-center text-sm"
      >
        <div className="flex flex-col items-center space-y-2">
          <UserIcon />
          <p className="text-muted-foreground text-xs">Sender</p>
          <p className={cn("font-medium", getPoolColor(from))}>
            {from === "transparent" ? "Public" : "Private"}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">Amount</p>
          <p
            className={cn(
              "font-mono font-medium",
              from === "transparent" && to === "transparent"
                ? "text-pool-transparent"
                : "text-primary"
            )}
          >
            {from === "transparent" && to === "transparent"
              ? amount
              : "Encrypted"}
          </p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <UserIcon />
          <p className="text-muted-foreground text-xs">Receiver</p>
          <p className={cn("font-medium", getPoolColor(to))}>
            {to === "transparent" ? "Public" : "Private"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
