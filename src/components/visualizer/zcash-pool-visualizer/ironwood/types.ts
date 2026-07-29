import { Apple, Leaf, Sprout, TreeDeciduous } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const IRONWOOD_ACTIVATION = {
  upgrade: "NU6.3",
  codename: "Ironwood",
  date: "28 July 2026",
  blockHeight: 3428143,
} as const;

export type ShieldedPoolId = "sprout" | "sapling" | "orchard" | "ironwood";

export interface ShieldedPoolTheme {
  id: ShieldedPoolId;
  name: string;
  icon: LucideIcon;
  text: string;
  border: string;
  bg: string;
  gradient: string;
}

export const POOL_THEMES: Record<ShieldedPoolId, ShieldedPoolTheme> = {
  sprout: {
    id: "sprout",
    name: "Sprout",
    icon: Sprout,
    text: "text-lime-500 dark:text-lime-400",
    border: "border-lime-500/40",
    bg: "bg-lime-500/10",
    gradient: "from-lime-500 to-green-600",
  },
  sapling: {
    id: "sapling",
    name: "Sapling",
    icon: Leaf,
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500 to-teal-600",
  },
  orchard: {
    id: "orchard",
    name: "Orchard",
    icon: Apple,
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500 to-fuchsia-600",
  },
  ironwood: {
    id: "ironwood",
    name: "Ironwood",
    icon: TreeDeciduous,
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
    gradient: "from-amber-500 to-orange-600",
  },
};

