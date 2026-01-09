import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

// Hash Intro - What is a hash function
export function IntegrityContent() {
  const originalData = "Transaction: Send 10 ZEC";
  const modifiedData = "Transaction: Send 100 ZEC";

  return (
    <div className="space-y-8">
      {/* <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-emerald-500" />
        <h2 className="text-lg font-semibold text-foreground mb-4 text-center">
          IntegrityContent
        </h2>
      </div> */}
      {/* Original vs Modified comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <h4 className="font-semibold text-foreground">Original Data</h4>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border mb-3">
            <code className="text-sm font-mono text-foreground">
              {originalData}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <code className="text-xs font-mono text-emerald-500 break-all">
              a7f3b2c...8d4e1f
            </code>
          </div>
          <p className="text-sm text-emerald-500 mt-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Hash matches — Data is intact
          </p>
        </motion.div>

        {/* Modified */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl bg-destructive/10 border border-destructive/30"
        >
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="w-6 h-6 text-destructive" />
            <h4 className="font-semibold text-foreground">Tampered Data</h4>
          </div>
          <div className="p-3 rounded-lg bg-card border border-border mb-3">
            <code className="text-sm font-mono text-foreground">
              {modifiedData.split("").map((char, i) => (
                <span
                  key={i}
                  className={
                    originalData[i] !== char ? "text-destructive font-bold" : ""
                  }
                >
                  {char}
                </span>
              ))}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <code className="text-xs font-mono text-destructive break-all">
              f2e9a1d...7c8b3a
            </code>
          </div>
          <p className="text-sm text-destructive mt-3 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Hash mismatch — Tampering detected!
          </p>
        </motion.div>
      </div>

      {/* Use case */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h4 className="font-semibold text-foreground mb-4">
          Real-World Applications
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground">File Downloads</span>
            <p className="text-muted-foreground text-xs mt-1">
              Verify files weren&apos;t corrupted or modified
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground">
              Blockchain Blocks
            </span>
            <p className="text-muted-foreground text-xs mt-1">
              Each block contains hash of previous block
            </p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <span className="font-medium text-foreground">
              Digital Signatures
            </span>
            <p className="text-muted-foreground text-xs mt-1">
              Sign hash instead of entire document
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
