"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  FileText,
  Vote,
  Award,
  Globe,
  ArrowRight,
  TrendingUp,
  Coins,
  Users,
  CheckCircle,
  GitBranch,
  DollarSign,
  Target,
  Rocket,
  Sparkles,
  Shield,
} from "lucide-react";
import { useState, useEffect } from "react";

export type StageType = "dev-fund" | "zips" | "voting" | "grants" | "impact";

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
    id: "dev-fund-breakdown",
    title: "The 20% Dev Fund",
    subtitle: "Sustainable Development",
    description: "How block rewards fund the Zcash ecosystem",
    type: "dev-fund",
    link: "https://z.cash/zcash-governance-a-step-toward-decentralization",
    linkText: "Dev Fund Details",
  },
  {
    id: "zip-process",
    title: "Zcash Improvement Proposals",
    subtitle: "Community-Driven Protocol",
    description: "From idea to implementation through ZIPs",
    type: "zips",
    link: "https://zips.z.cash/",
    linkText: "Browse All ZIPs",
  },
  {
    id: "voting-mechanics",
    title: "Community Voting",
    subtitle: "Decentralized Decisions",
    description: "How the community governs Zcash",
    type: "voting",
    link: "https://forum.zcashcommunity.com/",
    linkText: "Join Community Forum",
  },
  {
    id: "grant-programs",
    title: "Grant Programs",
    subtitle: "Funding Innovation",
    description: "Supporting ecosystem growth and development",
    type: "grants",
    link: "https://zcashcommunitygrants.org/",
    linkText: "Apply for Grants",
  },
  {
    id: "ecosystem-impact",
    title: "Governance Impact",
    subtitle: "Real Results",
    description: "How governance shapes Zcash's future",
    type: "impact",
    link: "https://z.cash/zcash-governance-a-step-toward-decentralization",
    linkText: "Governance Evolution",
  },
];

