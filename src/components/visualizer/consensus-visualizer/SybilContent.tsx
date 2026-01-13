import { motion } from "framer-motion";
import { AlertTriangle, Shield, Users } from "lucide-react";

export const SybilContent = () => {
  return (
    <div className="space-y-8">
      {/* What is Sybil attack */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-destructive/20 border border-destructive/30"
      >
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          The Sybil Attack Problem
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          In a network where voting determines truth, an attacker could create
          millions of fake identities to outvote legitimate participants.
        </p>
        <div className="flex flex-col imd:flex-row items-center justify-center gap-4 p-4 rounded-lg dark:bg-card/50 bg-slate-100 dark:border">
          <div className="text-center">
            <div className="flex -space-x-2 justify-center mb-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">3 Real Users</span>
          </div>
          <span className="text-muted-foreground">vs</span>
          <div className="text-center">
            <div className="flex -space-x-2 justify-center mb-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-destructive/20 border border-destructive/50 flex items-center justify-center"
                >
                  <Users className="w-4 h-4 text-destructive" />
                </div>
              ))}
            </div>
            <span className="text-xs text-destructive">
              1 Attacker (6 fakes)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Solution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
      >
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          How Zcash Prevents Sybil Attacks
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg dark:bg-card/40 bg-slate-100 dark:border border border-border">
            <h5 className="font-medium text-foreground mb-2">Proof of Work</h5>
            <p className="text-sm text-muted-foreground">
              Mining requires real computational resources. Creating fake
              identities doesn&apos;t give more voting power — only real work
              does.
            </p>
          </div>
          <div className="p-4 rounded-lg dark:bg-card/40 bg-slate-100 dark:border border border-border">
            <h5 className="font-medium text-foreground mb-2">Economic Cost</h5>
            <p className="text-sm text-muted-foreground">
              Attacking the network requires massive investment in hardware and
              electricity, making attacks economically irrational.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Key insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-lg bg-primary/10 border border-primary/30"
      >
        <p className="text-sm text-center text-muted-foreground">
          <strong className="text-foreground">Key Insight:</strong> Sybil
          resistance ties voting power to <em>scarce resources</em>{" "}
          (computation, stake) rather than easily-created identities.
        </p>
      </motion.div>
    </div>
  );
};
