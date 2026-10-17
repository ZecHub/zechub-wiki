"use client";

import type { MouseEvent, ReactNode } from "react";
import { visualizerQuery } from "@/lib/visualizerRouting";
import { useVisualizerNavigation } from "./VisualizerNavigationContext";
import type { VisualizerModuleId } from "./visualizerModules";

interface VisualizerModuleLinkProps {
  module: VisualizerModuleId;
  className?: string;
  children: ReactNode;
}

/**
 * A link to another visualizer. It is a real `?module=` URL, so it can be
 * opened in a new tab or copied; a plain click goes through the hub so the
 * back button returns to the module the reader came from.
 */
export function VisualizerModuleLink({
  module,
  className,
  children,
}: VisualizerModuleLinkProps) {
  const navigation = useVisualizerNavigation();

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (!navigation?.goToModule || modified || event.button !== 0) return;
    event.preventDefault();
    navigation.goToModule(module);
  };

  return (
    <a href={visualizerQuery({ module })} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
