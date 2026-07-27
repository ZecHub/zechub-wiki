import { motion } from "framer-motion";
import { ArrowRight, Ban, Quote, Scale, ServerCog, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PoolBadge } from "./PoolBadge";
import { POOL_THEMES, ShieldedPoolId } from "./types";

interface KeyPoint {
  icon: LucideIcon;
  title: string;
  body: string;
}

const KEY_POINTS: KeyPoint[] = [
  {
    icon: Scale,
    title: "Value is counted at the door",
    body: "Every time value leaves a shielded pool it passes a public checkpoint. The amount crossing is recorded in the clear, even though the notes themselves stay encrypted.",
  },
  {
    icon: Ban,
    title: "You cannot take out more than went in",
    body: "The protocol never allows more value to leave a pool than has ever entered it. An attempt to over-withdraw is simply an invalid block.",
  },
  {
    icon: History,
    title: "Zcash has done this before",
    body: "The same mechanism already guarded Sprout → Sapling and Sapling → Orchard. Ironwood reuses a well-understood tool rather than inventing one.",
  },
  {
    icon: ServerCog,
    title: "Anyone can check the numbers",
    body: "Pool balances are consensus state. Run your own node and you can verify the turnstile arithmetic yourself — no trusted party required.",
  },
];

const LINEAGE: { from: ShieldedPoolId; to: ShieldedPoolId; era: string }[] = [
  { from: "sprout", to: "sapling", era: "2018" },
  { from: "sapling", to: "orchard", era: "2022" },
  { from: "orchard", to: "ironwood", era: "2026" },
];

export const TurnstileExplainer = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <motion.blockquote
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 pl-14"
    >
      <Quote className="absolute left-5 top-6 w-6 h-6 text-amber-500" />
      <p className="text-lg md:text-xl text-foreground leading-relaxed">
        A turnstile does for hidden money what a glass door does for a bank
        vault. You still cannot see inside, but you can count exactly what goes
        in and what comes out.
      </p>
    </motion.blockquote>

    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6"
    >
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl border-2 border-purple-500/50 bg-purple-500/10 overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-md" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-2xl font-bold text-purple-500">
              ••••
            </span>
          </div>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
              initial={{ x: 20 + i * 18, y: 110, opacity: 0 }}
              animate={{ y: [110, 20], opacity: [0, 1, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "easeOut",
              }}
            />
          ))}
          <p className="absolute bottom-1 inset-x-0 text-center text-[10px] uppercase tracking-wide text-muted-foreground">
            contents hidden
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 90] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.4,
            }}
            className="relative w-14 h-14 rounded-full border-2 border-amber-500/70 flex items-center justify-center"
          >
            <div className="absolute w-full h-0.5 bg-amber-500/70" />
            <div className="absolute h-full w-0.5 bg-amber-500/70" />
          </motion.div>
          <ArrowRight className="w-5 h-5 text-amber-500" />
          <p className="text-[11px] font-mono text-amber-600 dark:text-amber-400 whitespace-nowrap">
            amount revealed
          </p>
        </div>

        <div className="rounded-xl border-2 border-amber-500/50 bg-amber-500/10 px-4 py-6 text-center">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
            public tally
          </p>
          <motion.p
            key="tally"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400"
          >
            in − out
          </motion.p>
          <p className="text-[10px] text-muted-foreground mt-1">
            must never go negative
          </p>
        </div>
      </div>
    </motion.div>

    <div className="grid gap-4 sm:grid-cols-2">
      {KEY_POINTS.map((point, index) => {
        const Icon = point.icon;
        return (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.1 }}
            className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <h4 className="font-semibold text-foreground">{point.title}</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {point.body}
            </p>
          </motion.div>
        );
      })}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="rounded-xl border border-border/60 bg-card/40 p-4"
    >
      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 text-center">
        Turnstiles Zcash has already used
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        {LINEAGE.map(({ from, to, era }) => (
          <div
            key={`${from}-${to}`}
            className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2"
          >
            <span className={`text-sm font-medium ${POOL_THEMES[from].text}`}>
              {POOL_THEMES[from].name}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className={`text-sm font-medium ${POOL_THEMES[to].text}`}>
              {POOL_THEMES[to].name}
            </span>
            <span className="text-xs font-mono text-muted-foreground ml-1">
              {era}
            </span>
          </div>
        ))}
      </div>
    </motion.div>

    <div className="grid gap-3 sm:grid-cols-2">
      <PoolBadge pool="orchard" status="Sealed by the turnstile" />
      <PoolBadge pool="ironwood" status="Starts empty, starts clean" pulse />
    </div>
  </div>
);
