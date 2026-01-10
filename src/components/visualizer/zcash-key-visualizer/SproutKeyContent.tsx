import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export const SproutKeyContent = () => {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl dark:bg-muted/50 bg-muted/10 dark:border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <Shield className="w-6 h-6 text-muted-foreground bg-poo" />
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Sprout Protocol</h4>
              <p className="text-sm dark:text-muted-foreground text-muted-foreground/90">
                First shielded protocol (2016) - Now deprecated
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg dark:bg-card/90 bg-card/70 border border-border">
              <h5 className="font-medium dark:text-foreground text-slate-200 mb-2">
                Address Format
              </h5>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded dark:bg-muted bg-slate-800 text-sm font-mono text-primary/80">
                  zcU1Cd6zYyzcsAPN4XZ7pxbZCd2VJF...9wphfNsTfuiGN1jQoVN4kGxUR4gux9s
                </code>
                <span className="text-sm text-muted-foreground">
                  (95 characters)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg dark:bg-card/90 bg-card/70 border border-border">
              <h5 className="font-medium dark:text-foreground text-slate-200 mb-2">
                Key Components
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-slate-300">
                      Spending Key (a_sk)
                    </strong>{" "}
                    — 256-bit random secret
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-slate-300">
                      Paying Key (a_pk)
                    </strong>{" "}
                    — Derived from spending key
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-slate-300">
                      Receiving Key (pk_enc)
                    </strong>{" "}
                    — For receiving funds
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive flex items-center gap-2">
                <span>⚠️</span>
                <span>
                  Sprout is deprecated. Funds should be migrated to Sapling or
                  Orchard.
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
}
