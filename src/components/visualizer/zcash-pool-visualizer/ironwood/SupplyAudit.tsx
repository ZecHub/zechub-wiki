import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle2, Sigma } from "lucide-react";
import { cn } from "@/lib/util";
import { POOL_THEMES } from "./types";

const AUDIT_POINTS = [
  {
    title: "The ceiling is known",
    body: "Because the turnstile caps outflows, the maximum amount of ZEC that can ever leave Orchard is exactly the amount that was ever put into it. That number is public.",
  },
  {
    title: "The pool shrinks in the open",
    body: "As users migrate, the remaining Orchard balance falls. Every step of that decline is recorded on-chain and checkable by any node.",
  },
  {
    title: "Two invariants tell the story",
    body: "If the remaining Orchard balance stays non-negative, and total shielded + transparent supply never exceeds the expected issuance, the community gains strong evidence that no counterfeiting occurred.",
  },
  {
    title: "Ironwood starts from zero",
    body: "The new pool opens empty and uses a corrected, formally verified circuit — so every ZEC inside it has a clean supply guarantee from day one.",
  },
];

const CHECKS = [
  { label: "Orchard remaining balance ≥ 0", detail: "consensus rule" },
  {
    label: "Cumulative Orchard outflow ≤ cumulative inflow",
    detail: "turnstile invariant",
  },
  {
    label: "Transparent + Sapling + Orchard + Ironwood ≤ issued supply",
    detail: "chain-wide audit",
  },
];

const MIGRATION_STEPS = [0, 18, 41, 63, 82, 94];

export const SupplyAudit = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % MIGRATION_STEPS.length);
    }, 1600);
    return () => clearInterval(timer);
  }, []);

  const migrated = MIGRATION_STEPS[step];
  const remaining = 100 - migrated;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground flex items-center gap-2">
            <Sigma className="w-4 h-4 text-amber-500" />
            Value that ever entered Orchard — the hard ceiling on what can leave
          </p>
        </div>

        <div className="h-8 w-full rounded-lg overflow-hidden flex border border-border/60">
          <motion.div
            animate={{ width: `${remaining}%` }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="bg-purple-500/30 border-r border-purple-500/50 flex items-center justify-center overflow-hidden"
          >
            <span className="text-[11px] font-mono text-purple-700 dark:text-purple-300 whitespace-nowrap px-1">
              Orchard {remaining}%
            </span>
          </motion.div>
          <motion.div
            animate={{ width: `${migrated}%` }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="bg-amber-500/30 flex items-center justify-center overflow-hidden"
          >
            <span className="text-[11px] font-mono text-amber-700 dark:text-amber-300 whitespace-nowrap px-1">
              Ironwood {migrated}%
            </span>
          </motion.div>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p className="text-xs text-muted-foreground">
            <span className={cn("font-medium", POOL_THEMES.orchard.text)}>
              Orchard
            </span>{" "}
            — shrinking, still shielded, still bounded by the turnstile.
          </p>
          <p className="text-xs text-muted-foreground sm:text-right">
            <span className={cn("font-medium", POOL_THEMES.ironwood.text)}>
              Ironwood
            </span>{" "}
            — growing, corrected circuit, clean from block zero.
          </p>
        </div>
      </motion.div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
          What every full node re-checks, block after block
        </p>
        <ul className="space-y-2">
          {CHECKS.map((check, index) => (
            <motion.li
              key={check.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.12 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">
                {check.label}
                <span className="block text-xs text-muted-foreground">
                  {check.detail}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {AUDIT_POINTS.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4"
          >
            <h4 className="font-semibold text-foreground mb-1">
              {point.title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {point.body}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
