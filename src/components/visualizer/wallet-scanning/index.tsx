"use client";

import { ScanSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  SCENARIOS,
  SCENARIO_ORDER,
  applyAutoAction,
  blockAt,
  nextAutoAction,
  openExample,
  reorgExample,
  replayExample,
  rescanExample,
  resumeExample,
  scanExample,
  type ExampleState,
  type SimBlock,
} from "@/lib/walletScanSimulation";
import { VisualizerCanvas } from "../VisualizerCanvas";
import {
  ChainPanel,
  Disclaimer,
  ExamplePicker,
  FurtherReading,
  LessonCallout,
  STAGES,
  ScanControls,
  ScanPanel,
  WalletPanel,
} from "./WalletScanningContent";

const SCAN_INTERVAL = 1200; // per block while scanning plays
const READ_DELAY = 4000; // before a reorg, a rescan, or carrying on past a cut-off
const NEXT_EXAMPLE_DELAY = 8000; // reading time at the end of an example in the tour

/**
 * "example" plays the current guided example and stops at its end; "tour"
 * (the canvas play button, and Play All) moves on through every example.
 */
type PlayMode = "example" | "tour" | null;

interface WalletScanningVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

/** The block the detail view follows: the last one scanned, or the next one. */
function followedBlock(example: ExampleState): SimBlock {
  const last = example.scan.stored[example.scan.stored.length - 1];
  const all = [...example.chain, ...example.orphaned];
  return (
    (last && all.find((block) => block.hash === last.hash)) ??
    blockAt(example.chain, example.scan.birthday) ??
    example.chain[0]
  );
}

export const WalletScanningVisualizer = ({
  onComplete,
  autoStart = false,
}: WalletScanningVisualizerProps) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [example, setExample] = useState(() => openExample(SCENARIO_ORDER[0]));
  const [playMode, setPlayMode] = useState<PlayMode>(autoStart ? "tour" : null);
  const [pinned, setPinned] = useState<string | null>(null);

  // Play All starting or stopping while this module is open.
  const [prevAutoStart, setPrevAutoStart] = useState(autoStart);
  if (autoStart !== prevAutoStart) {
    setPrevAutoStart(autoStart);
    setPlayMode(autoStart ? "tour" : null);
  }

  const goToStage = useCallback((index: number) => {
    setStageIndex(index);
    setExample(openExample(SCENARIO_ORDER[index]));
    setPinned(null);
  }, []);

  /** Applies a reader's change to the example and lets the detail view follow it again. */
  const change = useCallback((next: ExampleState, mode?: PlayMode) => {
    setExample(next);
    setPinned(null);
    if (mode !== undefined) setPlayMode(mode);
  }, []);

  useEffect(() => {
    if (!playMode) return;

    const action = nextAutoAction(example);
    const stopsHere = action === "done" || action === "halt";
    // Playing a single example ends at its end; the step that got there
    // already cleared the mode, so this only guards a stale render.
    if (stopsHere && playMode === "example") return;

    const delay =
      action === "scan"
        ? SCAN_INTERVAL
        : action === "done"
          ? NEXT_EXAMPLE_DELAY
          : READ_DELAY;

    const timer = setTimeout(() => {
      if (action === "done") {
        if (stageIndex < STAGES.length - 1) {
          goToStage(stageIndex + 1);
        } else {
          setPlayMode(null);
          onComplete?.();
        }
        return;
      }
      if (action === "halt") {
        // The tour reads the cut-off, then lets the sync carry on.
        setExample(resumeExample(example));
        return;
      }
      const next = applyAutoAction(example, action);
      setExample(next);
      setPinned(null);
      const after = nextAutoAction(next);
      if (playMode === "example" && (after === "done" || after === "halt")) {
        setPlayMode(null);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [playMode, example, stageIndex, goToStage, onComplete]);

  const stage = STAGES[stageIndex];
  const all = [...example.chain, ...example.orphaned];
  const selected = (pinned && all.find((block) => block.hash === pinned)) || followedBlock(example);
  const isPlaying = playMode !== null;

  const playExample = () => {
    const action = nextAutoAction(example);
    if (action === "done") return;
    change(action === "halt" ? resumeExample(example) : example, "example");
  };

  return (
    <VisualizerCanvas
      title="How Your Zcash Wallet Finds Your Money"
      description="A light wallet scans every block, tries to decrypt every output, and watches for its own nullifiers"
      currentStep={stageIndex}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={() => {
        if (stageIndex === 0) return;
        goToStage(stageIndex - 1);
        if (playMode === "example") setPlayMode(null);
      }}
      onNext={() => {
        if (stageIndex === STAGES.length - 1) return;
        goToStage(stageIndex + 1);
        if (playMode === "example") setPlayMode(null);
      }}
      onPlay={() => {
        if (nextAutoAction(example) === "halt") setExample(resumeExample(example));
        setPlayMode("tour");
      }}
      onPause={() => setPlayMode(null)}
      onRestart={() => {
        goToStage(0);
        setPlayMode(null);
      }}
      iconHeader={<ScanSearch className="h-8 w-8 text-emerald-500" />}
    >
      <div className="mx-auto w-full max-w-6xl space-y-4 px-3 py-4 sm:px-4 md:space-y-5 md:py-6">
        <ExamplePicker
          current={stageIndex}
          onSelect={(index) => {
            goToStage(index);
            if (playMode === "example") setPlayMode(null);
          }}
        />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            {stageIndex + 1}. {stage.title}
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">{stage.intro}</p>
          <Disclaimer />
        </div>

        <ScanControls
          example={example}
          isPlaying={isPlaying}
          onStep={() => change(scanExample(example), playMode === "tour" ? "tour" : null)}
          onTogglePlay={() => (isPlaying ? setPlayMode(null) : playExample())}
          onReplay={() =>
            change(replayExample(example, example.scan.birthday), "example")
          }
          onBirthday={(height) => change(replayExample(example, height), null)}
          onReorg={() => change(reorgExample(example))}
          onRescan={() =>
            change(
              rescanExample(example, SCENARIOS[example.id].rescanFrom ?? example.scan.birthday),
              "example",
            )
          }
        />

        <LessonCallout example={example} />

        <ChainPanel
          example={example}
          selected={selected}
          onSelect={(block) => setPinned((current) => (current === block.hash ? null : block.hash))}
        />

        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <ScanPanel example={example} />
          <WalletPanel example={example} />
        </div>

        <FurtherReading />
      </div>
    </VisualizerCanvas>
  );
};

export default WalletScanningVisualizer;
