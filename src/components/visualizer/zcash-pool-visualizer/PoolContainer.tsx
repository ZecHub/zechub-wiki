import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";
import { PoolData } from "./types";
import { cn } from "@/lib/util";

interface PoolContainerProps {
  pool: PoolData;
  isActive?: boolean;
  isFocused?: boolean;
  showDetails?: boolean;
  amount?: string;
  className?: string;
}

const privacyIcons = {
  none: Eye,
  partial: Shield,
  full: Lock,
};

const privacyLabels = {
  none: "Fully Visible",
  partial: "Shielded",
  full: "Maximum Privacy",
};


export const PoolContainer = ({
  pool,
  isActive = true,
  isFocused = false,
  showDetails = false,
  amount,
  className,
}: PoolContainerProps) => {
  const Icon = privacyIcons[pool.privacyLevel];

  const getPoolStyles = () => {
    switch (pool.type) {
      case "transparent":
        return {
          border: "border-pool-transparent/50",
          bg: "bg-pool-transparent/10",
          glow: isFocused ? "glow-transparent" : "",
          text: "text-pool-transparent",
        };
      case "sapling":
        return {
          border: "border-pool-sapling/50",
          bg: "bg-pool-sapling/10",
          glow: isFocused ? "glow-sapling" : "",
          text: "text-pool-sapling",
        };
      case "orchard":
        return {
          border: "border-pool-orchard/50",
          bg: "bg-pool-orchard/10",
          glow: isFocused ? "glow-orchard" : "",
          text: "text-pool-orchard",
        };
    }
  };

  const styles = getPoolStyles();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isActive ? 1 : 0.4,
        scale: isFocused ? 1.05 : 1,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative rounded-xl border-2 p-6 transition-all duration-300",
        styles.border,
        styles.bg,
        styles.glow,
        isFocused && "z-10",
        className
      )}
    >
      {/* Pool Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: isFocused ? [0, 10, -10, 0] : 0 }}
            transition={{
              duration: 0.5,
              repeat: isFocused ? Infinity : 0,
              repeatDelay: 2,
            }}
            className={cn("p-2 rounded-lg", styles.bg, styles.text)}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <h3 className={cn("font-semibold text-lg", styles.text)}>
              {pool.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {pool.addressPrefix}...
            </p>
          </div>
        </div>

        <div
          className={cn(
            "text-xs px-2 py-1 rounded-full",
            styles.bg,
            styles.text
          )}
        >
          {privacyLabels[pool.privacyLevel]}
        </div>
      </div>

      {/* Pool Visual */}
      <motion.div
        className={cn(
          "relative h-24 rounded-lg overflow-hidden",
          pool.type === "transparent"
            ? "bg-gradient-to-b from-pool-transparent/20 to-transparent border border-pool-transparent/30"
            : pool.type === "sapling"
            ? "bg-gradient-to-b from-pool-sapling/20 to-pool-sapling/5"
            : "bg-gradient-to-b from-pool-orchard/20 to-pool-orchard/5"
        )}
      >
        {/* Glass/Frosted effect for shielded pools */}
        {pool.type !== "transparent" && (
          <div className="absolute inset-0 backdrop-blur-sm" />
        )}

        {/* Amount display */}
        {amount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className={cn("font-mono text-2xl font-bold", styles.text)}>
              {pool.type === "transparent" ? amount : "••••"}
            </span>
          </motion.div>
        )}

        {/* Animated particles for shielded pools */}
        {pool.type !== "transparent" && isFocused && (
          <div className="absolute inset-0">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute w-1 h-1 rounded-full", styles.bg)}
                initial={{ x: "50%", y: "100%", opacity: 0 }}
                animate={{
                  x: `${20 + Math.random() * 60}%`,
                  y: `${Math.random() * 80}%`,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Details Section */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 space-y-3"
        >
          <p className="text-sm text-muted-foreground">{pool.description}</p>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Example Address:</p>
            <code
              className={cn(
                "block text-xs font-mono p-2 rounded bg-secondary/50 break-all",
                styles.text
              )}
            >
              {pool.exampleAddress.length > 40
                ? `${pool.exampleAddress.slice(
                    0,
                    20
                  )}...${pool.exampleAddress.slice(-15)}`
                : pool.exampleAddress}
            </code>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
