import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const CompleteVisualization = () => (
  <div className="space-y-8 w-full flex flex-col items-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <div className="relative">
        <CheckCircle2 className="w-24 h-24 text-secondary" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ delay: 0.3, repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-full bg-secondary/20 blur-2xl"
        />
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-center"
    >
      <h3 className="text-2xl font-bold mb-2 text-gradient">
        Transaction Complete!
      </h3>
      <p className="text-muted-foreground">
        Privacy preserved, validity confirmed
      </p>
    </motion.div>

    <div className="grid grid-cols-3 gap-4 w-full">
      {[
        { label: "Private", icon: "🔒" },
        { label: "Verified", icon: "✓" },
        { label: "Secure", icon: "🛡️" },
      ].map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="p-4 rounded-lg bg-card border border-primary/20 text-center"
        >
          <div className="text-2xl mb-2">{item.icon}</div>
          <p className="text-sm font-medium">{item.label}</p>
        </motion.div>
      ))}
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="text-xs text-center text-muted-foreground max-w-md"
    >
      Bob can now see and spend his received note using his viewing key, while
      the network has no knowledge of the transaction details.
    </motion.p>
  </div>
);
