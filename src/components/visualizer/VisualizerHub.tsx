"use client";

import { Button } from "@/components/UI/shadcn/button";
import { motion } from "framer-motion";
import { Home, Pause, Play } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { ZcashInfrastructureVisualizer } from "./zcash-infrastructure-visualizer";
import { ZcashPoolVisualizer } from "./zcash-pool-visualizer";
import ZKSNARKProofVisualizer from "./zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { ZcashDexVisualizer } from "./zcash-dex-visualizer/ZcashDexVisualizer";
import { WalletVisualizer } from "./zcash-wallet";

type VisualizerType =
  | "welcome"
  | "pool"
  | "zkproof"
  | "infrastructure"
  | "zcash-wallet"
  |"zcash-dex";

interface VisualizerInfo {
  id: VisualizerType;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

const VISUALIZERS: VisualizerInfo[] = [
  {
    id: "zcash-wallet",
    title: "Introduction to Zcash Wallets.",
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
    title: "Pool & Address Visualizer",
    description: "Explore Zcash privacy pools and address types",
    component: ZcashPoolVisualizer,
  },
  {
    id: "zkproof",
    title: "zk-SNARK Proof Visualizer",
    description: "Interactive demonstration of shielded transactions",
    component: ZKSNARKProofVisualizer,
  },
  {
    id: "infrastructure",
    title: "Zcash Infrastructure Visualizer",
    description: "How Zcash components work together",
    component: ZcashInfrastructureVisualizer,
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
          className="fixed top-4 left-4 z-50 p-3 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/80 transition-all shadow-lg"
          aria-label="Back to Visualizer Hub"
        >
          <Home className="w-5 h-5 text-white" />
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
              className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
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

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Zcash Visualizers
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
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

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {VISUALIZERS.map((visualizer, index) => (
            <motion.div
              key={visualizer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                onClick={() => goToVisualizer(visualizer.id)}
                className="cursor-pointer group"
              >
                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-6 h-full hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                      {visualizer.title}
                    </h3>
                    <p className="text-slate-300 group-hover:text-slate-200 transition-colors">
                      {visualizer.description}
                    </p>
                    <div className="mt-4 text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      <span className="text-sm font-medium">
                        Click to explore →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-slate-400 text-sm">
            Each visualizer runs automatically. Use controls to navigate or
            pause.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
