import { Pause, Play, RotateCcw } from "lucide-react";

interface VisualizerPlaybackControlsProps {
  currentStep: number;
  totalSteps: number;

  isPlaying: boolean;

  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export function VisualizerPlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  onPrevious,
  onNext,
  onPlay,
  onPause,
  onRestart,
}: VisualizerPlaybackControlsProps) {
  const isFirstStep = currentStep <= 0;
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {/* Restart */}
      <button
        type="button"
        onClick={onRestart}
        aria-label="Restart visualizer"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground hover:cursor-pointer sm:h-9 sm:w-9"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      {/* Previous / counter / next */}
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          aria-label="Previous step"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/50 text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9 ${isFirstStep ? "" : "hover:cursor-pointer"}`}
        >
          ‹
        </button>

        <div
          className="min-w-0 flex-1 whitespace-nowrap text-center text-sm font-medium tabular-nums text-muted-foreground"
          aria-live="polite"
        >
          {currentStep + 1} / {totalSteps}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={isLastStep}
          aria-label="Next step"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background/50 text-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40 sm:h-9 sm:w-9 ${isLastStep ? "" : "hover:cursor-pointer"}`}
        >
          ›
        </button>
      </div>

      {/* Play / pause */}
      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        aria-label={isPlaying ? "Pause visualizer" : "Play visualizer"}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 hover:cursor-pointer sm:h-9 sm:w-9"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