// Dev Fund Animation
const DevFundAnimation = () => {
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistributing(true);
      setTimeout(() => setDistributing(false), 3000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allocations = [
    { name: "ZCG", percent: 8, color: "from-blue-400 to-blue-600", icon: Target },
    { name: "Lockbox", percent: 12, color: "from-purple-400 to-purple-600", icon: Shield },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Block Reward Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        <motion.div
          className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white"
          animate={{
            scale: distributing ? [1, 1.1, 1] : 1,
          }}
        >
          <Coins className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-2" />
          <div className="text-xl md:text-2xl font-bold">3.125 ZEC</div>
          <div className="text-xs md:text-sm opacity-90">Block Reward</div>
        </motion.div>

        <div className="rotate-90 md:rotate-0">
          <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
        </div>

        <div className="flex gap-3 md:gap-4">
          {/* 80% to miners */}
          <motion.div
            className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white text-center"
            animate={{
              scale: distributing ? [1, 1.05, 1] : 1,
            }}
          >
            <div className="text-lg md:text-xl font-bold">80%</div>
            <div className="text-xs">Miners</div>
          </motion.div>

          {/* 20% to dev fund */}
          <motion.div
            className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-center"
            animate={{
              scale: distributing ? [1, 1.1, 1] : 1,
              boxShadow: distributing
                ? "0 0 40px rgba(129, 140, 248, 0.8)"
                : "0 0 20px rgba(129, 140, 248, 0.3)",
            }}
          >
            <div className="text-lg md:text-xl font-bold">20%</div>
            <div className="text-xs">Dev Fund</div>
          </motion.div>
        </div>
      </div>

      {/* Fund Distribution */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {allocations.map((alloc, idx) => {
          const Icon = alloc.icon;
          return (
            <motion.div
              key={alloc.name}
              className={`p-4 md:p-6 rounded-xl bg-gradient-to-br ${alloc.color} text-white text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: distributing ? [1, 1.05, 1] : 1,
              }}
              transition={{ delay: idx * 0.2 }}
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2" />
              <div className="text-xl md:text-2xl font-bold">{alloc.percent}%</div>
              <div className="text-xs md:text-sm opacity-90">{alloc.name}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ZIPs Process Animation
const ZIPsAnimation = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage(prev => (prev + 1) % 5);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { label: "Draft", color: "from-gray-400 to-gray-600", icon: FileText },
    { label: "Review", color: "from-blue-400 to-blue-600", icon: Users },
    { label: "Accepted", color: "from-purple-400 to-purple-600", icon: CheckCircle },
    { label: "Implemented", color: "from-green-400 to-green-600", icon: GitBranch },
    { label: "Deployed", color: "from-yellow-400 to-amber-500", icon: Rocket },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-2">
        {stages.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === stage;
          const isDone = idx < stage;

          return (
            <div key={s.label} className="flex flex-col items-center gap-2 w-[18%] md:w-auto">
              <motion.div
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center relative`}
                animate={{
                  scale: isActive ? [1, 1.2, 1] : 1,
                  opacity: isDone ? 0.5 : 1,
                }}
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl border-4 border-white/50"
                    animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
              <div className="text-[10px] md:text-xs font-medium text-center">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Notable ZIPs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {[
          { num: "1022", name: "Dev Fund Restructure", impact: "Lockbox fund" },
          { num: "255", name: "NU6.1 Deployment", impact: "Consensus upgrade" },
          { num: "312", name: "FROST Integration", impact: "Threshold sigs" },
          { num: "317", name: "Fee Mechanism", impact: "Dynamic fees" },
        ].map((zip, idx) => (
          <motion.div
            key={zip.num}
            className="p-3 md:p-4 rounded-lg bg-card/50 border border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs md:text-sm">
                {zip.num}
              </div>
              <div className="text-sm md:text-base font-semibold">{zip.name}</div>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">{zip.impact}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Voting Animation
const VotingAnimation = () => {
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState({ yes: 45, no: 30, abstain: 25 });

  useEffect(() => {
    const interval = setInterval(() => {
      setVoting(true);
      setTimeout(() => {
        setVotes({
          yes: 45 + Math.floor(Math.random() * 10),
          no: 30 + Math.floor(Math.random() * 10),
          abstain: 25 + Math.floor(Math.random() * 5),
        });
        setVoting(false);
      }, 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Voters */}
      <div className="flex items-center justify-center gap-3 md:gap-8 flex-wrap">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center"
            animate={{
              scale: voting ? [1, 1.2, 1] : 1,
            }}
            transition={{ delay: i * 0.1 }}
          >
            <Vote className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </motion.div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-3 md:space-y-4">
        {[
          { label: "Yes", value: votes.yes, color: "bg-green-500" },
          { label: "No", value: votes.no, color: "bg-red-500" },
          { label: "Abstain", value: votes.abstain, color: "bg-gray-500" },
        ].map((option) => (
          <div key={option.label}>
            <div className="flex justify-between text-xs md:text-sm mb-2">
              <span className="font-medium">{option.label}</span>
              <span className="text-muted-foreground">{option.value}%</span>
            </div>
            <div className="h-3 md:h-4 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${option.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${option.value}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Grants Animation
const GrantsAnimation = () => {
  const [funding, setFunding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFunding(true);
      setTimeout(() => setFunding(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const grants = [
    { name: "Zcash Community Grants", max: "$500K", focus: "Major projects" },
    { name: "ZecHub Bounties", max: "Varies", focus: "Task-based" },
    { name: "Ecosystem Grants", max: "Retroactive", focus: "Impact-driven" },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Funding Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        <motion.div
          className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center"
          animate={{
            scale: funding ? [1, 0.9, 1] : 1,
          }}
        >
          <DollarSign className="w-10 h-10 md:w-12 md:h-12 text-white" />
        </motion.div>

        <motion.div
          className="w-16 h-1 md:w-1 md:h-16 bg-gradient-to-r md:bg-gradient-to-b from-orange-400 to-green-400 rotate-90 md:rotate-0"
          animate={{
            scaleX: funding ? [0, 1] : 0,
            scaleY: funding ? [0, 1] : 0,
          }}
          style={{ transformOrigin: "top" }}
        />

        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
              animate={{
                scale: funding ? [0.8, 1] : 0.8,
                opacity: funding ? [0, 1] : 0,
              }}
              transition={{ delay: i * 0.2 }}
            >
              <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grant Programs */}
      <div className="space-y-3">
        {grants.map((grant, idx) => (
          <motion.div
            key={grant.name}
            className="p-3 md:p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="text-sm md:text-base font-semibold">{grant.name}</div>
              <div className="text-xs md:text-sm text-indigo-400 font-bold">{grant.max}</div>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">{grant.focus}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Impact Animation
const ImpactAnimation = () => {
  const [growing, setGrowing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrowing(true);
      setTimeout(() => setGrowing(false), 2000);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const milestones = [
    { year: "2016", event: "Launch", icon: Rocket },
    { year: "2022", event: "NU5 (Orchard)", icon: Sparkles },
    { year: "2025", event: "NU6.1 (Fund Restructure)", icon: GitBranch },
    { year: "2026", event: "ECC Resignation & NU7", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 md:w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500" />
        <div className="space-y-6 md:space-y-8">
          {milestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.year}
                className="flex items-center gap-3 md:gap-4"
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                {idx % 2 === 0 ? (
                  <>
                    <div className="flex-1 text-right pr-2">
                      <div className="text-sm md:text-base font-semibold">{m.event}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{m.year}</div>
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center relative z-10 shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1" />
                  </>
                ) : (
                  <>
                    <div className="flex-1" />
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative z-10 shrink-0">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 pl-2">
                      <div className="text-sm md:text-base font-semibold">{m.event}</div>
                      <div className="text-xs md:text-sm text-muted-foreground">{m.year}</div>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[
          { value: "60+", label: "ZIPs Deployed" },
          { value: "$5B+", label: "Ecosystem Value" },
          { value: "10 Years", label: "Governance" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            className="p-3 md:p-4 rounded-lg bg-card/50 border border-border text-center"
            animate={{
              scale: growing ? [1, 1.05, 1] : 1,
            }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
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
      case "dev-fund":
        return <DevFundAnimation />;
      case "zips":
        return <ZIPsAnimation />;
      case "voting":
        return <VotingAnimation />;
      case "grants":
        return <GrantsAnimation />;
      case "impact":
        return <ImpactAnimation />;
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
        className="w-full min-h-[400px] md:min-h-[500px]"
      >
        <div className="text-center mb-8 md:mb-12 px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs md:text-sm text-indigo-400 font-medium mb-2"
          >
            {stage.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4"
          >
            {stage.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
          >
            {stage.description}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto px-4">{renderContent()}</div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 md:mt-12"
        >
          <a
            href={stage.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm md:text-base text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>{stage.linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};