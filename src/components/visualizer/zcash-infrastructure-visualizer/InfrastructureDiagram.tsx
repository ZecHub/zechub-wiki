import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage } from './types';
import { COMPONENTS } from './data';
import { ComponentBox } from './ComponentBox';
import { ConnectionLine } from './ConnectionLine';

interface InfrastructureDiagramProps {
  stage: Stage;
}

export const InfrastructureDiagram: React.FC<InfrastructureDiagramProps> = ({ stage }) => {
  const isHighlighted = (componentId: string) => stage.highlight.includes(componentId);

  // Determine which layers to show based on highlighted components
  const showLayer1 = stage.highlight.includes('zebra');
  const showLayer2 = stage.highlight.some(h => h === 'zaino' || h === 'lightwalletd');
  const showLayer3 = stage.highlight.some(h => h === 'mobile' || h === 'desktop' || h === 'web');

  const hasActiveConnection = (from: string, to: string) => {
    if (stage.highlight.length === 0) return false;
    return isHighlighted(from) && stage.highlight.some(h =>
      (to === 'layer2' && (h === 'zaino' || h === 'lightwalletd')) ||
      (to === 'layer3' && (h === 'mobile' || h === 'desktop' || h === 'web'))
    );
  };

  // Welcome stage - show overview
  if (stage.id === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="text-center max-w-2xl px-4">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-4 sm:mb-6 mx-auto w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.5)] sm:shadow-[0_0_60px_rgba(251,191,36,0.6)]"
          >
            <span className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900">Z</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed"
          >
            Click <span className="text-yellow-400 font-semibold">Next</span> or <span className="text-yellow-400 font-semibold">Play</span> to explore the infrastructure
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // Last stage - show complete ecosystem with compact sizing
  if (stage.id === 7) {
    return (
      <div className="w-full h-full flex items-center justify-center py-2">
        <div className="w-full max-w-5xl px-2 sm:px-3 md:px-4">
          <div className="space-y-1 sm:space-y-1.5">
            {/* Layer 1 - Full Node - Compact */}
            <div className="flex justify-center">
              <div className="w-full max-w-[100px] sm:max-w-[130px] md:max-w-[160px]">
                <ComponentBox
                  id="zebra"
                  component={COMPONENTS.zebra}
                  highlighted={true}
                  compact={true}
                />
              </div>
            </div>

            {/* Connection 1 to 2 - Shorter */}
            <div className="h-1.5 sm:h-2 relative">
              <ConnectionLine highlighted={true} vertical={true} />
            </div>

            {/* Layer 2 - Indexers - Compact */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
              <ComponentBox
                id="zaino"
                component={COMPONENTS.zaino}
                highlighted={true}
                compact={true}
              />
              <ComponentBox
                id="lightwalletd"
                component={COMPONENTS.lightwalletd}
                highlighted={true}
                compact={true}
              />
            </div>

            {/* Connection 2 to 3 - Shorter */}
            <div className="h-1.5 sm:h-2 relative">
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
                <div className="relative">
                  <ConnectionLine highlighted={true} vertical={true} />
                </div>
                <div className="relative">
                  <ConnectionLine highlighted={true} vertical={true} />
                </div>
              </div>
            </div>

            {/* Layer 3 - Wallets - Compact */}
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5 md:gap-2">
              <ComponentBox
                id="mobile"
                component={COMPONENTS.mobile}
                highlighted={true}
                compact={true}
              />
              <ComponentBox
                id="desktop"
                component={COMPONENTS.desktop}
                highlighted={true}
                compact={true}
              />
              <ComponentBox
                id="web"
                component={COMPONENTS.web}
                highlighted={true}
                compact={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Individual stages - show only relevant layers
  return (
    <div className="w-full h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-4xl"
        >
          {/* Single layer view */}
          {!showLayer2 && !showLayer3 && showLayer1 && (
            <div className="flex justify-center">
              <div className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-md">
                <ComponentBox
                  id="zebra"
                  component={COMPONENTS.zebra}
                  highlighted={true}
                  compact={false}
                />
              </div>
            </div>
          )}

          {/* Two layer view (Layer 1 + 2) */}
          {showLayer2 && !showLayer3 && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="flex justify-center">
                <div className="w-full max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-md">
                  <ComponentBox
                    id="zebra"
                    component={COMPONENTS.zebra}
                    highlighted={isHighlighted('zebra')}
                    compact={false}
                  />
                </div>
              </div>

              <div className="h-8 sm:h-10 md:h-12 relative">
                <ConnectionLine highlighted={hasActiveConnection('zebra', 'layer2')} vertical={true} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <ComponentBox
                  id="zaino"
                  component={COMPONENTS.zaino}
                  highlighted={isHighlighted('zaino')}
                  compact={false}
                />
                <ComponentBox
                  id="lightwalletd"
                  component={COMPONENTS.lightwalletd}
                  highlighted={isHighlighted('lightwalletd')}
                  compact={false}
                />
              </div>
            </div>
          )}

          {/* Three layer view (wallet layers) */}
          {showLayer3 && (
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <ComponentBox
                  id="zaino"
                  component={COMPONENTS.zaino}
                  highlighted={isHighlighted('zaino')}
                  compact={false}
                />
                <ComponentBox
                  id="lightwalletd"
                  component={COMPONENTS.lightwalletd}
                  highlighted={isHighlighted('lightwalletd')}
                  compact={false}
                />
              </div>

              <div className="h-8 sm:h-10 md:h-12 relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  <div className="relative">
                    <ConnectionLine highlighted={hasActiveConnection('zaino', 'layer3')} vertical={true} />
                  </div>
                  <div className="relative">
                    <ConnectionLine highlighted={hasActiveConnection('lightwalletd', 'layer3')} vertical={true} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                <ComponentBox
                  id="mobile"
                  component={COMPONENTS.mobile}
                  highlighted={isHighlighted('mobile')}
                  compact={false}
                />
                <ComponentBox
                  id="desktop"
                  component={COMPONENTS.desktop}
                  highlighted={isHighlighted('desktop')}
                  compact={false}
                />
                <ComponentBox
                  id="web"
                  component={COMPONENTS.web}
                  highlighted={isHighlighted('web')}
                  compact={false}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};