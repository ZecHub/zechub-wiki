import { motion } from "framer-motion";
import { Coins, Cpu, Shield } from "lucide-react";

export const Miners = () => {
  const distribution = [
    { label: "Miners", percentage: 80, color: "bg-primary" },
    { label: "Dev Fund", percentage: 20, color: "bg-pool-orchard" },
  ];

  return (
    <div className="space-y-12">
      {/* Miner role */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          {
            icon: Cpu,
            title: "Compute Power",
            desc: "Solve cryptographic puzzles",
          },
          {
            icon: Shield,
            title: "Security",
            desc: "Make attacks economically infeasible",
          },
          { icon: Coins, title: "Rewards", desc: "Receive newly minted ZEC" },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className="bg-card border border-border rounded-xl p-4 text-center"
          >
            <item.icon className="w-10 h-10 text-primary mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">{item.title}</h4>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Reward distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Coins className="w-5 h-5 text-primary" />
          Block Reward Distribution (Current: 3.125 ZEC)
        </h3>

        <div className="space-y-4">
          {/* Visual bar */}
          <div className="h-8 rounded-lg overflow-hidden flex">
            {distribution.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ delay: 0.7 + i * 0.2, duration: 0.5 }}
                className={`${item.color} flex items-center justify-center`}
              >
                <span className="text-xs font-bold text-primary-foreground">
                  {item.percentage}%
                </span>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {distribution.map((item) => (
              <div key={item.label} className="flex items-center gap-2 my-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-sm text-foreground">
                  {item.label} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>

          {/* Additional info */}
          <p className="text-sm text-muted-foreground">
            Miners also collect transaction fees from included transactions,
            providing additional incentive beyond the block reward.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
