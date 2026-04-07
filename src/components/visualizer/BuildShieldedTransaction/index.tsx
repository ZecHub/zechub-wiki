"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Shield, Lock } from "lucide-react";
import { PlaybackControls } from "../PlaybackControls";
import {
  STAGES,
  Pool,
  PoolSelectorStage,
  AmountMemoStage,
  ZkProofStage,
  OnChainStage,
  PrivacyScoreStage,
} from "./BuildShieldedTransactionContent";

const STAGE_INTERVAL = 12000;

interface BuildShieldedTransactionVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const BuildShieldedTransactionVisualizer = ({
  onComplete,
  autoStart = false,
}: BuildShieldedTransactionVisualizerProps) => {
  // ── Transaction state ────────────────────────────────────────────────────
  const [fromPool, setFromPool] = useState<Pool>("transparent");
  const [toPool, setToPool] = useState<Pool>("orchard");
  const [amount, setAmount] = useState(10);
  const [memo, setMemo] = useState("Thank you for the private payment");

  // ── Playback state ───────────────────────────────────────────────────────
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

  const stage = STAGES[currentStage];

  // ── Navigation ───────────────────────────────────────────────────────────
  const goToNext = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev < STAGES.length - 1) {
        setIsAnimating(true);
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentStage((prev) => {
      if (prev > 0) {
        setIsAnimating(true);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsAnimating(true);
    setIsPlaying(false);
  }, []);

  // ── Auto-start ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoStart) setIsPlaying(true);
  }, [autoStart]);

  // ── onComplete callback ──────────────────────────────────────────────────
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, STAGE_INTERVAL);
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  // ── Auto-advance ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setTimeout(() => {
      goToNext();
    }, STAGE_INTERVAL);
    return () => clearTimeout(timer);
  }, [isPlaying, goToNext]);

  // ── Stage content ────────────────────────────────────────────────────────
  const renderStage = () => {
    switch (stage.id) {
      case "pool-selector":
        return (
          <PoolSelectorStage
            fromPool={fromPool}
            toPool={toPool}
            onFromChange={setFromPool}
            onToChange={setToPool}
          />
        );
      case "amount-memo":
        return (
          <AmountMemoStage
            amount={amount}
            memo={memo}
            onAmountChange={setAmount}
            onMemoChange={setMemo}
            toPool={toPool}
            fromPool={fromPool}
          />
        );
      case "zk-proof":
        return <ZkProofStage fromPool={fromPool} toPool={toPool} />;
      case "on-chain":
        return (
          <OnChainStage
            fromPool={fromPool}
            toPool={toPool}
            amount={amount}
            memo={memo}
          />
        );
      case "privacy-score":
        return (
          <PrivacyScoreStage
            fromPool={fromPool}
            toPool={toPool}
            amount={amount}
            memo={memo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Shield className="w-10 h-10 text-green-400" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Shielded Transaction Visualizer
          </h1>
          <Lock className="w-6 h-6 text-purple-400" />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Build and understand a Zcash shielded transaction — step by step
        </p>
      </motion.header>

      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        {renderStage()}
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-6">
        <PlaybackControls
          stages={STAGES}
          currentStage={currentStage}
          isPlaying={isPlaying}
          onRestart={restart}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      </footer>
    </div>
  );
};

export default BuildShieldedTransactionVisualizer;