import { motion } from "framer-motion";
import { Fingerprint, Hash, Layers, RefreshCw, Shield } from "lucide-react";

// Hash Intro - What is a hash function
export function HashFunctionIntroContent() {
  const icons = [
    {
      icon: Shield,
      title: "Deterministic",
      desc: "Same input always produces same output",
    },
    { icon: RefreshCw, title: "One-Way", desc: "Cannot reverse to find input" },
    {
      icon: Fingerprint,
      title: "Unique",
      desc: "Tiny changes create completely different hashes",
    },
  ];

  return (
    <div className="space-y-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-8"
      >
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl dark:bg-card bg-card/10 dark:border border-border min-w-[240px] min-h-[160px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-5 h-5 text-primary font-extrabold" />
            <span className="font-medium text-foreground">Any Input</span>
          </div>
          <div className="space-y-2 text-sm dark:text-muted-foreground text-slate-600">
            <p>"Hello World"</p>
            <p>A 10GB file</p>
            <p>An entire blockchain</p>
          </div>
        </motion.div>

        {/* Arrow with hash function */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="p-4 rounded-full bg-gradient-to-br dark:from-primary/20 dark:to-primary/5 
            from-primary/40 to-primary/25
            border border-primary/30"
          >
            <Hash className="w-8 h-8 text-primary" />
          </motion.div>
          <span className="text-xs text-muted-foreground font-mono">
            SHA-256
          </span>
        </motion.div>

        {/* Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 rounded-xl bg-primary/5 border border-primary/100 min-w-[240px] min-h-[160px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <Fingerprint className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Fixed Output</span>
          </div>
          <code className="text-xs font-mono font-extrabold text-primary break-all">
            64 characters (256 bits)
          </code>
        </motion.div>
      </motion.div>

      {/* Key property preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {icons.map((itm, idx) => (
          <motion.div
            key={itm.title}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            className="p-4 rounded-lg dark:bg-card/40 bg-card/5 dark:border border-border"
          >
            <itm.icon className="w-5 h-5 text-primary mb-2 font-medium" />
            <h4 className="font-medium text-foreground text-sm">{itm.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{itm.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
