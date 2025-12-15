"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Controls } from "./Controls";
import { ProgressIndicator } from "./ProgressIndicator";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";

const AUTO_PLAY_INTERVAL = 8000; // 8 seconds per stage

export const ZcashPoolVisualizer = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const stage = STAGES[currentStage];

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

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      goToNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border"
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
            Zcash Pool Visualizer
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Interactive guide to Zcash privacy technology
        </p>
      </motion.header>

      {/* Progress Indicator */}
      <div className="border-b border-border bg-card/50">
        <ProgressIndicator
          currentStage={currentStage}
          onStageClick={goToStage}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-13">
        <StageContent stage={stage} isAnimating={isAnimating} />
      </main>

      {/* Controls Footer */}
      <footer className="border-t border-border bg-card/50 p-4">
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
