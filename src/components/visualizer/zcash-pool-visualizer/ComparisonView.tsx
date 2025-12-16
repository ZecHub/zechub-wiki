import { cn } from "@/lib/util";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Minus, Shield, X } from "lucide-react";
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

type Pool = "T" | "S" | "O";

// Privacy data for each tx type
const getTransactionPrivacy = (from: Pool, to: Pool): TransactionPrivacy => {
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

const getPoolColor = (pool:Pool)=>{
  switch(pool){
    case 'T': return `text-pool-transparent`;
    case 'S': return `text-pool-sapling`;
    case 'O': return `text-pool-orchard`
  }
}

const getPoolBg = (pool: Pool) => {
  switch (pool) {
    case "T":
      return "bg-pool-transparent/10 border-pool-transparent/30";
    case "S":
      return "bg-pool-sapling/10 border-pool-sapling/30";
    case "O":
      return "bg-pool-orchard/10 border-pool-orchard/30";
  }
};

const getPrivacyIcon = (level: PrivacyLevel) => {
  switch (level) {
    case "visible":
      return { icon: Eye, color: "text-destructive/70", label: "Visible" };
    case "hidden":
      return { icon: EyeOff, color: "text-green-500", label: "Hidden" };
    case "partial":
      return { icon: Minus, color: "text-yellow-500", label: "Partial" };
  }
};


const getOverallPrivacyStyle = (
  level: TransactionPrivacy["overallPrivacy"]
) => {
  switch (level) {
    case "none":
      return {
        color: "text-destructive",
        bg: "bg-destructive/10",
        label: "None",
      };
    case "low":
      return { color: "text-orange-500", bg: "bg-orange-500/10", label: "Low" };
    case "medium":
      return {
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        label: "Medium",
      };
    case "high":
      return {
        color: "text-pool-sapling",
        bg: "bg-pool-sapling/10",
        label: "High",
      };
    case "maximum":
      return {
        color: "text-pool-orchard",
        bg: "bg-pool-orchard/10",
        label: "Maximum",
      };
  }
};

const features = ["Sender", "Receiver", "Amount", "Memo"];

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
      className="w-full max-w-6xl mx-auto overflow-x-auto"
    >
      {/* Pool Headers */}
      {/* <div className="grid grid-cols-4 gap-4 mb-6"> */}
      {/* <div />  */}
      {/* Empty cell for feature column */}
      {/* {poolOrder.map((poolType, index) => {
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
        })} */}
      {/* </div> */}

      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="grid grid-cols-[140px_repeat(9,1fr)] gap-2 mb-4">
          <div className="text-sm font-medium text-muted-foreground p-2">
            Transaction Type
          </div>
          {transactionTypes.map((tx, index) => (
            <motion.div
              key={tx.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "text-center p-2 rounded-lg border text-sm font-semibold",
                getPoolBg(tx.from)
              )}
            >
              <span className={getPoolColor(tx.from)}>{tx.from}</span>
              <span className="text-muted-foreground mx-1">→</span>
              <span className={getPoolColor(tx.to)}>{tx.to}</span>
            </motion.div>
          ))}
        </div>

        {/* Feature Rows */}
        {features.map((feature, idx) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="grid grid-cols-[140px_repeat(9,1fr)] gap-2 mb-2"
          >
            <div className="text-sm font-medium text-foreground p-2 flex items-center">
              {feature}
            </div>

            {transactionTypes.map((tx) => {
              const privacy = getTransactionPrivacy(tx.from, tx.to);
              const featureKey = feature.toLowerCase() as keyof Pick<
                TransactionPrivacy,
                "sender" | "receiver" | "amount" | "memo"
              >;
              const level = privacy[featureKey];
              const { icon: Icon, color, label } = getPrivacyIcon(level);

              return (
                <motion.div
                  key={`${feature}-${tx.label}`}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex items-center justify-center gap-1 p-2 rounded-lg border",
                    level === "hidden"
                      ? "bg-green-500/5 border-green-500/20"
                      : level === "visible"
                      ? "bg-destructive/5 border-destructive/20"
                      : "bg-yellow-500/5 border-yellow-500/20"
                  )}
                >
                  <Icon className={cn("w-3 h-3", color)} />
                  <span className={cn("text-xs", color)}>{label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        ))}

        {/* Overall Privacy Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-[140px_repeat(9,1fr)] gap-2 mt-4 pt-4 border-t border-border"
        >
          <div className="text-sm font-bold text-foreground p-2 flex items-center">
            Overall Privacy
          </div>
          {transactionTypes.map((tx, index) => {
            const privacy = getTransactionPrivacy(tx.from, tx.to);
            const style = getOverallPrivacyStyle(privacy.overallPrivacy);

            return (
              <motion.div
                key={`overall-${tx.label}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "flex items-center justify-center p-2 rounded-lg border",
                  style.bg,
                  "border-current/20"
                )}
              >
                <span className={cn("text-xs font-semibold", style.color)}>
                  {style.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-6 p-4 rounded-xl bg-muted/30 border border-border"
      >
        <h4 className="text-sm font-semibold text-foreground mb-3">
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-pool-orchard shrink-0 mt-0.5" />
            <span>
              <strong className="text-pool-orchard">Same-pool shielded</strong>{" "}
              (S→S, O→O): Maximum privacy - all details encrypted
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-pool-sapling shrink-0 mt-0.5" />
            <span>
              <strong className="text-pool-sapling">Cross-pool shielded</strong>{" "}
              (S↔O): High privacy but amount visible at pool boundary
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
            <span>
              <strong className="text-orange-500">Shielding/Deshielding</strong>{" "}
              (T↔S/O): One address visible, amount visible
            </span>
          </div>
          <div className="flex items-start gap-2">
            <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <span>
              <strong className="text-destructive">Transparent</strong> (T→T):
              No privacy - all details public like Bitcoin
            </span>
          </div>
        </div>
      </motion.div>

   
    </motion.div>
  );
};
