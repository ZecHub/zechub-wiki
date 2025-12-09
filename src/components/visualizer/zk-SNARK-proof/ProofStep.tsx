"client";

import { motion } from "framer-motion";
import { BroadcastVisualization } from "./BroadcastVisualization";
import { CommitmentVisualization } from "./CommitmentVisualization";
import { CompleteVisualization } from "./CompleteVisualization";
import { MerkleVisualization } from "./MerkleVisualization";
import { NullifierVisualization } from "./NullifierVisualization";
import { ProofVisualization } from "./ProofVisualization";
import { SetupVisualization } from "./SetupVisualization";

export type Stage =
  | "setup"
  | "commitment"
  | "proof"
  | "merkle"
  | "broadcast"
  | "nullifier"
  | "complete";

interface ProofStepProps {
  step: {
    title: string;
    description: string;
    details: string;
    stage: Stage;
  };
  stepNumber: number;
}

export default function ProofStep(props: ProofStepProps) {
  const renderVisualization = () => {
    switch (props.step.stage) {
      case "setup":
        return <SetupVisualization />;
      case "commitment":
        return <CommitmentVisualization />;
      case "nullifier":
        return <NullifierVisualization />;
      case "merkle":
        return <MerkleVisualization />;
      case "broadcast":
        return <BroadcastVisualization />;
      case "complete":
        return <CompleteVisualization />;
      case "proof":
        return <ProofVisualization />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex items-center justify-center"
    >
      {renderVisualization()}
    </motion.div>
  );
}
