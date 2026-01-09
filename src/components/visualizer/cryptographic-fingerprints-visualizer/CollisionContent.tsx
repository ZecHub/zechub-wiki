import { motion } from "framer-motion";
import { ArrowRight, Fingerprint, XCircle } from "lucide-react";

export const CollisionContent = () => {
  const collisionsAreDangerous = [
    "An attacker could substitute a malicious file for a legitimate one",
    "Digital signatures could be forged",
    "Blockchain integrity could be compromised",
  ];

  return (
    <div className="space-y-8">
      {/* What is a collision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-primary" />
          What is a Collision?
        </h4>
        <p className="text-muted-foreground mb-4">
          A collision occurs when two different inputs produce the same hash
          output.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <code className="text-sm font-mono">"Input A"</code>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="p-3 rounded-lg bg-destructive/20 border border-destructive/30">
                <code className="text-xs font-mono text-destructive">
                  Same Hash!
                </code>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground rotate-180" />
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <code className="text-sm font-mono">"Input B"</code>
          </div>
        </div>
      </motion.div>

      {/* Why it's bad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-xl bg-destructive/10 border border-destructive/30"
      >
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-destructive" />
          Why Collisions Are Dangerous
        </h4>

        <ul className="space-y-2 text-sm text-muted-foreground">
          {collisionsAreDangerous.map((c, idx) => (
            <li className="flex items-start gap-2" key={idx}>
              <span className="text-destructive">.</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
