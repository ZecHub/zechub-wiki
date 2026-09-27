"use client";

import { parseMarkdown } from "@/lib/parseMarkdown";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import { StageContent } from "./StageContent";
import "./index.css";
import { STAGES } from "./types";
import { Wallet } from "lucide-react";

const WELCOME_STAGE_INTERVAL = 1000; // 4 seconds for welcome stage
const OTHER_STAGES_INTERVAL = 10000; // 10 seconds for other stages

const url = `/site/Using_Zcash/Wallets.md`;

export type Device = "Mobile" | "Desktop" | "Full Node" | "Web" | "Hardware";

export type WalletInfo = {
  title: string;
  url: string;
  imageUrl: string;
  devices: string[];
  pools: string[];
  features: string[];
  syncSpeed: string;
};

const noneShieldedWallets = ["Exodus", "SSP", "Trust", "Coinomi", "Vultisig"];
const noneShieldedSet = new Set(
  noneShieldedWallets.map((w) => w.toLowerCase()),
);

interface WalletVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const WalletVisualizer = ({
  onComplete,
  autoStart = false,
}: WalletVisualizerProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [isAnimating, setIsAnimating] = useState(true);
  const [wallets, setWallets] = useState<WalletInfo[]>([]);

  const stage = STAGES[currentStage];

  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Completion logic
  useEffect(() => {
    if (currentStage === STAGES.length - 1 && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, OTHER_STAGES_INTERVAL);

      return () => clearTimeout(timer);
    }
  }, [currentStage, onComplete]);
  useEffect(() => {
    async function getWalletInfo() {
      try {
        const res = await fetch(`/api/github/file?path=${url}`);

        const data = await res.json();
        const content = atob(data.content);

        const parsedData = parseMarkdown(content)
          .filter((w) => !noneShieldedSet.has(w.title.toLowerCase()))
          .map((d) => ({
            ...d,
            devices: d.devices.map((d) => d.toLowerCase()),
          }));

        setWallets(parsedData);
      } catch (err) {
        console.error(err);
      }
    }

    getWalletInfo();
  }, []);

  const goToNext = useCallback(() => {
    if (currentStage < STAGES.length - 1) {
      setCurrentStage((prev) => prev + 1);
      setIsAnimating(true);
    } else {
      setIsPlaying(false);
    }
  }, [currentStage]);

  const goToPrevious = useCallback(() => {
    if (currentStage > 0) {
      setCurrentStage((prev) => prev - 1);
      setIsAnimating(true);
    }
  }, [currentStage]);

  const goToStage = useCallback((stageIndex: number) => {
    setCurrentStage(stageIndex);
    setIsAnimating(true);
  }, []);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setIsAnimating(true);
    setIsPlaying(false);
  }, []);

  // Auto-play logic with different intervals
  useEffect(() => {
    if (!isPlaying) return;

    // Use faster interval for welcome stage (stage 0), slower for others
    const interval =
      currentStage === 0 ? WELCOME_STAGE_INTERVAL : OTHER_STAGES_INTERVAL;

    const timer = setTimeout(() => {
      goToNext();
    }, interval);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStage, goToNext]);

  return (
    <VisualizerCanvas
      title={"Zcash Wallet Visualizer"}
      description="Interactive guide to Zcash privacy technology"
      currentStep={currentStage}
      totalSteps={STAGES.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<Wallet className="w-10 h-10 text-yellow-400" />}
    >
      <StageContent stage={stage} wallets={wallets} isAnimating={isAnimating} />
    </VisualizerCanvas>
  );
};
