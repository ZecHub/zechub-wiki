import React, { createContext, useContext } from "react";

interface VisualizerNavigationContextValue {
  goHome: () => void;
}

export const VisualizerNavigationContext =
  createContext<VisualizerNavigationContextValue | null>(null);

export function useVisualizerNavigation() {
  return useContext(VisualizerNavigationContext);
}

interface VisualizerNavigationProviderProps {
  goHome: () => void;
  children: React.ReactNode;
}

export function VisualizerNavigationProvider({
  goHome,
  children,
}: VisualizerNavigationProviderProps) {
  return (
    <VisualizerNavigationContext.Provider value={{ goHome }}>
      {children}
    </VisualizerNavigationContext.Provider>
  );
}
