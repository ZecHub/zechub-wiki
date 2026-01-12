import { PlaybackControls } from "./PlaybackControls";

interface VisualizerFooterProps {
  currentStage: number;
  isPlaying: boolean;
  onPrevious: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  onRestart: () => void;
  onPause: () => void;
  onPlay: () => void;
  stages: any[];
}
export function VisualizerFooter(props: VisualizerFooterProps) {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-600 p-4 mt-12">
      <PlaybackControls
        stages={props.stages}
        currentStage={props.currentStage}
        isPlaying={props.isPlaying}
        onNext={props.goToNext}
        onRestart={props.onRestart}
        onPause={props.onPause}
        onPlay={props.onPlay}
        onPrevious={props.goToPrevious}
      />
    </footer>
  );
}
