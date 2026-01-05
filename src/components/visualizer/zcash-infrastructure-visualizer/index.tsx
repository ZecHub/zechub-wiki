'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { STAGES } from './data';
import { Header } from './Header';
import { StageInfo } from './StageInfo';
import { InfrastructureDiagram } from './InfrastructureDiagram';
import { Legend } from './Legend';
import { Controls } from './Controls';


export const ZcashInfrastructureVisualizer: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stage = STAGES[currentStage];

  const goToNext = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage(prev => prev + 1);
    } else {
      setIsPlaying(false);
    }
  }, [currentStage]);

  const goToPrevious = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage(prev => prev - 1);
    }
  }, [currentStage]);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = currentStage === 0 ? 1000 : 6000;
    const timer = setTimeout(goToNext, interval);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <StageInfo stage={stage} />
          <InfrastructureDiagram stage={stage} />
          <Legend />
        </main>

        <footer className="border-t border-slate-700/50 p-8 bg-slate-900/50 backdrop-blur-xl mt-20">
          <Controls
            currentStage={currentStage}
            isPlaying={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onNext={goToNext}
            onPrevious={goToPrevious}
            onRestart={restart}
          />
        </footer>
      </div>
    </div>
  );
};
