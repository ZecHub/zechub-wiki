import { AnimatePresence, motion } from "framer-motion";
import { IntroContent } from "./IntroContent";
import { PaymentContent } from "./PaymentContent";
import { Slide } from "./types";

interface StageContentProps {
  slide: Slide;
  isAnimating: boolean;
}

export const StageContent = ({ slide, isAnimating }: StageContentProps) => {
  const renderContent = () => {
    if (slide.id === 0) {
      return <IntroContent />;
    }
    return <PaymentContent slide={slide} />;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slide.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-[640px]"
      >
        {/* Stage Header */}
        <div className="text-center mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-primary font-medium mb-2"
          >
            {slide.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {slide.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {slide.description}
          </motion.p>
        </div>

        {/* Stage-specific content */}
        <div className="mt-12">{renderContent()}</div>
      </motion.div>
    </AnimatePresence>
  );
};