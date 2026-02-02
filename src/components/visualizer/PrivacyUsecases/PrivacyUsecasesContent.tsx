"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Globe,
  Truck,
  Users,
  AlertTriangle,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  DollarSign,
  MapPin,
  Package,
  User,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

export type StageType = "donations" | "remittances" | "supply-chain" | "activism" | "risk-comparison";

export interface Stage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: StageType;
  link: string;
  linkText: string;
}

export const STAGES: Stage[] = [
  {
    id: "donations-scenario",
    title: "Private Donations",
    subtitle: "Anonymous Giving",
    description: "Support causes without revealing your identity",
    type: "donations",
    link: "https://z.cash/learn/how-to-use-zcash",
    linkText: "Privacy Use Cases",
  },
  {
    id: "remittances-flow",
    title: "Cross-Border Remittances",
    subtitle: "Global Payments",
    description: "Send money internationally with privacy and low fees",
    type: "remittances",
    link: "https://z.cash/learn/how-to-use-zcash",
    linkText: "Remittances Guide",
  },
  {
    id: "supply-chain",
    title: "Shielded Supply Chains",
    subtitle: "Business Privacy",
    description: "Track goods without exposing sensitive business data",
    type: "supply-chain",
    link: "",
    linkText: "",
  },
  {
    id: "activism-payments",
    title: "Activism & Freelance",
    subtitle: "Protected Payments",
    description: "Compensate activists and freelancers anonymously",
    type: "activism",
    link: "https://z.cash/learn/why-is-privacy-so-important",
    linkText: "Privacy for Activists",
  },
  {
    id: "risk-comparison",
    title: "Privacy Risk Comparison",
    subtitle: "Transparent vs Shielded",
    description: "See how Zcash protects against chain analysis",
    type: "risk-comparison",
    link: "https://zcash.readthedocs.io/en/latest/rtd_pages/privacy_recommendations_best_practices.html",
    linkText: "Privacy Guide",
  },
];

