"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import "../index.css";
import { PlaybackControls } from "../PlaybackControls";
import { StageContent } from "./StageContent";
import { stages } from "./types";

const WELCOME_STAGE_INTERVAL = 1000;
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages

interface BlockchainFoundationVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export const BlockchainFoundationVisualizer = ({ onComplete, autoStart = false }: BlockchainFoundationVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);   const [isAnimating, setIsAnimating] = useState(true);

  const stage = stages[currentStage];

  const goToNext = useCallback(() => {
    if (currentStage < stages.length - 1) {
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
    if (currentStage === stages.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, OTHER_STAGES_INTERVAL);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

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
    <div className="flex flex-col ">
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
          <h1 className="text-2xl font-bold text-foreground">
            Blockchain Foundation Visualizer
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Interactive guide to Blockchain Technology (Foundation)
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent stage={stage} />
      </main>

      {/* Controls Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-600 p-4">
        <PlaybackControls
          stages={stages}
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
