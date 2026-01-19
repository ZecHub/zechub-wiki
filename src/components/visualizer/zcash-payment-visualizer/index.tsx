"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { VisualizerFooter } from "./VisualizerFooter";
import { StageContent } from "./StageContent";
import { PAYMENT_SLIDES } from "./types";

const INTRO_INTERVAL = 4000; // 4 seconds for intro slide
const SLIDE_INTERVAL = 8000; // 8 seconds for payment slides

export const ZcashPaymentVisualizer = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const slide = PAYMENT_SLIDES[currentSlide];

  const goToNext = useCallback(() => {
    if (currentSlide < PAYMENT_SLIDES.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      setIsAnimating(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentSlide]);

  const goToPrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      setIsAnimating(true);
    }
  }, [currentSlide]);

  const restart = useCallback(() => {
    setCurrentSlide(0);
    setIsAnimating(true);
    setIsPlaying(false);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = currentSlide === 0 ? INTRO_INTERVAL : SLIDE_INTERVAL;

    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, goToNext]);

  return (
    <div className="flex flex-col min-h-screen">
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
            className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center glow-gold"
          >
            <span className="text-xl font-bold text-primary-foreground">Z</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground">
            Pay with Zcash
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Privacy-preserving payments for the digital age
        </p>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <StageContent slide={slide} isAnimating={isAnimating} />
      </main>

      {/* Controls Footer */}
      <VisualizerFooter
        slides={PAYMENT_SLIDES}
        currentSlide={currentSlide}
        isPlaying={isPlaying}
        onRestart={restart}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};