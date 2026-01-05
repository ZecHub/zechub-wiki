'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { STAGES } from './data';
import Header from './Header';
import { StageInfo } from './StageInfo';
import { InfrastructureDiagram } from './InfrastructureDiagram';
import { Legend } from './Legend';
import { Controls } from './Controls';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AnyWindow = window as any;
  const Ctx = window.AudioContext || AnyWindow.webkitAudioContext;
  return Ctx ? new Ctx() : null;
};

export const ZcashInfrastructureVisualizer: React.FC = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setMounted(true);

    // Initialize Web Audio API (client-only, safe on unsupported browsers)
    audioContextRef.current = getAudioContext();

    return () => {
      // Cleanup audio context on unmount
      try {
        audioContextRef.current?.close();
      } catch {
        // ignore
      } finally {
        audioContextRef.current = null;
      }
    };
  }, []);

  const stage = STAGES[currentStage];

  const playTransitionSound = useCallback(
    (frequency: number = 440) => {
      if (isMuted) return;
      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Some browsers require a user gesture before audio can start
      if (ctx.state === 'suspended') {
        void ctx.resume().catch(() => {});
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    },
    [isMuted]
  );

  const playHighlightSound = useCallback(() => {
    if (isMuted) return;
    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      void ctx.resume().catch(() => {});
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }, [isMuted]);

  const goToNext = useCallback(() => {
    setCurrentStage(prev => {
      if (prev < STAGES.length - 1) {
        playTransitionSound(523.25); // C5
        playHighlightSound();
        return prev + 1;
      }
      setIsPlaying(false);
      playTransitionSound(659.25); // E5
      return prev;
    });
  }, [playTransitionSound, playHighlightSound]);

  const goToPrevious = useCallback(() => {
    setCurrentStage(prev => {
      if (prev > 0) {
        playTransitionSound(392); // G4
        playHighlightSound();
        return prev - 1;
      }
      return prev;
    });
  }, [playTransitionSound, playHighlightSound]);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsPlaying(false);
    playTransitionSound(261.63); // C4
  }, [playTransitionSound]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = currentStage === 0 ? 1000 : 5000;
    const timer = window.setTimeout(() => {
      goToNext();
    }, intervalMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl"
        />
      </div>

      {/* Mute/Unmute button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMuted(v => !v)}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700/80 transition-all shadow-lg"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-slate-400" />
        ) : (
          <Volume2 className="w-5 h-5 text-yellow-400" />
        )}
      </motion.button>

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
            onPlay={() => {
              setIsPlaying(true);
              playTransitionSound(440);
            }}
            onPause={() => {
              setIsPlaying(false);
              playTransitionSound(330);
            }}
            onNext={goToNext}
            onPrevious={goToPrevious}
            onRestart={restart}
          />
        </footer>
      </div>
    </div>
  );
};
