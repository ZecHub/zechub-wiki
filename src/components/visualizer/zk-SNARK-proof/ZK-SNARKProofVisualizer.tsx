'use client'

import { Button } from "@/components/UI/shadcn/button";
import { Card } from "@/components/UI/shadcn/card";
import { Progress } from "@/components/UI/shadcn/progress";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Stage } from "./ProofStep";
import ProofStep from "./ProofStep";

export type Step = {
  title: string;
  description: string;
  details: string;
  stage: Stage;
};
import './index.css';

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

const ZKSNARKProofVisualizer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 10000);
      
      return () => clearInterval(timer);
    }
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className=" min-h-screen py-12 px-6 rounded-sm bg-background text-foreground">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">zk-SNARK Visualizer</h1>
            <p className="text-muted-foreground">
              Interactive demonstration of shielded transactions
            </p>
          </div>
          <div className="w-24" /> {/* Spacer for alignment */}
        </div>

        {/* Progress Bar */}
        <Card className="bg-card p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
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
                <Card className=" p-4 bg-accent/5 border-accent/20">
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

        {/* Controls */}
        <Card className="bg-card p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              className="border-destructive/30 hover:border-destructive/50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              size="lg"
              onClick={togglePlay}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Play
                </>
              )}
            </Button>

            <Button variant="outline" size="lg" onClick={handleNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-primary w-8"
                    : index < currentStep
                    ? "bg-secondary"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Additional Info */}
        {/* <Card className=" p-6 bg-muted/20 border-border/50">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">
                288 bytes
              </h3>
              <p className="text-sm text-muted-foreground">
                Average proof size
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-secondary mb-2">
                ~6 seconds
              </h3>
              <p className="text-sm text-muted-foreground">
                Proof generation time
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-accent mb-2">~10 ms</h3>
              <p className="text-sm text-muted-foreground">
                Proof verification time
              </p>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
};

export default ZKSNARKProofVisualizer;
