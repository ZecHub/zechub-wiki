import { motion } from "framer-motion";
import { ExternalLink, Globe, Info, Monitor, Smartphone } from "lucide-react";

export const ResourcesSlide = () => {
  return (
    <div className="space-y-12">
      {/* Central info card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="inline-flex p-4 rounded-full bg-primary/20 mb-6"
          >
            <Info className="w-8 h-8 text-primary" />
          </motion.div>

          <h3 className="text-2xl font-bold text-foreground mb-4">
            Explore All Zcash Wallets
          </h3>

          <p className="text-muted-foreground mb-6">
            For a complete and up-to-date list of all Zcash wallets with
            detailed comparisons, features, and download links, visit the ZecHub
            Wiki.
          </p>

          <motion.a
            href="https://zechub.wiki/wallets"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <Globe className="w-5 h-5" />
            Visit zechub.wiki/wallets
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </motion.div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          {
            icon: Smartphone,
            label: "Mobile Wallets",
            desc: "iOS & Android apps",
          },
          {
            icon: Monitor,
            label: "Desktop Wallets",
            desc: "Windows, Mac, Linux",
          },
          { icon: Globe, label: "Web Wallets", desc: "Browser-based access" },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="p-4 rounded-xl bg-card/30 border border-border/30 text-center my-6"
          >
            <item.icon className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <h4 className="font-medium text-foreground text-sm">
              {item.label}
            </h4>
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
