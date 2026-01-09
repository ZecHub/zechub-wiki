import { motion } from "framer-motion"
import { Shield } from "lucide-react"

export const SproutKeyContent = () => {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-xl bg-muted/50 border border-border"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-muted">
              <Shield className="w-6 h-6 text-muted-foreground" />
            </div>

            <div>
              <h4 className="font-semibold text-foreground">Sprout Protocol</h4>
              <p className="text-sm text-muted-foreground">
                First shielded protocol (2016) - Now deprecated
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h5 className="font-medium text-foreground mb-2">
                Address Format
              </h5>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-sm font-mono">
                  zc...
                </code>
                <span className="text-sm text-muted-foreground">
                  (95 characters)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-card border border-border">
              <h5 className="font-medium text-foreground mb-2">
                Key Components
              </h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-foreground">
                      Spending Key (a_sk)
                    </strong>{" "}
                    — 256-bit random secret
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-foreground">
                      Paying Key (a_pk)
                    </strong>{" "}
                    — Derived from spending key
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span>
                    <strong className="text-foreground">
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
