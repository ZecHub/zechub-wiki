import { motion } from "framer-motion";
import { Layers, Shield, Shuffle, Users, Wallet } from "lucide-react";
import Image from "next/image";

export const WalletIntro = () => {
  const features = [
    {
      icon: Shield,
      title: "Shielded Functionality",
      description:
        "Send and receive private transactions with zero-knowledge proofs",
      color: "text-pool-orchard",
      bg: "bg-pool-orchard/10",
    },
    {
      icon: Layers,
      title: "Multi-Pool Support",
      description:
        "Manage transparent, Sapling, and Orchard addresses in one place",
      color: "text-pool-sapling",
      bg: "bg-pool-sapling/10",
    },
    {
      icon: Shuffle,
      title: "DEX Integration",
      description:
        "Some wallets offer built-in exchange features like Near DEX swaps",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Users,
      title: "Multiple Accounts",
      description:
        "Organize funds across different accounts for various purposes",
      color: "text-pool-transparent",
      bg: "bg-pool-transparent/10",
    },
  ];

  const walletHighlights = [
    {
      name: "Zashi",
      features: ["Tor Privacy", "Near DEX Swaps"],
      color: "from-amber-500/20 to-orange-500/20",
      border: "border-amber-500/30",
    },
    {
      name: "Ywallet",
      features: ["Multiple Accounts", "Pool Transfers"],
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
    },
  ];

  return (
    <div className="space-y-20">
      {/* Central wallet icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
            <Image
              priority
              src="/zwallets.png"
              alt={"zwallets"}
              width={32}
              height={32}
              className="w-20 h-20 text-pool-transparent"
            />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-primary/20 rounded-3xl"
          />
        </div>
      </motion.div>

      {/* Feature grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">Wallet Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-xl ${feature.bg} border border-white/5`}
            >
              <div className="flex items-start gap-3">
                <feature.icon className={`w-5 h-5 ${feature.color} mt-0.5`} />
                <div>
                  <h4 className="font-medium text-foreground mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Wallet highlights */}
      <div>
        <h2 className="text-lg font-bold mb-4">Wallet Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {walletHighlights.map((wallet, index) => (
            <motion.div
              key={wallet.name}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className={`p-4 rounded-xl bg-gradient-to-br ${wallet.color} border ${wallet.border}`}
            >
              <h4 className="font-bold text-foreground mb-2">{wallet.name}</h4>
              <div className="flex flex-wrap gap-2">
                {wallet.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-foreground/80"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
