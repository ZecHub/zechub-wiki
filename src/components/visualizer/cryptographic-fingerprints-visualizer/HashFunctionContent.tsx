import { motion } from "framer-motion";
import { Hash, Layers } from "lucide-react";

// Hash Intro - What is a hash function
export function HashFunctionContent() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-6"
      >
        {/* Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-card border border-border min-w-[200px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Any Input</span>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>"Hello World"</p>
            <p>A 10GB file</p>
            <p>An entire blockchain</p>
          </div>
        </motion.div>


      </motion.div>
    </div>
  );
}
