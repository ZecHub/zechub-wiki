"use client";

import { parseMarkdown } from "@/lib/parseMarkdown";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Controls } from "./Controls";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";

const WELCOME_STAGE_INTERVAL = 1000;
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages

const url = `/site/Using_Zcash/Wallets.md`;

export type Device = "Mobile" | "Desktop" | "Full Node" | "Web" | "Hardware";

export type WalletInfo = {
  title: string;
  url: string;
  imageUrl: string;
  devices: string[];
  pools: string[];
  features: string[];
  syncSpeed: string;
};

const noneShieldedWallets = ["Exodus", "SSP", "Trust", "Coinomi", "Vultisig"];
const noneShieldedSet = new Set(
  noneShieldedWallets.map((w) => w.toLowerCase())
);

interface WalletVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const WalletVisualizer = ({ onComplete, autoStart = false }: WalletVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  const stage = STAGES[currentStage];
  
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);
  
  // Completion logic
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, OTHER_STAGES_INTERVAL);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);
  useEffect(() => {
    async function getWalletInfo() {
      try {
        const res = await fetch(`/api/github/file?path=${url}`);

        const data = await res.json();
        const content = atob(data.content);

        const parsedData = parseMarkdown(content)
          .filter((w) => !noneShieldedSet.has(w.title.toLowerCase()))
          .map((d) => ({
            ...d,
            devices: d.devices.map((d) => d.toLowerCase()),
          }));

        setWallets(parsedData);
      } catch (err) {
        console.error(err);
      }
    }

    getWalletInfo();
  }, []);

  const goToNext = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setIsAnimating(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentStage]);

  const goToPrevious = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      setIsAnimating(true);
    }
  }, [currentStage]);

  const goToStage = useCallback((stageIndex: number) => {
    setCurrentStage(stageIndex);
    setIsAnimating(true);
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsAnimating(true);
    setIsPlaying(false);
  }, []);

  // Auto-play logic with different intervals
  useEffect(() => {
    if (!isPlaying) return;

    // Use faster interval for welcome stage (stage 0), slower for others
    const interval =
      currentStage === 0 ? WELCOME_STAGE_INTERVAL : OTHER_STAGES_INTERVAL;

    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <div className="flex flex-col" id="WalletVisualizer">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b  border-slate-200 dark:border-slate-600 mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center"
          >
            <span className="text-xl font-bold text-primary-foreground">Z</span>
          </motion.div>
          <h1 className="text-xl imd:text-2xl font-bold text-foreground">
            Zcash Wallet Visualizer
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Interactive guide to Zcash privacy technology
        </p>
      </motion.header>

      {/* Main Content */}
      <main className=" container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent
          stage={stage}
          wallets={wallets}
          isAnimating={isAnimating}
        />
      </main>

      {/* Controls Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-600 p-4 mt-4">
        <Controls
          currentStage={currentStage}
          isPlaying={isPlaying}
          onNext={goToNext}
          onRestart={restart}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPrevious={goToPrevious}
        />
      </footer>
    </div>
  );
};
