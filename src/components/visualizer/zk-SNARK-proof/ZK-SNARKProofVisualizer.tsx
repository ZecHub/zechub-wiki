"use client";

import { Card } from "@/components/UI/shadcn/card";
import { Progress } from "@/components/UI/shadcn/progress";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";
import type { Stage } from "./ProofStep";
import ProofStep from "./ProofStep";
import "./index.css";

export type Step = {
  title: string;
  description: string;
  details: string;
  stage: Stage;
};

const steps: Step[] = [
  {
    title: "Transaction Creation",
    description: "Alice wants to send ZEC to Bob privately",
    details:
      "In a shielded transaction, the sender, receiver, and amount are hidden using zero-knowledge proofs.",
    stage: "setup",
  },
  {
    title: "Commitment Scheme",
    description: "Creating a cryptographic commitment",
    details:
      "Alice creates a commitment to her note, which includes the value and recipient. This commitment is a hash that hides the actual data but can be verified later.",
    stage: "commitment",
  },
  {
    title: "Nullifier Generation",
    description: "Preventing double-spending",
    details:
      "A unique nullifier is generated for this note. Once published, this nullifier prevents the same note from being spent twice, without revealing which note it corresponds to.",
    stage: "nullifier",
  },
  {
    title: "Zero-Knowledge Proof",
    description: "Proving validity without revealing secrets",
    details:
      "Alice generates a zk-SNARK proof that proves: (1) She owns the input notes, (2) The nullifiers are correct, (3) The output commitments are valid - all without revealing any private information.",
    stage: "proof",
  },
  {
    title: "Merkle Tree Update",
    description: "Adding to the commitment tree",
    details:
      "The new output commitments are added to the Merkle tree. This tree stores all note commitments in the system, allowing future spends to prove membership.",
    stage: "merkle",
  },
  {
    title: "Transaction Broadcast",
    description: "Publishing to the blockchain",
    details:
      "The transaction is broadcast with: proof, nullifiers, and new commitments. Validators can verify the proof without learning anything about the transaction details.",
    stage: "broadcast",
  },
  {
    title: "Verification Complete",
    description: "Privacy preserved, validity confirmed",
    details:
      "The network has verified the transaction is valid, double-spend prevention is enforced, and Bob can now spend his received note - all while maintaining complete privacy.",
    stage: "complete",
  },
];

interface ZKSNARKProofVisualizerProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

const ZKSNARKProofVisualizer = ({
  onComplete,
  autoStart = false,
}: ZKSNARKProofVisualizerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);

  // Auto-start when Play All starts this visualizer.
  useEffect(() => {
    if (autoStart) {
      setIsPlaying(true);
    }
  }, [autoStart]);

  // Auto-play through steps
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 10000); // 10 seconds per step

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  /*
   * Play All completion.
   *
   * Keep the existing 10-second hold on the final step.
   */
  useEffect(() => {
    if (currentStep === steps.length - 1 && !isPlaying && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 10000); // Wait 10 seconds on final step before completing

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, onComplete]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

 

  const progress = ((currentStep + 1) / steps.length) * 100;
  const current = steps[currentStep];

  return (
    <VisualizerCanvas
      title="zk-SNARK Visualizer"
      description="Interactive demonstration of shielded transactions"
      currentStep={currentStep}
      totalSteps={steps.length}
      isPlaying={isPlaying}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={handleReset}
    >
      <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-8">
        {/* Progress Bar */}
        <Card className="bg-card p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Main Visualization Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Visual Diagram */}
          <Card className="bg-card p-8 min-h-[500px] flex items-center justify-center border-primary/20">
            <AnimatePresence mode="wait">
              <ProofStep
                key={currentStep}
                step={steps[currentStep]}
                stepNumber={currentStep}
              />
            </AnimatePresence>
          </Card>

          {/* Explanation Panel */}
          <Card className="bg-card p-8 space-y-6 border-secondary/20">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                  Stage {currentStep + 1}
                </div>
                <h2 className="text-3xl font-bold">
                  {steps[currentStep].title}
                </h2>
                <p className="text-xl text-secondary">
                  {steps[currentStep].description}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">How it works:</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {steps[currentStep].details}
                </p>
              </div>

              {currentStep === 3 && (
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <h4 className="font-semibold mb-2 text-accent">
                    Key Insight:
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The zk-SNARK proof is the &quot;magic&quot; that makes this
                    all work. It&apos;s a cryptographic proof that can verify
                    complex statements without revealing the underlying data.
                  </p>
                </Card>
              )}
            </motion.div>
          </Card>
        </div>
      </div>
    </VisualizerCanvas>
  );
};

export default ZKSNARKProofVisualizer;
