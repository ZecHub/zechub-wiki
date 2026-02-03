"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Pickaxe,
  Cpu,
  Zap,
  Network,
  Box,
  Coins,
  Layers,
  TrendingUp,
  Hash,
  Blocks,
  ArrowRight,
  CheckCircle,
  Shield,
  Lock,
  GitBranch,
} from "lucide-react";
import { useState, useEffect } from "react";

export type StageType = "equihash" | "mining-process" | "halo-intro" | "shielded-rewards" | "network-stats" | "crosslink";

export interface Stage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: StageType;
  link: string;
  linkText: string;
}

export const STAGES: Stage[] = [
  {
    id: "equihash-basics",
    title: "Equihash Mining",
    subtitle: "ASIC-Resistant Algorithm",
    description: "Memory-hard proof-of-work designed for fair, decentralized mining",
    type: "equihash",
    link: "https://zcash.readthedocs.io/en/latest/rtd_pages/zcash_mining_guide.html",
    linkText: "Learn More About Equihash",
  },
  {
    id: "mining-process",
    title: "The Mining Process",
    subtitle: "Block Creation",
    description: "From transaction collection to network consensus",
    type: "mining-process",
    link: "https://zcash.readthedocs.io/en/latest/rtd_pages/zcash_mining_guide.html",
    linkText: "Understanding Proof-of-Work",
  },
  {
    id: "halo-intro",
    title: "Halo 2",
    subtitle: "Recursive zk-SNARKs",
    description: "Revolutionary cryptography without trusted setup",
    type: "halo-intro",
    link: "https://electriccoin.co/blog/halo-recursive-proof-composition-without-a-trusted-setup/",
    linkText: "Explore Halo 2",
  },
  {
    id: "shielded-rewards",
    title: "Shielded Mining Rewards",
    subtitle: "Private Coinbase",
    description: "How miners can shield rewards for enhanced privacy using zk-proofs",
    type: "shielded-rewards",
    link: "https://zcash.readthedocs.io/en/latest/rtd_pages/shield_coinbase.html",
    linkText: "Shielded Coinbase Guide",
  },
  {
    id: "network-stats",
    title: "Network Stats",
    subtitle: "Live Performance",
    description: "Current hashrate, rewards, and efficiency metrics",
    type: "network-stats",
    link: "https://mainnet.zcashexplorer.app",
    linkText: "Network Explorer",
  },
  {
    id: "crosslink",
    title: "Crosslink Hybrid Consensus",
    subtitle: "Future PoW/PoS Upgrade",
    description: "Upcoming hybrid system adding PoS for finality, staking, and scalability on top of PoW",
    type: "crosslink",
    link: "https://shieldedlabs.net/crosslink-roadmap-q1-2025",
    linkText: "Crosslink Roadmap",
  },
];

