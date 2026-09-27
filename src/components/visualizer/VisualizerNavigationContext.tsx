import { createContext, useContext } from "react";

interface VisualizerNavigationContextValue {
  goHome: () => void;
}

export const VisualizerNavigationContext =
  createContext<VisualizerNavigationContextValue | null>(null);

export function useVisualizerNavigation() {
  const context = useContext(VisualizerNavigationContext);

  if (!context) {
    throw new Error(
      `useVisualizerNavigation must be used inside VisualizerNavigationProvider`,
    );
  }

  return context;
}
