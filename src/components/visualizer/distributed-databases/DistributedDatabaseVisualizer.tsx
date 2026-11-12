"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import SlideByzantine from "./slides/SlideByzantine";
import SlideCentralized from "./slides/SlideCentralized";
import SlideCompare from "./slides/SlideCompare";
import SlideDistributed from "./slides/SlideDistributed";
import SlideOutro from "./slides/SlideOutro";
import SlideTitle from "./slides/SlideTitle";

export type SlideProps = { progress: number; isPlaying: boolean };
type Slide = {
  id: string;
  title: string;
  duration: number;
  Comp: React.FC<SlideProps>;
};

const SLIDES: Slide[] = [
  { id: "title", title: "Intro", duration: 6, Comp: SlideTitle },
  {
    id: "centralized",
    title: "Centralized DBs",
    duration: 9,
    Comp: SlideCentralized,
  },
  {
    id: "distributed",
    title: "Distributed DBs",
    duration: 10,
    Comp: SlideDistributed,
  },
  {
    id: "byzantine",
    title: "Byzantine Generals",
    duration: 11,
    Comp: SlideByzantine,
  },
  {
    id: "compare",
    title: "DB vs Blockchain",
    duration: 12,
    Comp: SlideCompare,
  },
  { id: "outro", title: "Takeaway", duration: 7, Comp: SlideOutro },
];

interface DistributedDatabaseVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}
export default function DistributedDatabaseVisualizer({
  onComplete,
  autoStart = false,
}: DistributedDatabaseVisualizerProps) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  const rafRef = useRef<number | null>(null);
  const slideStartRef = useRef<number | null>(null);
  const pausedAccumRef = useRef(0);
  const pauseStartedRef = useRef<number | null>(null);
  const indexRef = useRef(index);
  const playingRef = useRef(isPlaying);

  const slide = SLIDES[index] ?? SLIDES[0];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  /*
   * Play All can turn this visualizer on after it
   * has already mounted.
   */
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // navigation
  const goto = useCallback((nextIndex: number) => {
    const boundedIndex = Math.max(0, Math.min(SLIDES.length - 1, nextIndex));

    indexRef.current = boundedIndex;

    setIndex(boundedIndex);
    setElapsed(0);

    slideStartRef.current = performance.now();

    pausedAccumRef.current = 0;
    pauseStartedRef.current = null;
  }, []);

  const goToNext = useCallback(() => {
    goto(index + 1);
  }, [goto, index]);

  const goToPrevious = useCallback(() => {
    goto(index - 1);
  }, [goto, index]);

  const restart = useCallback(() => {
    indexRef.current = 0;

    setIndex(0);
    setElapsed(0);
    setIsPlaying(false);

    slideStartRef.current = null;
    pausedAccumRef.current = 0;
    pauseStartedRef.current = null;
  }, []);

  // playback engine
  useEffect(() => {
    if (!isPlaying) {
      if (pauseStartedRef.current == null) {
        pauseStartedRef.current = performance.now();
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      return;
    }

    /*
     * Resume from pause.
     */
    if (pauseStartedRef.current !== null) {
      pausedAccumRef.current += performance.now() - pauseStartedRef.current;

      pauseStartedRef.current = null;
    }

    /*
     * Start the current slide if necessary.
     */
    if (slideStartRef.current === null) {
      slideStartRef.current = performance.now();
    }

    const tick = (now: number) => {
      const currentIndex = indexRef.current;
      const currentSlide = SLIDES[currentIndex];

      if (!currentSlide || slideStartRef.current === null) {
        return;
      }

      const elapsedMs = now - slideStartRef.current - pausedAccumRef.current;

      const elapsedSeconds = elapsedMs / 1000;

      /*
       * Current slide finished.
       */
      if (elapsedSeconds >= currentSlide.duration) {
        setElapsed(currentSlide.duration);

        /*
         * Final slide:
         * stop this visualizer's playback and allow
         * the Hub's Play All completion flow to proceed.
         */
        if (currentIndex >= SLIDES.length - 1) {
          setIsPlaying(false);

          if (onComplete) {
            onComplete();
          }

          rafRef.current = null;
          return;
        }

        /*
         * Advance to the next slide.
         */
        const nextIndex = currentIndex + 1;

        indexRef.current = nextIndex;

        setIndex(nextIndex);
        setElapsed(0);

        slideStartRef.current = now;

        pausedAccumRef.current = 0;
        pauseStartedRef.current = null;

        rafRef.current = requestAnimationFrame(tick);

        return;
      }

      setElapsed(elapsedSeconds);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, onComplete]);

  const progress = Math.min(1, elapsed / slide.duration);

  const Slide = slide.Comp;

  return (
    <VisualizerCanvas
      title="Distributed Databases"
      description=" Interactive guide to Blockchain Technology (Foundation)"
      currentStep={index}
      totalSteps={SLIDES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
    >
      <div
        className="
          relative
          min-h-full
          w-full
          overflow-hidden
          bg-[var(--viz-bg)]
          text-[var(--viz-ink)]
          p-8
        "
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Backdrop grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          }}
        />

        {/* Ambient glow */}
        <div
          aria-hidden
          className="
            pointer-events-none
            absolute
            -top-32
            left-1/2
            h-[640px]
            w-[640px]
            -translate-x-1/2
            rounded-full
            opacity-30
            blur-3xl
          "
          style={{
            background:
              "radial-gradient(closest-side, var(--viz-cyan), transparent)",
          }}
        />

        {/* Visualization */}
        <div className="relative flex min-h-[640px] w-full items-center justify-center p-6">
          <div className="relative aspect-video w-full max-w-[1600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{
                  opacity: 0,
                  scale: 0.985,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.01,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0"
              >
                <Slide progress={progress} isPlaying={false} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Optional contextual slide indicator.
            This is content, not playback UI. */}
        <div
          className="
            pointer-events-none
            absolute
            left-6
            top-6
            flex
            items-center
            gap-3
            text-xs
            uppercase
            tracking-[0.25em]
            text-[var(--viz-mute)]
          "
        >
          <span
            className="
              inline-block
              h-2
              w-2
              rounded-full
              bg-[var(--viz-cyan)]
              shadow-[0_0_12px_var(--viz-cyan)]
            "
          />
          Distributed Databases · {String(index + 1).padStart(2, "0")} /{" "}
          {String(SLIDES.length).padStart(2, "0")}
        </div>
      </div>
    </VisualizerCanvas>
  );
}

 