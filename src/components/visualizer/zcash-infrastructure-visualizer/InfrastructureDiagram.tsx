import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage } from './types';
import { COMPONENTS } from './data';
import { ComponentBox } from './ComponentBox';
import { ConnectionLine } from './ConnectionLine';

interface InfrastructureDiagramProps {
  stage: Stage;
}

export const InfrastructureDiagram: React.FC<InfrastructureDiagramProps> = ({
  stage,
}) => {
  const isHighlighted = (id: string) => stage.highlight.includes(id);

  const showLayer1 = stage.highlight.includes('zebra');
  const showLayer2 = stage.highlight.some(
    (h) => h === 'zaino' || h === 'lightwalletd'
  );
  const showLayer3 = stage.highlight.some(
    (h) => h === 'mobile' || h === 'desktop' || h === 'web'
  );

  const hasActiveConnection = (from: string, to: string) =>
    isHighlighted(from) &&
    ((to === 'layer2' &&
      (stage.highlight.includes('zaino') ||
        stage.highlight.includes('lightwalletd'))) ||
      (to === 'layer3' &&
        (stage.highlight.includes('mobile') ||
          stage.highlight.includes('desktop') ||
          stage.highlight.includes('web'))));

  if (stage.id === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center px-4">
        <p className="text-slate-300">
          Click <span className="text-yellow-400 font-semibold">Next</span> to
          explore the infrastructure
        </p>
      </div>
    );
  }

  if (stage.id === 7) {
    return (
      <div className="w-full flex justify-center">
        <div className="w-full max-w-5xl space-y-2">
          <div className="flex justify-center">
            <div className="max-w-[160px]">
              <ComponentBox
                id="zebra"
                component={COMPONENTS.zebra}
                highlighted
                compact
              />
            </div>
          </div>

          <ConnectionLine highlighted vertical />

          <div className="grid grid-cols-2 gap-2">
            <ComponentBox
              id="zaino"
              component={COMPONENTS.zaino}
              highlighted
              compact
            />
            <ComponentBox
              id="lightwalletd"
              component={COMPONENTS.lightwalletd}
              highlighted
              compact
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ConnectionLine highlighted vertical />
            <ConnectionLine highlighted vertical />
          </div>

          {/*WALLET GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3">
          <ComponentBox
              id="mobile"
              component={COMPONENTS.mobile}
              highlighted
              compact
            />
            <ComponentBox
              id="desktop"
              component={COMPONENTS.desktop}
              highlighted
              compact
            />
            <ComponentBox
              id="web"
              component={COMPONENTS.web}
              highlighted
              compact
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="w-full max-w-4xl space-y-4"
        >
          {showLayer2 && !showLayer3 && (
            <>
              <ComponentBox
                id="zebra"
                component={COMPONENTS.zebra}
                highlighted={isHighlighted('zebra')}
              />
              <ConnectionLine highlighted vertical />
              <div className="grid grid-cols-2 gap-4">
                <ComponentBox
                  id="zaino"
                  component={COMPONENTS.zaino}
                  highlighted={isHighlighted('zaino')}
                />
                <ComponentBox
                  id="lightwalletd"
                  component={COMPONENTS.lightwalletd}
                  highlighted={isHighlighted('lightwalletd')}
                />
              </div>
            </>
          )}

          {showLayer3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ComponentBox
                  id="zaino"
                  component={COMPONENTS.zaino}
                  highlighted={isHighlighted('zaino')}
                />
                <ComponentBox
                  id="lightwalletd"
                  component={COMPONENTS.lightwalletd}
                  highlighted={isHighlighted('lightwalletd')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ConnectionLine highlighted vertical />
                <ConnectionLine highlighted vertical />
              </div>

              {/* FIXED WALLET GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <ComponentBox
                  id="mobile"
                  component={COMPONENTS.mobile}
                  highlighted={isHighlighted('mobile')}
                />
                <ComponentBox
                  id="desktop"
                  component={COMPONENTS.desktop}
                  highlighted={isHighlighted('desktop')}
                />
                <ComponentBox
                  id="web"
                  component={COMPONENTS.web}
                  highlighted={isHighlighted('web')}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
