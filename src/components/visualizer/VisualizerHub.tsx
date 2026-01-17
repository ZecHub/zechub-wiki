"use client";

import { Button } from "@/components/UI/shadcn/button";
import { motion } from "framer-motion";
import { Home, Pause, Play } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ConsensusVisualizer } from "./consensus-visualizer";
import { HashFunctionVisualizer } from "./hash-function-visualizer";
import { ZcashDexVisualizer } from "./zcash-dex-visualizer/ZcashDexVisualizer";
import { ZcashInfrastructureVisualizer } from "./zcash-infrastructure-visualizer";
import { ZcashKeyVisualizer } from "./zcash-key-visualizer";
import { ZcashPoolVisualizer } from "./zcash-pool-visualizer";
import { WalletVisualizer } from "./zcash-wallet";
import ZKSNARKProofVisualizer from "./zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { BlockchainFoundationVisualizer } from "./blockchain-foundation";

type VisualizerType =
  | "welcome"
  | "pool"
  | "zkproof"
  | "infrastructure"
  | "zcash-wallet"
  | "zcash-dex"
  | "hash-function"
  | "consensus"
  | "zcash-key"
  | "blockchain-foundation";

interface VisualizerInfo {
  id: VisualizerType;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

const VISUALIZERS: VisualizerInfo[] = [
  {
    id: "blockchain-foundation",
    title: "What is Blockchain",
    description: "Understanding Blockchain Foundation",
    component: BlockchainFoundationVisualizer,
  },
  {
    id: "zcash-wallet",
    title: "Introduction to Zcash Wallets",
    description: "Providing Shielded Functionality",
    component: WalletVisualizer,
  },
  {
    id: "zcash-dex",
    title: "Zcash Exchanges (DEX)",
    description:
      "Permissionless, censorship-resistant access to ZEC using decentralized exchanges",
    component: ZcashDexVisualizer,
  },
  {
    id: "pool",
    title: "Pool & Address",
    description: "Explore Zcash privacy pools and address types",
    component: ZcashPoolVisualizer,
  },
  {
    id: "zkproof",
    title: "zk-SNARK Proof",
    description: "Interactive demonstration of shielded transactions",
    component: ZKSNARKProofVisualizer,
  },
  {
    id: "infrastructure",
    title: "Zcash Infrastructure",
    description: "How Zcash components work together",
    component: ZcashInfrastructureVisualizer,
  },
  {
    id: "hash-function",
    title: "Hash Functions",
    description: "What is a Hash Function?",
    component: HashFunctionVisualizer,
  },
  {
    id: "zcash-key",
    title: "Zcash keys",
    description: "Understanding Zcash Keys",
    component: ZcashKeyVisualizer,
  },
  {
    id: "consensus",
    title: "Consensus",
    description: "How do thousands of nodes agree?",
    component: ConsensusVisualizer,
  },
];

export const VisualizerHub: React.FC = () => {
  const [currentVisualizer, setCurrentVisualizer] =
    useState<VisualizerType>("welcome");
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const startPlayAll = useCallback(() => {
    setIsPlayingAll(true);
    setCurrentIndex(0);
    setCurrentVisualizer(VISUALIZERS[0].id);
  }, []);

  const stopPlayAll = useCallback(() => {
    setIsPlayingAll(false);
  }, []);

  const goToVisualizer = useCallback((visualizerId: VisualizerType) => {
    setCurrentVisualizer(visualizerId);
    setIsPlayingAll(false);
  }, []);

  const goHome = useCallback(() => {
    setCurrentVisualizer("welcome");
    setIsPlayingAll(false);
    setCurrentIndex(0);
  }, []);

  // Auto-advance through visualizers when playing all
  useEffect(() => {
    if (!isPlayingAll) return;

    const timer = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % VISUALIZERS.length;
      setCurrentIndex(nextIndex);
      setCurrentVisualizer(VISUALIZERS[nextIndex].id);
    }, 60000); // 1 minute per visualizer

    return () => clearTimeout(timer);
  }, [isPlayingAll, currentIndex]);

  if (currentVisualizer !== "welcome") {
    const CurrentComponent = VISUALIZERS.find(
      (v) => v.id === currentVisualizer
    )?.component;

    if (!CurrentComponent) return null;

    return (
      <>
        {/* Back to hub button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          onClick={goHome}
          className="fixed top-[6rem] left-[1.5rem] imd:top-[7rem] imd:left-8 z-50 p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:bg-card/80 transition-all shadow-lg"
          aria-label="Back to Visualizer Hub"
        >
          <Home className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Play All controls when playing all */}
        {isPlayingAll && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-4 right-4 z-50 flex gap-2"
          >
            <Button
              onClick={stopPlayAll}
              variant="secondary"
              size="sm"
              className="bg-card/80 backdrop-blur-md border border-border/50"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop Auto-Play
            </Button>
          </motion.div>
        )}

        <CurrentComponent />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col  py-12">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Zcash Visualizers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive educational tools to understand Zcash privacy
              technology, infrastructure, and zero-knowledge proofs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Button
              onClick={startPlayAll}
              size="lg"
              className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Play All Visualizers
            </Button>
          </motion.div>
        </section>

        <section id="basic" className="mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Display  */}
            <VisualizerCard
              data={VISUALIZERS.slice(0, 5)}
              goToVisualizer={goToVisualizer}
            />
          </div>
        </section>

        <section id="advance" className="mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Display  */}
            <VisualizerCard
              data={VISUALIZERS.slice(5)}
              goToVisualizer={goToVisualizer}
            />
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground text-sm">
            Each visualizer runs automatically. Use controls to navigate or
            pause.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

type CardProps = {
  data: VisualizerInfo[];
  goToVisualizer: (id: VisualizerType) => void;
};

function VisualizerCard(props: CardProps) {
  return props.data.map((v, index) => (
    <motion.div
      key={v.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        onClick={() => props.goToVisualizer(v.id)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col min-h-[240px] bg-card/70 backdrop-blur-md border border-border/50 rounded-xl p-6 h-full hover:bg-card/80 hover:border-border/50 transition-all duration-300">
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
              {v.title}
            </h3>
            <p className="text-muted-foreground group-hover:text-muted-foreground transition-colors">
              {v.description}
            </p>
          </div>

          <div className="text-yellow-500 text-center group-hover:text-yellow-400 transition-colors">
            <span className="text-sm font-medium">Click to explore →</span>
          </div>
        </div>
      </div>
    </motion.div>
  ));
}
