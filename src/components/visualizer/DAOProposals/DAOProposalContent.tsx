"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Wallet,
  Coins,
  FileText,
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Eye,
  Rocket,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export type StageType =
  | "overview"
  | "setup"
  | "draft"
  | "feedback"
  | "submit"
  | "vote";

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
    id: "dao-overview",
    title: "ZecHub DAO Proposals",
    subtitle: "Full Process Overview",
    description:
      "A community-driven process for shaping the future of ZecHub — from wallet setup to on-chain voting",
    type: "overview",
    link: "https://zechub.wiki/governance-howto",
    linkText: "Governance Guide",
  },
  {
    id: "dao-setup",
    title: "First Steps",
    subtitle: "Wallet & JUNO Setup",
    description:
      "Install Keplr wallet and acquire JUNO tokens to participate in governance",
    type: "setup",
    link: "https://vote.zechub.xyz",
    linkText: "Visit Voting Portal",
  },
  {
    id: "dao-draft",
    title: "Draft Your Proposal",
    subtitle: "4-Stage Format",
    description:
      "Structure your proposal using the recommended Background to Proposal to Action format",
    type: "draft",
    link: "https://zechub.wiki/governance-howto",
    linkText: "Proposal Guide",
  },
  {
    id: "dao-feedback",
    title: "Get Community Feedback",
    subtitle: "Discord & Sync Meetings",
    description:
      "Share your draft in the ZecHub #proposals Discord channel and join bi-weekly sync meetings",
    type: "feedback",
    link: "https://discord.gg/zcash",
    linkText: "Join Discord",
  },
  {
    id: "dao-submit",
    title: "Submit Your Proposal",
    subtitle: "Go Live on-chain",
    description:
      "Navigate to vote.zechub.xyz and submit your proposal for community voting",
    type: "submit",
    link: "https://vote.zechub.xyz",
    linkText: "Open Voting Portal",
  },
  {
    id: "dao-vote",
    title: "Community Votes",
    subtitle: "DAO Decides",
    description:
      "Your proposal is live — DAO members vote for a minimum of 5 days, then actions execute on-chain",
    type: "vote",
    link: "https://vote.zechub.xyz",
    linkText: "View Live Proposals",
  },
];

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  gold: "#F4B942",
  goldDark: "#C8922A",
  teal: "#1ECEBE",
  purple: "#8B5CF6",
  green: "#22C55E",
  red: "#EF4444",
};

