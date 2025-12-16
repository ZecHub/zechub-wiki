import { cn } from "@/lib/util";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Shield, X } from "lucide-react";
import { POOLS, PoolType } from "./types";

const comparisonData = [
  {
    feature: "Address Visibility",
    transparent: { value: "Public", icon: Eye, positive: false },
    sapling: { value: "Hidden", icon: EyeOff, positive: true },
    orchard: { value: "Hidden", icon: EyeOff, positive: true },
  },
  {
    feature: "Transaction Amount",
    transparent: { value: "Visible", icon: Eye, positive: false },
    sapling: { value: "Encrypted", icon: Shield, positive: true },
    orchard: { value: "Encrypted", icon: Lock, positive: true },
  },
  {
    feature: "Sender Identity",
    transparent: { value: "Traceable", icon: Eye, positive: false },
    sapling: { value: "Anonymous", icon: Shield, positive: true },
    orchard: { value: "Anonymous", icon: Lock, positive: true },
  },
  {
    feature: "Blockchain Analysis",
    transparent: { value: "Easy", icon: X, positive: false },
    sapling: { value: "Difficult", icon: Shield, positive: true },
    orchard: { value: "Very Hard", icon: Lock, positive: true },
  },
];

const poolOrder: PoolType[] = ["transparent", "sapling", "orchard"];

type TransactionType = {
  from: "T" | "S" | "O";
  to: "T" | "S" | "O";
  label: string;
};

type PrivacyLevel = "visible" | "hidden" | "partial";

interface TransactionPrivacy {
  sender: PrivacyLevel;
  receiver: PrivacyLevel;
  amount: PrivacyLevel;
  memo: PrivacyLevel;
  overallPrivacy: "none" | "low" | "medium" | "high" | "maximum";
}

const transactionTypes: TransactionType[] = [
  { from: "T", to: "T", label: "T → T" },
  { from: "T", to: "S", label: "T → S" },
  { from: "T", to: "O", label: "T → O" },
  { from: "S", to: "T", label: "S → T" },
  { from: "S", to: "S", label: "S → S" },
  { from: "S", to: "O", label: "S → O" },
  { from: "O", to: "T", label: "O → T" },
  { from: "O", to: "S", label: "O → S" },
  { from: "O", to: "O", label: "O → O" },
];

type FromTxType = "T" | "S" | "O";
type ToTxType = "T" | "S" | "O";

// Privacy data for each tx type
const getTransactionPrivacy = (
  from: FromTxType,
  to: ToTxType
): TransactionPrivacy => {
  // T -> T : Everything visible
  if (from === "T" && to === "T") {
    return {
      sender: "visible",
      receiver: "visible",
      memo: "visible",
      amount: "visible",
      overallPrivacy: "none",
    };
  }

  // T -> Shielded (S or O): Sender visible, receiver hidden, amount visible on entry
  if (from === "T" && (to === "S" || to === "O")) {
    return {
      sender: "visible",
      receiver: "hidden",
      amount: "visible",
      memo: "hidden",
      overallPrivacy: "low",
    };
  }

  // Shielded -> T:Sender hidden, receiver visible,amount visible on exit
  if ((from === "S" || from === "O") && to === "T") {
    return {
      sender: "hidden",
      receiver: "visible",
      amount: "visible",
      memo: "visible",
      overallPrivacy: "low",
    };
  }

  // Same pool shieelded (S -> S or O -> O): Maximun privacy
  if (from === to && from !== "T") {
    return {
      sender: "hidden",
      receiver: "hidden",
      amount: "hidden",
      memo: "hidden",
      overallPrivacy: "maximum",
    };
  }

  // Cross-pool shielded (S <-> O):Amount revealed due to pool boundry
  if ((from === "S" && to === "O") || (from === "O" && to === "S")) {
    return {
      sender: "hidden",
      receiver: "hidden",
      amount: "visible",
      memo: "hidden",
      overallPrivacy: "high",
    };
  }

  return {
    sender: "visible",
    receiver: "visible",
    amount: "visible",
    memo: "visible",
    overallPrivacy: "none",
  };
};

export const ComparisonView = () => {
  const getPoolStyles = (type: PoolType) => {
    switch (type) {
      case "transparent":
        return {
          text: "text-pool-transparent",
          bg: "bg-pool-transparent/10",
          border: "border-pool-transparent/30",
        };
      case "sapling":
        return {
          text: "text-pool-sapling",
          bg: "bg-pool-sapling/10",
          border: "border-pool-sapling/30",
        };
      case "orchard":
        return {
          text: "text-pool-orchard",
          bg: "bg-pool-orchard/10",
          border: "border-pool-orchard/30",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Pool Headers */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div /> {/* Empty cell for feature column */}
        {poolOrder.map((poolType, index) => {
          const pool = POOLS[poolType];
          const styles = getPoolStyles(poolType);

          return (
            <motion.div
              key={pool.type}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "text-center p-4 rounded-xl border",
                styles.bg,
                styles.border
              )}
            >
              <h3 className={cn("font-semibold text-lg", styles.text)}>
                {pool.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {pool.addressPrefix}...
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Rows */}
      <div className="space-y-3">
        {comparisonData.map((row, rowIndex) => (
          <motion.div
            key={row.feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + rowIndex * 0.1 }}
            className="grid grid-cols-4 gap-4 items-center"
          >
            {/* Feature name */}
            <div className="text-sm font-medium text-foreground">
              {row.feature}
            </div>

            {/* Pool values */}
            {poolOrder.map((poolType) => {
              const data = row[poolType];
              const styles = getPoolStyles(poolType);
              const Icon = data.icon;

              return (
                <motion.div
                  key={`${row.feature}-${poolType}`}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "flex items-center justify-center gap-2 p-3 rounded-lg",
                    styles.bg,
                    "border",
                    styles.border
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      data.positive ? styles.text : "text-destructive/70"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm",
                      data.positive ? styles.text : "text-muted-foreground"
                    )}
                  >
                    {data.value}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* Privacy Level Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 grid grid-cols-3 gap-4"
      >
        {poolOrder.map((poolType, index) => {
          const pool = POOLS[poolType];
          const styles = getPoolStyles(poolType);
          const privacyLevel =
            poolType === "transparent" ? 0 : poolType === "sapling" ? 75 : 100;

          return (
            <div key={pool.type} className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Privacy Level
              </p>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${privacyLevel}%` }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full",
                    poolType === "transparent"
                      ? "bg-pool-transparent"
                      : poolType === "sapling"
                      ? "bg-pool-sapling"
                      : "bg-pool-orchard"
                  )}
                />
              </div>
              <p className={cn("text-sm font-medium mt-2", styles.text)}>
                {privacyLevel}%
              </p>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};
