import { motion } from "framer-motion";
import { ArrowRight, Blocks, CheckCircle2, Database, Pickaxe, Radio } from "lucide-react";


export const TransactionLifecycle = () => {
  const steps = [
    {
      icon: Radio,
      title: "Broadcast",
      desc: "User creates and signs transaction",
      color: "text-pool-transparent",
    },
    {
      icon: CheckCircle2,
      title: "Validate",
      desc: "Nodes verify signature and balance",
      color: "text-pool-sapling",
    },
    {
      icon: Database,
      title: "Mempool",
      desc: "Transaction waits in memory pool",
      color: "text-primary",
    },
    {
      icon: Pickaxe,
      title: "Selection",
      desc: "Miner includes in candidate block",
      color: "text-pool-orchard",
    },
    {
      icon: Blocks,
      title: "Confirmed",
      desc: "Block mined and added to chain",
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Step flow */}
      <div className="flex flex-wrap justify-center items-start gap-2 md:gap-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex items-center"
          >
            <div className="flex flex-col items-center w-24 md:w-32">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-card border-2 border-border flex items-center justify-center mb-2"
              >
                <step.icon className={`w-6 h-6 md:w-8 md:h-8 ${step.color}`} />
              </motion.div>
              <h4 className="font-semibold text-foreground text-sm text-center">
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground text-center">
                {step.desc}
              </p>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className="hidden md:block"
              >
                <ArrowRight className="w-6 h-6 text-muted-foreground mx-2" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Mempool visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-card border border-border rounded-xl p-4"
      >
        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          Mempool (Pending Transactions)
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 + i * 0.05 }}
              className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center"
            >
              <span className="text-xs text-primary font-mono">tx</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
