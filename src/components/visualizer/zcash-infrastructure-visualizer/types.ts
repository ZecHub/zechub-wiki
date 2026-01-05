import { LucideIcon } from 'lucide-react';

export interface Stage {
  id: number;
  title: string;
  description: string;
  highlight: string[];
}

export interface Component {
  name: string;
  description: string;
  color: string;
  borderColor: string;
  glowColor: string;
  icon: LucideIcon;
  docs: string;
  layer: number;
}

export interface ComponentsMap {
  [key: string]: Component;
}