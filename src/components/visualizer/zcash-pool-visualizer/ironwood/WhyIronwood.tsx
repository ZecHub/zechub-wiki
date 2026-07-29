import { motion } from "framer-motion";
import { AlertTriangle, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { IRONWOOD_ACTIVATION } from "./types";

interface TimelineItem {
  when: string;
  title: string;
  body: string;
  icon: LucideIcon;
  accent: string;
}

const TIMELINE: TimelineItem[] = [
  {
    when: "May 2026",
    title: "A soundness bug is found",
    body: "Researchers discovered a flaw in the Orchard zero-knowledge circuit. In theory it allowed undetectable counterfeit notes to be created inside the Orchard pool.",
    icon: AlertTriangle,
    accent: "from-rose-500 to-red-600",
  },
  {
    when: "The catch",
    title: "Shielded means unverifiable",
    body: "There is no evidence the bug was ever exploited. But because Orchard balances are encrypted, users could not independently check that the total circulating supply was honest.",
    icon: EyeOff,
    accent: "from-amber-500 to-orange-600",
  },
  {
    when: "3 June 2026 · NU6.2",
    title: "The circuit is corrected",
    body: "An emergency upgrade re-enabled Orchard with a fixed circuit. That stopped any future forgery — but it could not retroactively prove the old pool was clean.",
    icon: ShieldCheck,
    accent: "from-emerald-500 to-teal-600",
  },
  {
    when: `${IRONWOOD_ACTIVATION.date} · ${IRONWOOD_ACTIVATION.upgrade}`,
    title: `${IRONWOOD_ACTIVATION.codename} opens a clean pool`,
    body: `Live since block ${IRONWOOD_ACTIVATION.blockHeight.toLocaleString()}, Ironwood adds a brand-new shielded pool and seals the old Orchard pool behind a public turnstile.`,
    icon: Sparkles,
    accent: "from-amber-500 to-yellow-600",
  },
];

export const WhyIronwood = () => (
  <div className="max-w-4xl mx-auto">
    <div className="relative">
      <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-rose-500/40 via-amber-500/40 to-yellow-500/40 hidden imd:block" />

      <div className="space-y-4">
        {TIMELINE.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.12 }}
              className="relative flex flex-col imd:flex-row gap-4"
            >
              <div
                className={`relative z-10 flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${item.accent} p-[2px] shadow-lg`}
              >
                <div className="w-full h-full rounded-[10px] bg-background flex items-center justify-center">
                  <Icon className="w-6 h-6 text-foreground" />
                </div>
              </div>

              <div className="flex-1 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4">
                <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground mb-1">
                  {item.when}
                </p>
                <h4 className="text-lg font-semibold text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="mt-6 text-center text-sm text-muted-foreground"
    >
      Ironwood does not accuse anyone of counterfeiting. It gives everyone the
      tools to check.
    </motion.p>
  </div>
);