// Donations Animation
const DonationsAnimation = () => {
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDonating(true);
      setTimeout(() => setDonating(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-12">
        {/* Donor */}
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4"
            animate={{
              scale: donating ? [1, 0.9, 1] : 1,
            }}
          >
            <User className="w-12 h-12 text-white" />
            <motion.div
              className="absolute -inset-2 rounded-full border-2 border-yellow-400"
              animate={{
                scale: donating ? [1, 1.5] : 1,
                opacity: donating ? [1, 0] : 0,
              }}
              transition={{ duration: 1 }}
            />
          </motion.div>
          <div className="text-sm text-muted-foreground">Anonymous Donor</div>
        </div>

        {/* Shielded Transaction */}
        <div className="relative">
          <motion.div
            className="absolute left-0 w-32 h-1 bg-gradient-to-r from-yellow-400 to-green-400"
            animate={{
              scaleX: donating ? [0, 1] : 0,
            }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 1 }}
          />
          <Shield className="w-12 h-12 text-green-400 relative z-10" />
          <motion.div
            className="absolute -inset-4 rounded-full border-2 border-green-400"
            animate={{
              scale: donating ? [1, 1.3, 1] : 1,
              opacity: donating ? [0, 1, 0] : 0,
            }}
            transition={{ duration: 2, repeat: donating ? Infinity : 0 }}
          />
        </div>

        {/* Recipient */}
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4"
            animate={{
              scale: donating ? [1, 1.1, 1] : 1,
            }}
          >
            <Gift className="w-12 h-12 text-white" />
          </motion.div>
          <div className="text-sm text-muted-foreground">Charity/NGO</div>
        </div>
      </div>

      {/* Privacy Features */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: EyeOff, label: "Hidden Amount", color: "text-green-400" },
          { icon: User, label: "Anonymous Sender", color: "text-yellow-400" },
          { icon: Shield, label: "Protected Metadata", color: "text-blue-400" },
        ].map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.label}
              className="p-4 rounded-lg bg-card/50 border border-border text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <Icon className={`w-6 h-6 ${feature.color} mx-auto mb-2`} />
              <div className="text-sm font-medium">{feature.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Remittances Animation
const RemittancesAnimation = () => {
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSending(true);
      setTimeout(() => setSending(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {/* Sender Country */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ scale: sending ? [1, 0.95, 1] : 1 }}
        >
          <div className="relative">
            <MapPin className="w-16 h-16 text-blue-400" />
            <DollarSign className="absolute -top-2 -right-2 w-6 h-6 text-green-400" />
          </div>
          <div className="text-center">
            <div className="font-semibold">United States</div>
            <div className="text-sm text-muted-foreground">Sender</div>
          </div>
        </motion.div>

        {/* Transaction Flow */}
        <div className="flex-1 relative mx-8">
          <motion.div
            className="h-2 bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 rounded-full"
            animate={{
              opacity: sending ? [0.3, 1, 0.3] : 0.3,
            }}
          />
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-400 flex items-center justify-center"
            animate={{
              left: sending ? ["0%", "100%"] : "0%",
            }}
            transition={{ duration: 2 }}
          >
            <Lock className="w-4 h-4 text-white" />
          </motion.div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-green-400 whitespace-nowrap">
            Shielded Transaction
          </div>
        </div>

        {/* Receiver Country */}
        <motion.div
          className="flex flex-col items-center gap-4"
          animate={{ scale: sending ? [1, 1.05, 1] : 1 }}
        >
          <div className="relative">
            <MapPin className="w-16 h-16 text-purple-400" />
            <DollarSign className="absolute -top-2 -right-2 w-6 h-6 text-green-400" />
          </div>
          <div className="text-center">
            <div className="font-semibold">Philippines</div>
            <div className="text-sm text-muted-foreground">Receiver</div>
          </div>
        </motion.div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="font-semibold text-red-400 mb-2">Traditional</div>
          <div className="text-sm space-y-1">
            <div>• 5-10% fees</div>
            <div>• 2-5 days</div>
            <div>• Full tracking</div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="font-semibold text-green-400 mb-2">Zcash</div>
          <div className="text-sm space-y-1">
            <div>• ~$0.01 fees</div>
            <div>• ~75 seconds</div>
            <div>• Full privacy</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Supply Chain Animation
const SupplyChainAnimation = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { icon: Package, label: "Manufacturer", color: "from-blue-400 to-blue-600" },
    { icon: Truck, label: "Distributor", color: "from-purple-400 to-purple-600" },
    { icon: Package, label: "Warehouse", color: "from-green-400 to-green-600" },
    { icon: Users, label: "Retailer", color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        {stages.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === stage;
          const isPast = idx < stage;

          return (
            <div key={s.label} className="flex flex-col items-center">
              <motion.div
                className={`w-20 h-20 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center relative mb-2`}
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                  opacity: isPast ? 0.5 : 1,
                }}
              >
                <Icon className="w-10 h-10 text-white" />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-4 border-white/50"
                    animate={{ scale: [1, 1.2], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <Shield className="absolute -top-2 -right-2 w-6 h-6 text-green-400" />
              </motion.div>
              <div className="text-sm font-medium text-center">{s.label}</div>
              <motion.div
                className="text-xs text-green-400"
                animate={{ opacity: isActive ? 1 : 0 }}
              >
                Verifying...
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="p-6 rounded-xl bg-card/50 border border-border">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-green-400" />
          Privacy Features
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <EyeOff className="w-4 h-4 text-green-400 mt-1" />
            <div>
              <div className="font-medium">Hidden Volumes</div>
              <div className="text-muted-foreground">Protect trade secrets</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-400 mt-1" />
            <div>
              <div className="font-medium">Encrypted Memos</div>
              <div className="text-muted-foreground">Private documentation</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-purple-400 mt-1" />
            <div>
              <div className="font-medium">Selective Disclosure</div>
              <div className="text-muted-foreground">Audit when needed</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-orange-400 mt-1" />
            <div>
              <div className="font-medium">Verifiable Track</div>
              <div className="text-muted-foreground">Prove authenticity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activism Animation
const ActivismAnimation = () => {
  const [protecting, setProtecting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProtecting(true);
      setTimeout(() => setProtecting(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-12">
        {/* Payer */}
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-4"
            animate={{
              boxShadow: protecting
                ? "0 0 40px rgba(167, 139, 250, 0.8)"
                : "0 0 20px rgba(167, 139, 250, 0.3)",
            }}
          >
            <Users className="w-12 h-12 text-white" />
          </motion.div>
          <div className="text-sm text-muted-foreground">Organization</div>
        </div>

        {/* Privacy Shield */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: protecting ? [0, 360] : 0,
              scale: protecting ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 2 }}
          >
            <Shield className="w-16 h-16 text-green-400" />
          </motion.div>
          {protecting && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-green-400"
                  initial={{ scale: 0, x: "-50%", y: "-50%" }}
                  animate={{
                    scale: [0, 1, 0],
                    x: ["-50%", `${Math.cos((i * Math.PI) / 2) * 60 - 50}%`],
                    y: ["-50%", `${Math.sin((i * Math.PI) / 2) * 60 - 50}%`],
                  }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                />
              ))}
            </>
          )}
        </div>

        {/* Recipient */}
        <div className="text-center">
          <motion.div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4"
            animate={{
              scale: protecting ? [1, 1.1, 1] : 1,
            }}
          >
            <User className="w-12 h-12 text-white" />
          </motion.div>
          <div className="text-sm text-muted-foreground">Activist/Freelancer</div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Journalists", icon: Users, color: "purple" },
          { label: "Whistleblowers", icon: Shield, color: "blue" },
          { label: "Human Rights", icon: Heart, color: "pink" },
          { label: "Freelancers", icon: User, color: "green" },
        ].map((use, idx) => {
          const Icon = use.icon;
          return (
            <motion.div
              key={use.label}
              className={`p-3 rounded-lg bg-${use.color}-500/10 border border-${use.color}-500/30 text-center`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Icon className={`w-6 h-6 text-${use.color}-400 mx-auto mb-1`} />
              <div className="text-xs font-medium">{use.label}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Risk Comparison Animation
const RiskComparisonAnimation = () => {
  const [tracing, setTracing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTracing(true);
      setTimeout(() => setTracing(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        {/* Transparent Chain */}
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-red-400" />
            <h4 className="font-semibold text-red-400">Transparent Chain</h4>
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center px-3 text-sm"
                animate={{
                  borderColor: tracing ? "rgb(239, 68, 68)" : "rgba(239, 68, 68, 0.4)",
                  backgroundColor: tracing ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)",
                }}
                transition={{ delay: i * 0.3 }}
              >
                Transaction #{i + 1}
                {tracing && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-red-400"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-xs text-red-400">
            ⚠️ Fully traceable
          </div>
        </div>

        {/* Shielded Chain */}
        <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-2 mb-4">
            <EyeOff className="w-5 h-5 text-green-400" />
            <h4 className="font-semibold text-green-400">Shielded Pool</h4>
          </div>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="h-10 rounded-lg bg-green-500/20 border border-green-500/40 flex items-center px-3 text-sm relative overflow-hidden"
              >
                <Lock className="w-4 h-4 text-green-400 mr-2" />
                Hidden Transaction
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
                  animate={{
                    x: tracing ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 text-xs text-green-400">
            ✓ Fully private
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-card/50 border border-border text-center">
          <div className="text-2xl font-bold text-green-400">&gt;5M ZEC</div>
          <div className="text-sm text-muted-foreground">Orchard Pool</div>
        </div>
        <div className="p-4 rounded-lg bg-card/50 border border-border text-center">
          <div className="text-2xl font-bold text-blue-400">zk-SNARKs</div>
          <div className="text-sm text-muted-foreground">Cryptographic Proof</div>
        </div>
        <div className="p-4 rounded-lg bg-card/50 border border-border text-center">
          <div className="text-2xl font-bold text-purple-400">100%</div>
          <div className="text-sm text-muted-foreground">Privacy Guarantee</div>
        </div>
      </div>
    </div>
  );
};

// Main Content Component
interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
}

export const StageContent = ({ stage, isAnimating }: StageContentProps) => {
  const renderContent = () => {
    switch (stage.type) {
      case "donations":
        return <DonationsAnimation />;
      case "remittances":
        return <RemittancesAnimation />;
      case "supply-chain":
        return <SupplyChainAnimation />;
      case "activism":
        return <ActivismAnimation />;
      case "risk-comparison":
        return <RiskComparisonAnimation />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full min-h-[500px]"
      >
        {/* Stage Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-green-400 font-medium mb-2"
          >
            {stage.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            {stage.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            {stage.description}
          </motion.p>
        </div>

        {/* Animated Content */}
        <div className="max-w-4xl mx-auto">{renderContent()}</div>

        {/* Learn More Link */}
        {stage.link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <a
              href={stage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <span>{stage.linkText}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};