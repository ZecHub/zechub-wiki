"client";

import { motion } from "framer-motion";

interface ProofStepProps {
  step: {
    title: string;
    description: string;
    details: string;
    stage: string;
  };
  stepNumber: number;
}
export default function ProofStep(props: ProofStepProps) {
  return (
    <motion.div
      style={{
        width: 100,
        height: 100,
        backgroundColor: "#ff0088",
        borderRadius: 5,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1 }}
    />
  );
}
