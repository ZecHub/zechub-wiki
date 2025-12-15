import { AnimatePresence, motion } from "framer-motion";
import { ComparisonView } from "./ComparisonView";
import { IntroContent } from "./IntroContent";
import { PoolContent } from "./PoolConten";
import { TransactionContent } from "./TransactionContent";
import { Stage } from "./types";

interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
}

export const StageContent = ({ stage, isAnimating }: StageContentProps) => {
  const renderContent = () => {
    switch (stage.type) {
      case "intro":
        return <IntroContent stage={stage} />;
      case "pool":
        return <PoolContent stage={stage} />;
      case "transaction":
        return <TransactionContent stage={stage} isAnimating={isAnimating} />;
      case "comparison":
        return <ComparisonView />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        {/* Stage Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-primary font-medium mb-2"
          >
            {stage.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {stage.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            {stage.description}
          </motion.p>
        </div>

        {/* Stage-specific content */}
        <div className="mt-8">{renderContent()}</div>
      </motion.div>
    </AnimatePresence>
  );
};
