import { motion } from "framer-motion";
import { ExternalLink, Info } from "lucide-react";
import { Link } from "@/i18n/navigation";

const FURTHER_READING = [
  { href: "/zcash-evolution", label: "Zcash network upgrade timeline" },
  { href: "/using-zcash/shielded-pools", label: "Zcash value pools" },
];

export const IronwoodFooter = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.6 }}
    className="max-w-4xl mx-auto mt-10 space-y-4"
  >
    <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-secondary/40 p-3">
      <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
      <p className="text-xs text-muted-foreground">
        Educational visualization — not financial advice. Migration is handled
        by wallets; amounts and timings shown here are illustrative.
      </p>
    </div>

    <div className="flex flex-wrap items-center justify-center gap-3">
      {FURTHER_READING.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-foreground hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          {item.label}
        </Link>
      ))}
      <a
        href="https://zips.z.cash/zip-0318"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm text-foreground hover:border-amber-500/60 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        ZIP 318 — Orchard to Ironwood migration
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </motion.div>
);
