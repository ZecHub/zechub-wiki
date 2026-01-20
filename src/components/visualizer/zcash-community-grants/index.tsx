"use client";

import { useCallback, useState } from "react";
import { PlaybackControls } from "../PlaybackControls";
import { ZcashCommunityGrantsContent, slides } from "./ZcashCommunityGrantsContent";

const SLIDES = slides.map((s) => ({ id: s.id, title: s.title }));

export const ZcashCommunityGrantsVisualizer = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentStage((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentStage((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    setCurrentStage(index);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="container mx-auto px-4 py-8 md:py-13 mt-12">
        <ZcashCommunityGrantsContent 
          currentSlide={currentStage}
          onSlideChange={handleSlideChange}
          isPlaying={isPlaying}
        />
      </main>

      <footer className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t border-border/50 py-6">
        <PlaybackControls
          currentStage={currentStage}
          isPlaying={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onRestart={restart}
          stages={SLIDES}
        />
      </footer>
    </div>
  );
};