// ─── Slide 1: Overview ────────────────────────────────────────────────────────
const OverviewAnimation = () => {
  const steps = [
    { icon: Wallet, label: "Install Keplr", desc: "Set up wallet", color: C.gold },
    { icon: Coins, label: "Get JUNO", desc: "Acquire tokens", color: C.teal },
    { icon: FileText, label: "Draft Proposal", desc: "Write your idea", color: C.purple },
    { icon: Shield, label: "Vote & Launch", desc: "Community decides", color: C.green },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 150 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="relative rounded-2xl border p-4 md:p-5 text-center overflow-hidden"
              style={{ borderColor: s.color + "33", background: "rgba(255,255,255,0.03)" }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}10, transparent 70%)` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              />
              <div
                className="relative w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: s.color + "1A", border: `1.5px solid ${s.color}55` }}
              >
                <Icon size={20} style={{ color: s.color }} />
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ background: s.color, color: "#000" }}
                >
                  {i + 1}
                </div>
              </div>
              <div className="relative text-xs md:text-sm font-bold mb-1">{s.label}</div>
              <div className="relative text-[11px] md:text-xs text-muted-foreground">{s.desc}</div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex justify-center gap-6 md:gap-10 flex-wrap"
      >
        {[
          { val: "5 Days", label: "Min Voting Period" },
          { val: "DAO", label: "Community Governed" },
          { val: "On-Chain", label: "Transparent Results" },
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-lg md:text-xl font-black" style={{ color: C.gold }}>{stat.val}</div>
            <div className="text-[11px] md:text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// ─── Slide 2: Setup ───────────────────────────────────────────────────────────
const SetupAnimation = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((p) => (p + 1) % 3), 2500);
    return () => clearInterval(t);
  }, []);

  const walletSteps = ["Download Extension", "Create Account", "Connect to DAO"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
      {/* Keplr panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border p-5 relative overflow-hidden"
        style={{ borderColor: C.gold + "33", background: "rgba(255,255,255,0.02)" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 20% 20%, ${C.gold}08, transparent 60%)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: C.gold + "22", border: `1.5px solid ${C.gold}55` }}
          >
            <Wallet size={20} style={{ color: C.gold }} />
          </div>
          <div>
            <div className="text-sm font-bold">Install Keplr</div>
            <div className="text-xs text-muted-foreground">Browser Extension</div>
          </div>
        </div>

        {walletSteps.map((label, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15 }}
            className="flex items-center gap-3 p-2 rounded-lg mb-2"
            style={{
              background: step === i ? C.gold + "15" : "transparent",
              border: `1px solid ${step === i ? C.gold + "44" : "transparent"}`,
            }}
          >
            <motion.div
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: step > i ? C.gold : step === i ? C.gold + "33" : "rgba(255,255,255,0.05)",
                border: `1.5px solid ${step >= i ? C.gold : "rgba(255,255,255,0.1)"}`,
              }}
              animate={{ scale: step === i ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: step === i ? Infinity : 0 }}
            >
              {step > i && <CheckCircle size={10} style={{ color: "#000" }} />}
            </motion.div>
            <span
              className="text-xs"
              style={{ color: step >= i ? "var(--foreground)" : "var(--muted-foreground)" }}
            >
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* JUNO panel */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border p-5 relative overflow-hidden"
        style={{ borderColor: C.teal + "33", background: "rgba(255,255,255,0.02)" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 80% 20%, ${C.teal}08, transparent 60%)` }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: C.teal + "22", border: `1.5px solid ${C.teal}55` }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Coins size={20} style={{ color: C.teal }} />
          </motion.div>
          <div>
            <div className="text-sm font-bold">Acquire JUNO</div>
            <div className="text-xs text-muted-foreground">Governance Token</div>
          </div>
        </div>

        <div
          className="rounded-xl p-3 mb-3 text-xs leading-relaxed text-muted-foreground"
          style={{ background: C.teal + "11", border: `1px solid ${C.teal}33` }}
        >
          <div className="font-semibold mb-1" style={{ color: C.teal }}>Contact Core Team</div>
          Reach out to ZecHub core team members for assistance acquiring JUNO tokens to participate in governance.
        </div>

        <a
          href="https://vote.zechub.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl p-2 text-xs font-semibold no-underline"
          style={{ background: C.teal + "22", border: `1px solid ${C.teal}44`, color: C.teal }}
        >
          <ExternalLink size={12} style={{ color: C.teal }} />
          View Open Proposals
        </a>
      </motion.div>

      {/* Video hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="col-span-1 md:col-span-2 flex justify-center"
      >
        <div
          onClick={() => window.open("https://www.youtube.com/watch?v=fWagokTEx-Y", "_blank")}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full cursor-pointer"
          style={{ background: C.gold + "11", border: `1px solid ${C.gold}33` }}
        >
          <motion.div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: C.gold }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#000">
              <polygon points="2,1 9,5 2,9" />
            </svg>
          </motion.div>
          <span className="text-sm" style={{ color: C.gold }}>
            Watch Video Guide on ZecHub Wiki
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Slide 3: Draft ───────────────────────────────────────────────────────────
const DraftAnimation = () => {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveSection((p) => (p + 1) % 4), 2200);
    return () => clearInterval(t);
  }, []);

  const sections = [
    { label: "Background", color: C.gold, emoji: "\u{1F4DC}", desc: "History of the topic or service" },
    { label: "Why?", color: C.teal, emoji: "\u{1F4A1}", desc: "Driving reason — may use bullet points" },
    { label: "Proposal", color: C.purple, emoji: "\u{1F4CB}", desc: "Full detail of what you are proposing" },
    { label: "Action", color: C.green, emoji: "\u{1F680}", desc: "What happens on a successful vote" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
      {/* Section list */}
      <div className="space-y-2">
        {sections.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            onClick={() => setActiveSection(i)}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
            style={{
              background: activeSection === i ? s.color + "15" : "rgba(255,255,255,0.02)",
              border: `1.5px solid ${activeSection === i ? s.color + "55" : s.color + "20"}`,
            }}
          >
            <span className="text-base md:text-lg">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div
                className="text-xs md:text-sm font-bold"
                style={{ color: activeSection === i ? s.color : "var(--foreground)" }}
              >
                {i + 1}. {s.label}
              </div>
              <div className="text-[11px] md:text-xs text-muted-foreground truncate">{s.desc}</div>
            </div>
            {activeSection === i && (
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: s.color }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Live preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border p-4 md:p-5"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
          <FileText size={12} />
          proposal.md
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: sections[activeSection].color }}>
              ## {sections[activeSection].label}
            </div>
            {[100, 85, 92, 70, 88, 60].map((w, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="h-2 rounded mb-2"
                style={{
                  width: `${w}%`,
                  background: `linear-gradient(90deg, ${sections[activeSection].color}33, ${sections[activeSection].color}11)`,
                  transformOrigin: "left",
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        <div
          className="mt-3 rounded-lg p-2.5"
          style={{ background: C.gold + "11", border: `1px dashed ${C.gold}33` }}
        >
          <span className="text-xs" style={{ color: C.gold }}>
            Formats accepted: .md or .txt
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Slide 4: Feedback ────────────────────────────────────────────────────────
const FEEDBACK_MESSAGES = [
  {
    from: "You",
    text: "Here is my draft proposal for community review...",
    color: C.gold,
    side: "right" as const,
  },
  {
    from: "DAO Member",
    text: "Great structure! Consider adding timeline details",
    color: C.teal,
    side: "left" as const,
  },
  {
    from: "Core Team",
    text: "Join our bi-weekly Sync Meeting to present live",
    color: C.purple,
    side: "left" as const,
  },
  {
    from: "You",
    text: "Updated with feedback — ready to submit!",
    color: C.gold,
    side: "right" as const,
  },
];

const FeedbackAnimation = () => {
  const [msgStep, setMsgStep] = useState(0);

  useEffect(() => {
    if (msgStep >= FEEDBACK_MESSAGES.length - 1) return;
    const t = setTimeout(() => setMsgStep((p) => p + 1), 1800);
    return () => clearTimeout(t);
  }, [msgStep]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
      {/* Discord chat mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: "#1E1F2E", border: `1px solid ${C.purple}33` }}
      >
        <div
          className="px-4 py-2.5 flex items-center gap-2 border-b"
          style={{ background: "#16172A", borderColor: C.purple + "22" }}
        >
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.green }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.gold }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.red }} />
          <span className="ml-2 text-xs text-muted-foreground font-mono"># proposals</span>
        </div>

        <div className="p-3 md:p-4 min-h-[180px] md:min-h-[200px]">
          {FEEDBACK_MESSAGES.slice(0, msgStep + 1).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.side === "right" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex flex-col mb-3 ${msg.side === "right" ? "items-end" : "items-start"}`}
            >
              <div className="text-[10px] font-semibold mb-1" style={{ color: msg.color }}>
                {msg.from}
              </div>
              <div
                className="max-w-[85%] px-3 py-2 text-xs leading-relaxed"
                style={{
                  borderRadius: msg.side === "right" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                  background: msg.color + "18",
                  border: `1px solid ${msg.color}33`,
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {msgStep < FEEDBACK_MESSAGES.length - 1 && (
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-xs text-muted-foreground"
            >
              typing...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Feedback options */}
      <div className="space-y-3">
        {[
          { Icon: MessageSquare, color: C.purple, title: "Discord #proposals", desc: "Post draft for community discussion" },
          { Icon: Users, color: C.teal, title: "Bi-weekly Sync Meeting", desc: "Present in Zcash Global Voice Channel" },
          { Icon: Shield, color: C.gold, title: "DAO Members Help", desc: "Experienced members guide you" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-start gap-3 p-3 md:p-3.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${item.color}33` }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: item.color + "22" }}
            >
              <item.Icon size={16} style={{ color: item.color }} />
            </div>
            <div>
              <div className="text-xs md:text-sm font-bold">{item.title}</div>
              <div className="text-[11px] md:text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── Slide 5: Submit ──────────────────────────────────────────────────────────
const SubmitAnimation = () => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => Math.min(p + 1, 3)), 1500);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: "Navigate to vote.zechub.xyz", color: C.gold },
    { label: "Enter Proposal Name & Description", color: C.teal },
    { label: "Add Actions (Treasury, NFT, etc.)", color: C.purple },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
      {/* Checklist */}
      <div>
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Rocket size={12} />
          Submission Checklist
        </div>

        {steps.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl mb-2.5"
            style={{
              background: phase > i ? s.color + "11" : "rgba(255,255,255,0.02)",
              border: `1px solid ${phase > i ? s.color + "44" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <motion.div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: phase > i ? s.color : s.color + "22",
                border: `1.5px solid ${s.color}55`,
              }}
              animate={{ scale: phase - 1 === i ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.4 }}
            >
              {phase > i ? (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <polyline points="1.5,5 4,7.5 8.5,2.5" />
                </svg>
              ) : (
                <span className="text-[9px] font-black" style={{ color: s.color }}>
                  {i + 1}
                </span>
              )}
            </motion.div>
            <span
              className="text-xs"
              style={{
                color: phase > i ? "var(--foreground)" : "var(--muted-foreground)",
                fontWeight: phase > i ? 600 : 400,
              }}
            >
              {s.label}
            </span>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center gap-2.5 p-3 rounded-xl mt-1"
          style={{ background: C.teal + "11", border: `1px solid ${C.teal}33` }}
        >
          <Clock size={15} style={{ color: C.teal }} />
          <div>
            <div className="text-xs font-bold" style={{ color: C.teal }}>
              Minimum 5-day voting period
            </div>
            <div className="text-[11px] text-muted-foreground">
              Community has time to review and vote
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portal mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${C.gold}33`, background: "rgba(255,255,255,0.02)" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b"
          style={{ background: "rgba(0,0,0,0.3)", borderColor: C.gold + "22" }}
        >
          <div className="flex-1 h-1.5 rounded" style={{ background: C.gold + "22" }} />
          <span className="text-[11px] text-muted-foreground font-mono">vote.zechub.xyz</span>
          <div className="flex-1 h-1.5 rounded" style={{ background: C.gold + "22" }} />
        </div>

        <div className="p-4">
          <div className="text-sm font-bold mb-3">New Proposal</div>

          <div className="mb-3">
            <div className="text-[10px] text-muted-foreground mb-1">Proposal Name</div>
            <div
              className="h-8 rounded-lg flex items-center px-3"
              style={{
                background: "rgba(0,0,0,0.2)",
                border: `1px solid ${phase >= 2 ? C.gold + "88" : C.gold + "33"}`,
              }}
            >
              {phase >= 2 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs"
                >
                  ZecHub Q3 Bounty Program
                </motion.span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="text-[10px] text-muted-foreground mb-1">Description</div>
            <div
              className="h-14 rounded-lg p-2.5"
              style={{ background: "rgba(0,0,0,0.2)", border: `1px solid ${C.gold}33` }}
            >
              {phase >= 2 &&
                [100, 80, 90].map((w, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-1.5 rounded mb-2"
                    style={{
                      width: `${w}%`,
                      background: C.gold + "22",
                      transformOrigin: "left",
                    }}
                  />
                ))}
            </div>
          </div>

          <div
            className="py-2.5 rounded-lg text-center text-sm font-bold"
            style={{
              background:
                phase >= 3
                  ? `linear-gradient(135deg, ${C.gold}, ${C.goldDark})`
                  : C.gold + "22",
              color: phase >= 3 ? "#000" : C.gold,
              border: `1px solid ${C.gold}44`,
            }}
          >
            {phase >= 3 ? "Proposal Ready to Submit" : "Submit Proposal"}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Slide 6: Vote ────────────────────────────────────────────────────────────
const VoteAnimation = () => {
  const [votes, setVotes] = useState({ yes: 0, no: 0, abstain: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const target = { yes: 74, no: 18, abstain: 8 };
      let frame = 0;

      const tick = () => {
        frame++;
        const p = Math.min(frame / 60, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setVotes({
          yes: Math.round(target.yes * e),
          no: Math.round(target.no * e),
          abstain: Math.round(target.abstain * e),
        });
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const bars = [
    { label: "Yes", value: votes.yes, color: C.green },
    { label: "No", value: votes.no, color: C.red },
    { label: "Abstain", value: votes.abstain, color: "var(--muted-foreground)" },
  ];

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border p-4 md:p-5"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="text-sm font-bold mb-1">ZecHub Q3 Bounty Program</div>
        <div className="text-xs text-muted-foreground mb-4">Voting in progress · 3 days remaining</div>

        {bars.map((v) => (
          <div key={v.label} className="mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: v.color }}>{v.label}</span>
              <span className="text-xs font-bold" style={{ color: v.color }}>{v.value}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: v.color + "22" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${v.value}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full rounded-full"
                style={{ background: v.color }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {[
          { Icon: Clock, color: C.teal, title: "5+ Day Window", desc: "Community deliberates" },
          { Icon: Eye, color: C.gold, title: "On-Chain Result", desc: "Permanently recorded" },
          { Icon: Rocket, color: C.green, title: "Actions Execute", desc: "Changes applied" },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.12 }}
            className="rounded-xl border p-3 text-center"
            style={{ borderColor: item.color + "33", background: "rgba(255,255,255,0.02)" }}
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }}
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: item.color + "22" }}
            >
              <item.Icon size={16} style={{ color: item.color }} />
            </motion.div>
            <div className="text-[11px] md:text-xs font-bold">{item.title}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── StageContent ─────────────────────────────────────────────────────────────
interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
}

export const StageContent = ({ stage }: StageContentProps) => {
  const renderContent = () => {
    switch (stage.type) {
      case "overview": return <OverviewAnimation />;
      case "setup": return <SetupAnimation />;
      case "draft": return <DraftAnimation />;
      case "feedback": return <FeedbackAnimation />;
      case "submit": return <SubmitAnimation />;
      case "vote": return <VoteAnimation />;
      default: return null;
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
        className="w-full"
      >
        <div className="text-center mb-6 md:mb-8 px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold mb-2 tracking-widest uppercase"
            style={{ color: C.gold }}
          >
            {stage.subtitle}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-3xl font-black mb-3"
          >
            {stage.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground max-w-xl mx-auto"
          >
            {stage.description}
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto px-3 md:px-4">
          {renderContent()}
        </div>

        {stage.link && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 md:mt-8"
          >
            <a
              href={stage.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-colors no-underline"
              style={{ color: C.gold }}
            >
              <span>{stage.linkText}</span>
              <ArrowRight size={14} />
            </a>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};