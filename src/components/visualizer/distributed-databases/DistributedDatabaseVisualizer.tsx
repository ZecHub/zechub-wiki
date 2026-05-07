"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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

const TOTAL = SLIDES.reduce((s, x) => s + x.duration, 0);

export default function DistributedDatabaseVisualizer() {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const playingRef = useRef(isPlaying);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const slideStartRef = useRef<number | null>(null);
  const pausedAccumRef = useRef(0);
  const pauseStartedRef = useRef<number | null>(null);
  const indexRef = useRef(index);

  const slide = SLIDES[index] ?? SLIDES[0];

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  // navigation
  const goto = useCallback((i: number) => {
    const nextIndex = Math.max(0, Math.min(SLIDES.length - 1, i));

    indexRef.current = nextIndex;

    setIndex(nextIndex);
    setElapsed(0);

    slideStartRef.current = performance.now();

    pausedAccumRef.current = 0;
    pauseStartedRef.current = null;
  }, []);

  const restart = useCallback(() => {
    indexRef.current = 0;

    setIndex(0);
    setElapsed(0);
    setIsPlaying(true);

    slideStartRef.current = performance.now();

    pausedAccumRef.current = 0;
    pauseStartedRef.current = null;
  }, []);

  // playback engine
  useEffect(() => {
    if (!isPlaying) {
      if (pauseStartedRef.current == null) {
        pauseStartedRef.current = performance.now();
      }

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      return;
    }

    // resume from pause
    if (pauseStartedRef.current != null) {
      pausedAccumRef.current += performance.now() - pauseStartedRef.current;

      pauseStartedRef.current = null;
    }

    // initialize slide start
    if (slideStartRef.current == null) {
      slideStartRef.current = performance.now();
    }

    const tick = (now: number) => {
      const currentIndex = indexRef.current;
      const currentSlide = SLIDES[currentIndex];

      const elapsedMs = now - slideStartRef.current! - pausedAccumRef.current;

      const elapsedSeconds = elapsedMs / 1000;

      // slide complete
      if (elapsedSeconds >= currentSlide.duration) {
        // final slide
        if (currentIndex >= SLIDES.length - 1) {
          setElapsed(currentSlide.duration);
          setIsPlaying(false);
          return;
        }

        // next slide
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPlaying]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        goto(index + 1);
      } else if (e.code === "ArrowLeft") {
        goto(index - 1);
      } else if (e.key === "r" || e.key === "R") {
        restart();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullScreen();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [index, goto, restart, toggleFullScreen]);

  // Auto-hide controls
  const bumpControls = useCallback(() => {
    setShowControls(true);

    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }

    hideTimer.current = window.setTimeout(() => setShowControls(false), 2400);
  }, []);

  useEffect(() => {
    bumpControls();

    return () => {
      if (hideTimer.current) {
        window.clearTimeout(hideTimer.current);
      }
    };
  }, [bumpControls]);

  const progress = Math.min(1, elapsed / slide.duration);
  const totalElapsed =
    SLIDES.slice(0, index).reduce((s, x) => s + x.duration, 0) + elapsed;

  const Slide = slide.Comp;

  return (
    <div
      ref={stageRef}
      onMouseMove={bumpControls}
      className="relative h-280 w-[90%] mx-auto overflow-hidden bg-[var(--viz-bg)] text-[var(--viz-ink)]"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
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
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--viz-cyan), transparent)",
        }}
      />

      {/* Stage 16:9 */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative aspect-video w-full max-w-[1600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Slide progress={progress} isPlaying={isPlaying} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide label top-left */}
      <div className="pointer-events-none absolute left-6 top-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-[var(--viz-mute)]">
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--viz-cyan)] shadow-[0_0_12px_var(--viz-cyan)]" />
        Distributed Databases · {String(index + 1).padStart(2, "0")} /{" "}
        {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-6 left-1/2 z-20 w-[min(960px,92vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-xl"
          >
            {/* progress */}
            <div className="mb-3 flex gap-1">
              {SLIDES.map((s, i) => {
                const fill = i < index ? 1 : i === index ? progress : 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => goto(i)}
                    className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 transition hover:bg-white/20"
                    title={s.title}
                  >
                    <div
                      className="h-full bg-[var(--viz-cyan)]"
                      style={{
                        width: `${fill * 100}%`,
                        transition: i === index ? "none" : "width .3s",
                      }}
                    />
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => goto(index - 1)}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Previous"
              >
                <SkipBack className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="grid h-11 w-11 place-items-center rounded-full bg-[var(--viz-cyan)] text-[var(--viz-bg)] shadow-[0_0_24px_color-mix(in_oklab,var(--viz-cyan)_55%,transparent)] transition hover:scale-105"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => goto(index + 1)}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Next"
              >
                <SkipForward className="h-5 w-5" />
              </button>
              <button
                onClick={restart}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Restart"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              <div className="ml-2 flex-1 truncate text-sm font-medium text-white/90">
                {slide.title}
              </div>

              <div className="tabular-nums text-xs text-white/60">
                {fmt(totalElapsed)} / {fmt(TOTAL)}
              </div>
              <button
                onClick={toggleFullScreen}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Fullscreen"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}
