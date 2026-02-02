"use client";

import { motion } from "framer-motion";
import { useCallback, useState, useEffect } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { StageContent, STAGES } from "./GovernanceContent";
import { Users, Vote } from "lucide-react";

const STAGE_INTERVAL = 10000; // 10 seconds per stage

interface GovernanceVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const GovernanceVisualizer = ({ 
  onComplete, 
  autoStart = false 
}: GovernanceVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
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
  
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, STAGE_INTERVAL);
      
      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      goToNext();
    }, STAGE_INTERVAL);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 px-4 text-center border-b border-border mt-12"
      >
        <div className="flex items-center justify-center gap-3">
          <Users className="w-10 h-10 text-indigo-400" />
          <h1 className="text-2xl font-bold text-foreground">
            Zcash Governance & Dev Fund
          </h1>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Vote className="w-8 h-8 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Community-driven development and decentralized decision making
        </p>
      </motion.header>

      <main className="container mx-auto px-4 py-8 md:py-13 mt-8">
        <StageContent stage={stage} isAnimating={isAnimating} />
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