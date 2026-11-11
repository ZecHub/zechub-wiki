import React, { createContext, useContext } from "react";
import type { VisualizerModuleId } from "./visualizerModules";

interface VisualizerNavigationContextValue {
  goHome: () => void;
  /** Opens another module, for links that carry a reader between visualizers. */
  goToModule?: (id: VisualizerModuleId) => void;
}

export const VisualizerNavigationContext =
  createContext<VisualizerNavigationContextValue | null>(null);

export function useVisualizerNavigation() {
  return useContext(VisualizerNavigationContext);
}

interface VisualizerNavigationProviderProps {
  goHome: () => void;
  goToModule?: (id: VisualizerModuleId) => void;
  children: React.ReactNode;
}

export function VisualizerNavigationProvider({
  goHome,
  goToModule,
  children,
}: VisualizerNavigationProviderProps) {
  return (
    <VisualizerNavigationContext.Provider value={{ goHome, goToModule }}>
      {children}
    </VisualizerNavigationContext.Provider>
  );
}
