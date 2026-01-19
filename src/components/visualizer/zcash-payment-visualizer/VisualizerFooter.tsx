import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Slide } from "./types";

interface VisualizerFooterProps {
  slides: Slide[];
  currentSlide: number;
  isPlaying: boolean;
  onRestart: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPause: () => void;
  onPlay: () => void;
}

export const VisualizerFooter = ({
  slides,
  currentSlide,
  isPlaying,
  onRestart,
  onPrevious,
  onNext,
  onPause,
  onPlay,
}: VisualizerFooterProps) => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border bg-card/50 backdrop-blur-sm mt-12"
    >
      <div className="container mx-auto px-4 py-6">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/60"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentSlide + 1) / slides.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>
              Slide {currentSlide + 1} of {slides.length}
            </span>
            <span>{slides[currentSlide].category}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Previous button */}
          <button
            onClick={onPrevious}
            disabled={currentSlide === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary/10"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Center: Slide indicators + Play/Pause */}
          <div className="flex items-center gap-4">
            {/* Play/Pause/Restart */}
            <div className="flex items-center gap-2">
              <button
                onClick={onRestart}
                className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={isPlaying ? onPause : onPlay}
                className="p-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Slide dots */}
            <div className="hidden md:flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onNext()}
                  className={`transition-all ${
                    idx === currentSlide
                      ? "w-8 h-3 bg-primary rounded-full"
                      : "w-3 h-3 bg-muted hover:bg-muted-foreground/50 rounded-full"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Next button */}
          <button
            onClick={onNext}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.footer>
  );
};