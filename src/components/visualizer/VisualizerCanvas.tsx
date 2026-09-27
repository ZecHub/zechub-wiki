import type { ReactNode } from "react";
import { VisualizerPlaybackControls } from "./VisualizerPlaybackControls";

interface VisualizerCanvasProps {
  title: string;
  description?: string;

  currentStep: number;
  totalSteps: number;

  isPlaying: boolean;

  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;

  children: ReactNode;
}

// Canvas
//
// Controls what happens when a contributor's visualization is larger than that boundary.

export function VisualizerCanvas({
  title,
  description,
  currentStep,
  totalSteps,
  isPlaying,
  onPrevious,
  onNext,
  onPlay,
  onPause,
  onRestart,
  children,
}: VisualizerCanvasProps) {
  return (
    <main className="relative w-full min-w-0 px-4 pt-20 pb-24 sm:px-6 md:px-8">
      <div
        className=" relative
          mx-auto
          flex
          w-full
          max-w-7xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-border/50
          bg-card/20
          backdrop-blur-sm"
      >
        {/* Standard visualizer header */}
        <header
          className="
             relative
            shrink-0
            border-b
            border-border/50
            px-4
            py-4
            text-center
            sm:px-6
            sm:py-5
          "
        >
          <h1 className="text-xl font-bold text-foreground imd:text-2xl">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </header>

        {/* Only the visual area scrolls */}
        <section
          className="
             relative
            h-[clamp(320px,calc(100vh-18rem),900px)]
            min-h-0
            w-full
            min-w-0
            overflow-x-hidden
            overflow-y-auto
          "
        >
          <div className="relative w-full min-w-0">{children}</div>
        </section>

        {/* Standard visualizer footer */}
        <footer
          className="
            relative
            shrink-0
            border-t
            border-border/50
            px-4
            py-3
            sm:px-6
          "
        >
          <VisualizerPlaybackControls
            currentStep={currentStep}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            onPrevious={onPrevious}
            onNext={onNext}
            onPlay={onPlay}
            onPause={onPause}
            onRestart={onRestart}
          />
        </footer>
      </div>
    </main>
  );
}
