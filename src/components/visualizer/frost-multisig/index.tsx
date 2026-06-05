"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { StageContent, STAGES } from "./FrostMultisigContent";
import { Users, ShieldCheck } from "lucide-react";

const STAGE_INTERVAL = 12000; // 12 seconds per stage (interactive stages need breathing room)

interface FrostMultisigVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const FrostMultisigVisualizer = ({
  onComplete,
  autoStart = false,
}: FrostMultisigVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);

  // Interactive state shared between the DKG and signing stages.
  const [n, setNState] = useState(5);
  const [t, setTState] = useState(3);
  const [signers, setSigners] = useState<number[]>([]);

  const setN = useCallback((value: number) => {
    setNState(value);
    // Threshold can never exceed participant count.
    setTState((prevT) => Math.min(prevT, value));
    // Drop any selected signers that no longer exist.
    setSigners((prev) => prev.filter((i) => i < value));
  }, []);

  const setT = useCallback((value: number) => {
    setTState(value);
  }, []);

  const toggleSigner = useCallback((i: number) => {
    setSigners((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i],
    );
  }, []);

  const interactive = { n, t, setN, setT, signers, toggleSigner };

  const stage = STAGES[currentStage];

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
      }, STAGE_INTERVAL);

      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      goToNext();
    }, STAGE_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPlaying, goToNext, currentStage]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            FROST Threshold Signatures
          </h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Secure multisig without a single point of failure
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent
          stage={stage}
          isAnimating={isAnimating}
          interactive={interactive}
        />
      </main>

      {/* Controls Footer */}
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

export default FrostMultisigVisualizer;
