import { motion } from "framer-motion";
import { ArrowUpCircle, Lock } from "lucide-react";

export const NetworkUpgradeContent = () => {
  const upgrades = [
    { name: 'Sprout', year: '2016', desc: 'Original shielded protocol' },
    { name: 'Overwinter', year: '2018', desc: 'Transaction format improvements' },
    { name: 'Sapling', year: '2018', desc: 'Efficient shielded transactions' },
    { name: 'Blossom', year: '2019', desc: 'Faster block times' },
    { name: 'Heartwood', year: '2020', desc: 'Shielded coinbase' },
    { name: 'Canopy', year: '2020', desc: 'Dev fund, deprecate Sprout' },
    { name: 'NU5 (Orchard)', year: '2022', desc: 'Unified addresses, new proofs' },
  ];

  return (
    <div className="space-y-8">
      {/* Zcash approach */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-pool-orchard/10 border border-primary/30"
      >
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <ArrowUpCircle className="w-5 h-5 text-primary" />
          Zcash Network Upgrades
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Zcash uses{" "}
          <strong className="text-foreground">
            planned, coordinated hard forks
          </strong>{" "}
          called &quot;Network Upgrades&quot;. Unlike contentious forks, these
          are agreed upon by the community with activation heights announced in
          advance.
        </p>
        <div className="flex items-center gap-4 p-3 rounded-lg bg-card">
          <Lock className="w-5 h-5 text-primary" />
          <span className="text-sm text-muted-foreground">
            Activation height set → Nodes upgrade → Network transitions smoothly
          </span>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-xl bg-card border border-border"
      >
        <h4 className="font-semibold text-foreground mb-4">
          Zcash Upgrade History
        </h4>
        <div className="space-y-2">
          {upgrades.map((upgrade, index) => (
            <motion.div
              key={upgrade.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs text-muted-foreground w-12">
                {upgrade.year}
              </span>
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-medium text-foreground text-sm flex-1">
                {upgrade.name}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {upgrade.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Key difference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30"
      >
        <p className="text-sm text-center text-muted-foreground">
          <strong className="text-foreground">Key Difference:</strong> Network
          upgrades are
          <em className="text-emerald-500"> planned collaborations</em>, not
          contentious splits. The community agrees, sets a date, and everyone
          upgrades together.
        </p>
      </motion.div>
    </div>
  );}
