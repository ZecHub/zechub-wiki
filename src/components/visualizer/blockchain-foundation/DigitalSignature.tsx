import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileSignature,
  FileText,
  Hash,
  Key,
  KeyRound,
  Lock,
  ShieldCheck,
  Unlock
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

  const algorithms = [
    { name: "ECDSA", desc: "Used by Bitcoin/Zcash" },
    { name: "Schnorr", desc: "Signature aggregation" },
    { name: "BLS", desc: "50% smaller signatures" },
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

      {/* Sign & Verify Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Signing Process */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary" />
            Signing Process
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: FileText,
                label: "Message",
                value: "Send 1.5 ZEC to zs1...",
                color: "text-muted-foreground",
              },
              {
                icon: Hash,
                label: "Hash",
                value: "0x7f3a...digest",
                color: "text-pool-transparent",
              },
              {
                icon: Key,
                label: "Private Key",
                value: "Encrypt hash",
                color: "text-pool-sapling",
              },
              {
                icon: FileSignature,
                label: "Signature",
                value: "0xsig...attached",
                color: "text-pool-orchard",
              },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                  <p className="text-sm font-mono text-foreground truncate">
                    {step.value}
                  </p>
                </div>
                {i < 3 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Verification Process */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-pool-sapling" />
            Verification Process
          </h3>
          <div className="space-y-3">
            {[
              {
                icon: FileSignature,
                label: "Received",
                value: "Message + Signature",
                color: "text-muted-foreground",
              },
              {
                icon: KeyRound,
                label: "Public Key",
                value: "Decrypt signature",
                color: "text-pool-transparent",
              },
              {
                icon: Hash,
                label: "Compute Hash",
                value: "Hash received message",
                color: "text-pool-sapling",
              },
              {
                icon: Unlock,
                label: "Compare",
                value: "Hashes match ✓",
                color: "text-pool-orchard",
              },
            ].map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-pool-sapling/10 flex items-center justify-center">
                  <step.icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{step.label}</p>
                  <p className="text-sm font-mono text-foreground truncate">
                    {step.value}
                  </p>
                </div>
                {i < 3 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Verification result */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-4 bg-pool-sapling/10 border border-pool-sapling/30 rounded-lg p-3 flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-pool-sapling" />
            <span className="text-sm text-pool-sapling font-medium">
              Signature Valid - Transaction Authorized
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Algorithm Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex flex-wrap justify-center gap-3"
      >
        {algorithms.map((algo, i) => (
          <motion.div
            key={algo.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 + i * 0.1 }}
            className="bg-primary/10 border border-primary/30 rounded-full px-4 py-2 flex items-center gap-2"
          >
            <span className="font-bold text-primary text-sm">{algo.name}</span>
            <span className="text-xs text-muted-foreground">{algo.desc}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
