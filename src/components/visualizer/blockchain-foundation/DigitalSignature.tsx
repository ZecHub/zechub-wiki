import { motion } from "framer-motion";
import {
  CheckCircle2,
  Lock,
  ShieldCheck
} from "lucide-react";

export const DigitalSignature = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "Authentication",
      desc: "Proves sender identity",
      color: "text-pool-transparent",
    },
    {
      icon: Lock,
      title: "Non-repudiation",
      desc: "Sender cannot deny sending",
      color: "text-pool-sapling",
    },
    {
      icon: CheckCircle2,
      title: "Integrity",
      desc: "Detects any tampering",
      color: "text-pool-orchard",
    },
  ];



  return (
    <div className="space-y-6">
      {/* Three Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
            >
              <pillar.icon
                className={`w-10 h-10 ${pillar.color} mx-auto mb-3`}
              />
            </motion.div>
            <h4 className="font-semibold text-foreground mb-1">
              {pillar.title}
            </h4>
            <p className="text-sm text-muted-foreground">{pillar.desc}</p>
          </motion.div>
        ))}
      </motion.div>


    </div>
  );
};
