import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Globe } from 'lucide-react';
import IntroSlide from './IntroSlide';
import WalletCategorySlide from './WalletCategorySlide';
import LearnMoreSlide from './LearnMoreSlide';
import AnimatedBackground from './AnimatedBackground';
import Controls from './Controls';
import { mobileWallets, desktopWallets, webWallets } from './data';

const ZcashWalletsVisualizer: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION = 12000;
  const PROGRESS_INTERVAL = 50;

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let slideTimer: NodeJS.Timeout;

    if (isPlaying) {
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0;
          return prev + (100 / (SLIDE_DURATION / PROGRESS_INTERVAL));
        });
      }, PROGRESS_INTERVAL);

      slideTimer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % 5);
        setProgress(0);
      }, SLIDE_DURATION);
    }

    return () => {
      clearInterval(progressTimer);
      clearInterval(slideTimer);
    };
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % 5);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + 5) % 5);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const reset = () => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const slides = [
    <IntroSlide key="intro" />,
    <WalletCategorySlide 
      key="mobile"
      title="Mobile Wallets"
      subtitle="Privacy in your pocket"
      icon={<Smartphone className="w-16 h-16 text-emerald-400" />}
      wallets={mobileWallets}
    />,
    <WalletCategorySlide 
      key="desktop"
      title="Desktop Wallets"
      subtitle="Full-featured privacy solutions"
      icon={<Monitor className="w-16 h-16 text-cyan-400" />}
      wallets={desktopWallets}
    />,
    <WalletCategorySlide 
      key="web"
      title="Web Wallets"
      subtitle="Browser-based convenience"
      icon={<Globe className="w-16 h-16 text-purple-400" />}
      wallets={webWallets}
    />,
    <LearnMoreSlide key="learn" />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 h-screen flex flex-col">
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {slides[currentSlide]}
            </motion.div>
          </AnimatePresence>
        </div>

        <Controls
          currentSlide={currentSlide}
          progress={progress}
          isPlaying={isPlaying}
          onPrev={prevSlide}
          onNext={nextSlide}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={reset}
          onGoToSlide={goToSlide}
        />
      </div>
    </div>
  );
};

export default ZcashWalletsVisualizer;