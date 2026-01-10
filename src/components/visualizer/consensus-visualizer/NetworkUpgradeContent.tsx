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
    </div>
  );}
