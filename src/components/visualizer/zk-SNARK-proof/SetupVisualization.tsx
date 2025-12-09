import { motion } from "framer-motion";
import { Send } from "lucide-react";

export const SetupVisualization = () => {
  <div className="space-y-8 w-full">
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center gap-4 bg-card border boder-primary/20 rounded-lg p-6"
    >
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary">A</span>
      </div>
      <div>
        <p className="font-semibold">Alice (Sender)</p>
        <p className="text-sm text-muted-foreground">Wants to send 1 ZEC</p>
      </div>
    </motion.div>

    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.4 }}
      className="flex justify-center"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Send className="w-12 h-12 text-secondary" />
      </motion.div>
    </motion.div>

    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex items-center gap-4 bg-card border border-secondary/20 rounded-lg p-6"
    >
      <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
        <span className="text-2xl font-bold text-secondary">B</span>
      </div>
      <div>
        <p className="font-semibold">Bob (Receiver)</p>
        <p className="text-sm text-muted-foreground">Will receive privately</p>
      </div>
    </motion.div>
  </div>;
};
