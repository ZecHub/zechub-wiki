import { AnimatePresence, motion } from "framer-motion";
import { ComparisonView } from "./ComparisonView";
import { IntroContent } from "./IntroContent";
import { PoolContent } from "./PoolConten";
import { TransactionContent } from "./TransactionContent";
import { IronwoodFooter } from "./ironwood/IronwoodFooter";
import { MigrationFlow } from "./ironwood/MigrationFlow";
import { SupplyAudit } from "./ironwood/SupplyAudit";
import { TurnstileExplainer } from "./ironwood/TurnstileExplainer";
import { WhyIronwood } from "./ironwood/WhyIronwood";
import { IRONWOOD_STAGE_TYPES, Stage } from "./types";

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
      case "ironwood-why":
        return <WhyIronwood />;
      case "ironwood-turnstile":
        return <TurnstileExplainer />;
      case "ironwood-migration":
        return <MigrationFlow />;
      case "ironwood-audit":
        return <SupplyAudit />;
      default:
        return null;
    }
  };

  const isIronwoodStage = IRONWOOD_STAGE_TYPES.includes(stage.type);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-[640]"
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
            className="text-2xl imd:text-3xl md:text-4xl font-bold text-foreground mb-4"
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
        <div className={isIronwoodStage ? "mt-10" : "mt-24"}>
          {renderContent()}
          {isIronwoodStage && <IronwoodFooter />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