// Equihash Animation Component
const EquihashAnimation = () => {
  const [solving, setSolving] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSolving(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-8">
        {/* Memory blocks */}
        <motion.div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-400 to-slate-700 border border-slate-500"
              animate={{
                scale: solving ? [1, 1.1, 1] : 1,
                opacity: solving ? [0.5, 1, 0.5] : 0.7,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
        </motion.div>

        {/* Nonce finder */}
        <div className="relative">
          <motion.div
            className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
            animate={{
              boxShadow: solving
                ? "0 0 40px rgba(59, 130, 246, 0.8)"
                : "0 0 20px rgba(59, 130, 246, 0.3)",
            }}
          >
            <Hash className="w-12 h-12 text-white" />
          </motion.div>
          {solving && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-xl border-4 border-blue-400"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/30">
          <div className="text-2xl font-bold text-blue-400">n=200</div>
          <div className="text-sm text-muted-foreground">Problem Size</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/30">
          <div className="text-2xl font-bold text-blue-400">k=9</div>
          <div className="text-sm text-muted-foreground">Complexity</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-500/10 border border-slate-500/30">
          <div className="text-2xl font-bold text-blue-400">~75s</div>
          <div className="text-sm text-muted-foreground">Block Time</div>
        </div>
      </div>
    </div>
  );
};

// Mining Process Animation
const MiningProcessAnimation = () => {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { icon: Blocks, label: "Collect Transactions", color: "from-yellow-400 to-orange-500" },
    { icon: Hash, label: "Compute Hash", color: "from-blue-400 to-blue-600" },
    { icon: Cpu, label: "Adjust Nonce", color: "from-purple-400 to-purple-600" },
    { icon: Zap, label: "Solve Puzzle", color: "from-green-400 to-green-600" },
    { icon: Network, label: "Broadcast Block", color: "from-pink-400 to-pink-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === step;
          const isDone = idx < step;
          
          return (
            <div key={idx} className="flex flex-col items-center gap-2">
              <motion.div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center relative`}
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                  opacity: isDone ? 0.5 : 1,
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-8 h-8 text-white" />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-4 border-white/50"
                    animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {isDone && (
                  <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-500 bg-background rounded-full" />
                )}
              </motion.div>
              <div className="text-xs text-center text-muted-foreground max-w-[80px]">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Block representation */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600"
        animate={{
          borderColor: step === 4 ? "rgb(236, 72, 153)" : "rgb(71, 85, 105)",
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Box className="w-6 h-6 text-blue-400" />
          <span className="font-semibold">Block #~3200000</span>
        </div>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transactions:</span>
            <span className="text-foreground">{Math.floor(Math.random() * 50) + 10}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Difficulty:</span>
            <span className="text-foreground">{(Math.random() * 10).toFixed(2)}M</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reward:</span>
            <span className="text-yellow-400">3.125 ZEC</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Halo 2 Animation
const Halo2Animation = () => {
  const [recursing, setRecursing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRecursing(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-8">
        {/* Proof layers */}
        <div className="relative">
          {[0, 1, 2, 3].map((layer) => (
            <motion.div
              key={layer}
              className="absolute left-1/2 top-1/2 w-32 h-32 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30 border-2 border-purple-400"
              style={{
                transform: `translate(-50%, -50%) translateZ(${layer * 20}px)`,
                zIndex: 4 - layer,
              }}
              animate={{
                scale: recursing ? [1, 0.8, 1] : 1,
                opacity: recursing ? [0.8, 0.3, 0.8] : 0.6 - layer * 0.1,
                rotateY: recursing ? [0, 180, 360] : 0,
              }}
              transition={{
                duration: 2,
                delay: layer * 0.2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <Zap className="w-16 h-16 text-purple-400" />
          </div>
        </div>

        <motion.div
          animate={{
            rotate: recursing ? 360 : 0,
          }}
          transition={{ duration: 2 }}
        >
          <Layers className="w-12 h-12 text-indigo-400" />
        </motion.div>

        {/* Result */}
        <motion.div
          className="w-32 h-32 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
          animate={{
            scale: recursing ? [1, 1.2, 1] : 1,
            boxShadow: recursing
              ? "0 0 50px rgba(34, 197, 94, 0.8)"
              : "0 0 20px rgba(34, 197, 94, 0.3)",
          }}
          transition={{ duration: 2 }}
        >
          <CheckCircle className="w-16 h-16 text-white" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <Zap className="w-5 h-5 text-purple-400 mb-2" />
          <div className="font-semibold text-foreground">No Trusted Setup</div>
          <div className="text-sm text-muted-foreground">Eliminates ceremony risks</div>
        </div>
        <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
          <Layers className="w-5 h-5 text-indigo-400 mb-2" />
          <div className="font-semibold text-foreground">Recursive Proofs</div>
          <div className="text-sm text-muted-foreground">Infinite composability</div>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
          <div className="font-semibold text-foreground">Better Scaling</div>
          <div className="text-sm text-muted-foreground">Smaller, faster proofs</div>
        </div>
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Network className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="font-semibold text-foreground">Cross-Chain Ready</div>
          <div className="text-sm text-muted-foreground">Future bridges enabled</div>
        </div>
      </div>
    </div>
  );
};

// Shielded Rewards Animation
const ShieldedRewardsAnimation = () => {
  const [shielding, setShielding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShielding(true);
      setTimeout(() => setShielding(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-8">
        {/* Mining Reward */}
        <motion.div
          className="w-32 h-32 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-white"
          animate={{ scale: shielding ? [1, 1.1, 1] : 1 }}
        >
          <Coins className="w-16 h-16" />
        </motion.div>

        <motion.div
          animate={{ x: shielding ? [0, 20, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
        </motion.div>

        {/* Shielded Pool */}
        <div className="relative">
          <motion.div
            className="w-32 h-32 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white"
            animate={{
              boxShadow: shielding ? "0 0 40px rgba(34, 197, 94, 0.8)" : "0 0 20px rgba(34, 197, 94, 0.3)",
            }}
          >
            <Shield className="w-16 h-16" />
          </motion.div>
          {shielding && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-xl border-4 border-green-400"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <Lock className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <div className="font-semibold">Private Rewards</div>
          <div className="text-sm text-muted-foreground">Hide mining income</div>
        </div>
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
          <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="font-semibold">Halo Enabled</div>
          <div className="text-sm text-muted-foreground">Verifiable privacy</div>
        </div>
      </div>
    </div>
  );
};

// Network Stats Animation
const NetworkStatsAnimation = () => {
  const [hashrate, setHashrate] = useState(1.05);
  const [blocks, setBlocks] = useState(3146400);

  useEffect(() => {
    const interval = setInterval(() => {
      setHashrate(prev => prev + (Math.random() - 0.5) * 0.5);
      setBlocks(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <TrendingUp className="w-8 h-8 text-orange-400 mb-2" />
          <div className="text-3xl font-bold text-orange-400">
            {hashrate.toFixed(1)} <span className="text-lg">Gsol/s</span>
          </div>
          <div className="text-sm text-muted-foreground">Network Hashrate</div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <Coins className="w-8 h-8 text-yellow-400 mb-2" />
          <div className="text-3xl font-bold text-yellow-400">3.125 <span className="text-lg">ZEC</span></div>
          <div className="text-sm text-muted-foreground">Block Reward</div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <Box className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-3xl font-bold text-blue-400">{blocks.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Block Height</div>
        </motion.div>

        <motion.div
          className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30"
          whileHover={{ scale: 1.05 }}
        >
          <Zap className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-3xl font-bold text-green-400">~75s</div>
          <div className="text-sm text-muted-foreground">Block Time</div>
        </motion.div>
      </div>

      {/* Mining pool bars */}
      <div className="p-6 rounded-xl bg-card/50 border border-border">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Pickaxe className="w-5 h-5 text-orange-400" />
          Popular Mining Pools
        </h4>
        <div className="space-y-3">
          {[
            { name: "ViaBTC", percent: 35, color: "bg-blue-500" },
            { name: "F2Pool", percent: 28, color: "bg-green-500" },
            { name: "2Miners", percent: 22, color: "bg-purple-500" },
            { name: "Others", percent: 15, color: "bg-orange-500" },
          ].map((pool, idx) => (
            <div key={pool.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">{pool.name}</span>
                <span className="text-muted-foreground">{pool.percent}%</span>
              </div>
              <div className="h-3 bg-muted/20 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${pool.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pool.percent}%` }}
                  transition={{ duration: 1, delay: idx * 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Crosslink Animation
const CrosslinkAnimation = () => {
  const [hybridizing, setHybridizing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHybridizing(true);
      setTimeout(() => setHybridizing(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-8">
        {/* PoW Layer */}
        <motion.div
          className="w-32 h-32 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white"
          animate={{ y: hybridizing ? [0, -10, 0] : 0 }}
        >
          <Pickaxe className="w-16 h-16" />
        </motion.div>

        <motion.div
          animate={{ rotate: hybridizing ? 360 : 0 }}
          transition={{ duration: 2 }}
        >
          <GitBranch className="w-12 h-12 text-purple-400" />
        </motion.div>

        {/* PoS Layer */}
        <motion.div
          className="w-32 h-32 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white"
          animate={{ y: hybridizing ? [0, 10, 0] : 0 }}
        >
          <Lock className="w-16 h-16" />
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <TrendingUp className="w-5 h-5 text-purple-400 mb-2" />
          <div className="font-semibold text-foreground">Staking Yield</div>
          <div className="text-sm text-muted-foreground">Earn rewards on ZEC</div>
        </div>
        <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
          <Zap className="w-5 h-5 text-indigo-400 mb-2" />
          <div className="font-semibold text-foreground">Fast Finality</div>
          <div className="text-sm text-muted-foreground">Improved security</div>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <Network className="w-5 h-5 text-green-400 mb-2" />
          <div className="font-semibold text-foreground">Scalability</div>
          <div className="text-sm text-muted-foreground">Lays foundation for L2</div>
        </div>
        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
          <Shield className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="font-semibold text-foreground">Hybrid Model</div>
          <div className="text-sm text-muted-foreground">PoW blocks + PoS finality</div>
        </div>
      </div>
    </div>
  );
};

// Main Content Component
interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
}

export const StageContent = ({ stage, isAnimating }: StageContentProps) => {
  const renderContent = () => {
    switch (stage.type) {
      case "equihash":
        return <EquihashAnimation />;
      case "mining-process":
        return <MiningProcessAnimation />;
      case "halo-intro":
        return <Halo2Animation />;
      case "shielded-rewards":
        return <ShieldedRewardsAnimation />;
      case "network-stats":
        return <NetworkStatsAnimation />;
      case "crosslink":
        return <CrosslinkAnimation />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-[500px]"
      >
        {/* Stage Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-blue-400 font-medium mb-2"
          >
            {stage.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {stage.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {stage.description}
          </motion.p>
        </div>

        {/* Animated Content */}
        <div className="max-w-4xl mx-auto">{renderContent()}</div>

        {/* Learn More Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href={stage.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>{stage.linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};