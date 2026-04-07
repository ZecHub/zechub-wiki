"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Shield, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle,
  AlertTriangle, Database, Radio, Key, Cpu, GitBranch, X,
  Activity, Binary, Fingerprint, Link2, Hash,
  ShieldCheck, Layers, FileCode2, Network, ChevronDown, Info,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Pool = "transparent" | "sapling" | "orchard";

export interface StageConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}

export const STAGES: StageConfig[] = [
  {
    id: "overview",
    title: "Transaction Overview",
    subtitle: "Step 1 — What is a Shielded TX?",
    description: "A Zcash shielded transaction is a sealed envelope. The network verifies it's valid — but can't read sender, recipient, or amount.",
    icon: Layers,
  },
  {
    id: "the-note",
    title: "The Note",
    subtitle: "Step 2 — Encrypted Value Container",
    description: "A note is Zcash's private equivalent of a Bitcoin UTXO — an encrypted record carrying value, recipient, and randomness.",
    icon: FileCode2,
  },
  {
    id: "spend-description",
    title: "Spend Description",
    subtitle: "Step 3 — Nullifier & Proof",
    description: "To spend a note, the wallet creates a Spend Description — proving ownership and marking the note as used without revealing which note it is.",
    icon: Fingerprint,
  },
  {
    id: "output-description",
    title: "Output Description",
    subtitle: "Step 4 — New Note Commitment",
    description: "An Output Description creates a new encrypted note for the recipient — publishing only a commitment, never the amount or address.",
    icon: Database,
  },
  {
    id: "pedersen",
    title: "Pedersen Commitment",
    subtitle: "Step 5 — Balance Without Revealing",
    description: "Homomorphic Pedersen Commitments let the network verify inputs = outputs + fee — without seeing any individual amounts.",
    icon: Binary,
  },
  {
    id: "zk-proof",
    title: "Zero-Knowledge Proof",
    subtitle: "Step 6 — Cryptographic Circuit",
    description: "The Orchard Action circuit (Halo 2) proves validity of every claim simultaneously — without disclosing any private inputs.",
    icon: ShieldCheck,
  },
  {
    id: "binding-signature",
    title: "Binding Signature",
    subtitle: "Step 7 — Sealing the Balance",
    description: "The Binding Signature uses the homomorphic property to prove amounts balance — and prevents any post-proof tampering.",
    icon: Link2,
  },
  {
    id: "builder",
    title: "Build Your Transaction",
    subtitle: "Step 8 — Interactive Builder",
    description: "Choose your pools, set amount and memo, and see your privacy score and fee estimate update in real time.",
    icon: Network,
  },
];

// ─── Pool metadata ────────────────────────────────────────────────────────────

export const POOL_META: Record<Pool, {
  label: string; tag: string;
  color: string; borderColor: string; bg: string; glow: string;
  privacy: number; desc: string;
}> = {
  transparent: {
    label: "Transparent",
    tag: "t-addr",
    color: "text-red-400",
    borderColor: "border-red-500/40",
    bg: "bg-red-500/10",
    glow: "rgba(248,113,113,0.15)",
    privacy: 0,
    desc: "Fully public. Anyone can see amounts, addresses, history.",
  },
  sapling: {
    label: "Sapling",
    tag: "zs-addr",
    color: "text-amber-400",
    borderColor: "border-amber-500/40",
    bg: "bg-amber-500/10",
    glow: "rgba(251,191,36,0.15)",
    privacy: 70,
    desc: "Shielded via Groth16 zk-SNARKs. Amounts & memos encrypted.",
  },
  orchard: {
    label: "Orchard",
    tag: "u-addr",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    glow: "rgba(52,211,153,0.15)",
    privacy: 100,
    desc: "Maximum privacy via Halo2 proofs. No trusted setup.",
  },
};

// ─── ZIP 317 fee calculation ──────────────────────────────────────────────────

export function calculateZip317Fee(
  transparentInputs = 0,
  transparentOutputs = 0,
  shieldedActions = 1
): number {
  const baseFee = 10000;
  const marginalFee = 10000;
  const logicalActions = 1 + transparentInputs + transparentOutputs + shieldedActions;
  return baseFee + marginalFee * Math.max(0, logicalActions - 1);
}

// ─── Live ZEC price hook ──────────────────────────────────────────────────────

export function useZecPrice() {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    let cancelled = false;
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=zcash&vs_currencies=usd",
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!cancelled && data?.zcash?.usd) setPrice(data.zcash.usd);
      } catch { /* silently fail */ }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);
  return price;
}

// ─── Animated hex stream ──────────────────────────────────────────────────────

const HexRow = ({ delay, colorClass }: { delay: number; colorClass: string }) => {
  const [hex, setHex] = useState(() =>
    Array.from({ length: 56 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  );
  useEffect(() => {
    const t = setInterval(() => {
      setHex(Array.from({ length: 56 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    }, 800 + delay * 180);
    return () => clearInterval(t);
  }, [delay]);
  return (
    <motion.div
      animate={{ opacity: [0.2, 0.65, 0.2] }}
      transition={{ duration: 3, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`font-mono text-[9px] sm:text-[10px] leading-relaxed break-all tracking-wider ${colorClass}`}
    >
      {hex}
    </motion.div>
  );
};

// ─── Broadcast Modal ──────────────────────────────────────────────────────────

export const BroadcastModal = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<"broadcasting" | "confirmed">("broadcasting");
  useEffect(() => {
    const t = setTimeout(() => setPhase("confirmed"), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(16px)", background: "rgba(0,0,0,0.8)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.82, opacity: 0, y: 32 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(150deg,#0d1a12 0%,#0a1a0f 60%,#091209 100%)",
            border: "1px solid rgba(52,211,153,0.22)",
            boxShadow: "0 0 80px rgba(52,211,153,0.1),0 0 160px rgba(52,211,153,0.05),inset 0 0 60px rgba(52,211,153,0.03)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(52,211,153,0.7),transparent)" }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors hover:bg-white/10"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <X className="w-4 h-4 text-zinc-400" />
          </button>

          <div className="p-8 flex flex-col items-center text-center gap-5">
            <div className="relative w-20 h-20">
              {phase === "broadcasting" && [0, 1, 2].map((i) => (
                <motion.div key={i}
                  className="absolute inset-0 rounded-full border border-blue-400/25"
                  animate={{ scale: [1, 2.4 + i * 0.35], opacity: [0.7, 0] }}
                  transition={{ duration: 1.9, delay: i * 0.55, repeat: Infinity, ease: "easeOut" }} />
              ))}
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: phase === "confirmed"
                    ? "radial-gradient(circle,rgba(52,211,153,0.25) 0%,rgba(52,211,153,0.04) 100%)"
                    : "radial-gradient(circle,rgba(59,130,246,0.25) 0%,rgba(59,130,246,0.04) 100%)",
                  border: phase === "confirmed" ? "1.5px solid rgba(52,211,153,0.5)" : "1.5px solid rgba(59,130,246,0.5)",
                  transition: "all 0.7s ease",
                }}>
                <AnimatePresence mode="wait">
                  {phase === "broadcasting" ? (
                    <motion.div key="spin"
                      initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.4 }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}>
                        <Activity className="w-8 h-8 text-blue-400" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div key="check"
                      initial={{ opacity: 0, scale: 0.2, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}>
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {phase === "broadcasting" ? (
                <motion.div key="bt" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
                  <p className="text-base font-bold text-blue-300">Broadcasting…</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">Submitting your shielded transaction to the Zcash network</p>
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        animate={{ opacity: [0.25, 1, 0.25] }}
                        transition={{ duration: 1.3, delay: i * 0.3, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="ct" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <p className="text-base font-bold text-emerald-300">Transaction Simulated!</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    In a real Zcash wallet, this would broadcast to the network with your privacy settings.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase === "confirmed" && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="w-full px-4 py-3 rounded-xl text-center"
                  style={{ background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.18)" }}>
                  <p className="text-[9px] text-zinc-500 mb-1 uppercase tracking-widest">Simulated TXID</p>
                  <p className="font-mono text-[10px] text-emerald-400 break-all">a3f9c2e1d847b36f…b7d40c88</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase === "confirmed" && (
                <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg,rgba(52,211,153,0.22) 0%,rgba(16,185,129,0.16) 100%)",
                    border: "1px solid rgba(52,211,153,0.38)", color: "#34d399",
                  }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  Done ✓
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1: Overview  — FULLY REBUILT for mobile + desktop + interactivity
// ─────────────────────────────────────────────────────────────────────────────

type DetailKey = "spend" | "output" | "binding" | null;

export const OverviewStage = () => {
  const [activeDetail, setActiveDetail] = useState<DetailKey>(null);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [animStep, setAnimStep] = useState(0);

  // Auto-walk through the flow on mount
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimStep(1), 400),
      setTimeout(() => setAnimStep(2), 900),
      setTimeout(() => setAnimStep(3), 1400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const details: Record<NonNullable<DetailKey>, { title: string; body: string; color: string; borderColor: string; bgColor: string }> = {
    spend: {
      title: "Spend Description",
      body: "Consumes an existing encrypted note. Reveals only a nullifier — a unique tag that marks the note as spent — without revealing which note, who owns it, or how much it holds.",
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
    },
    output: {
      title: "Output Description",
      body: "Creates a new encrypted note for the recipient. Publishes only a note commitment — a cryptographic fingerprint — without revealing the recipient address or amount.",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/5",
    },
    binding: {
      title: "Binding Signature",
      body: "Uses the homomorphic property of Pedersen commitments to prove inputs − outputs = fee, guaranteeing no ZEC is created or destroyed, without revealing any individual amounts.",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
    },
  };

  const txRows: { key: NonNullable<DetailKey>; dot: string; label: string; hoverBorder: string }[] = [
    { key: "spend",   dot: "bg-red-400",     label: "Spend Description",  hoverBorder: "hover:border-red-500/40" },
    { key: "output",  dot: "bg-emerald-400", label: "Output Description", hoverBorder: "hover:border-emerald-500/40" },
    { key: "binding", dot: "bg-blue-400",    label: "Binding Signature",  hoverBorder: "hover:border-blue-500/40" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        A Zcash shielded transaction is a <span className="text-white font-medium">sealed envelope</span>. The network can verify it's valid — but can't read the sender, recipient, or amount.
      </motion.p>

      {/* ── Envelope / flow diagram ── */}
      <div className="flex flex-col items-center gap-4">

        {/* Row 1: Input pills → arrow → TX box */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3 sm:gap-4">

          {/* Input pills — stack vertically always, clean + compact */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: animStep >= 1 ? 1 : 0, x: animStep >= 1 ? 0 : -16 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto"
          >
            {[
              { label: "Nullifier",    color: "text-red-400",     border: "border-red-500/25",     bg: "bg-red-500/6" },
              { label: "Note",         color: "text-emerald-400", border: "border-emerald-500/25", bg: "bg-emerald-500/6" },
              { label: "Pedersen cm", color: "text-blue-400",    border: "border-blue-500/25",    bg: "bg-blue-500/6" },
            ].map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: animStep >= 1 ? 1 : 0, scale: animStep >= 1 ? 1 : 0.88 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-xl border text-xs font-semibold text-center sm:text-left whitespace-nowrap ${p.color} ${p.border} ${p.bg}`}
              >
                {p.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Animated arrow */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: animStep >= 2 ? 1 : 0, scaleX: animStep >= 2 ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="hidden sm:flex flex-col items-center gap-1 flex-shrink-0"
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5 text-zinc-500" />
            </motion.div>
          </motion.div>

          {/* Mobile down-arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: animStep >= 2 ? 1 : 0 }}
            className="flex sm:hidden"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-zinc-600" />
            </motion.div>
          </motion.div>

          {/* TX box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: animStep >= 2 ? 1 : 0, scale: animStep >= 2 ? 1 : 0.93 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex-1 w-full"
            style={{
              border: "1.5px solid rgba(244,183,40,0.4)",
              borderRadius: 14,
              padding: "14px 16px",
              background: "linear-gradient(135deg, rgba(244,183,40,0.04) 0%, rgba(244,183,40,0.01) 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Transaction</p>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
              />
            </div>
            <div className="space-y-2">
              {txRows.map((r, i) => (
                <motion.button
                  key={r.key}
                  onClick={() => setActiveDetail(activeDetail === r.key ? null : r.key)}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: animStep >= 2 ? 1 : 0, x: animStep >= 2 ? 0 : 8 }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  whileHover={{ x: 3, transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-all border
                    ${activeDetail === r.key
                      ? "bg-zinc-800/80 border-zinc-600 text-zinc-100 shadow-lg"
                      : `bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 ${r.hoverBorder}`
                    }`}
                >
                  <motion.span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`}
                    animate={activeDetail === r.key ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, repeat: activeDetail === r.key ? Infinity : 0 }}
                  />
                  {r.label}
                  <motion.div
                    className="ml-auto"
                    animate={{ rotate: activeDetail === r.key ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ChevronDown className="w-3 h-3 text-zinc-600" />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Equals + Valid badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: animStep >= 3 ? 1 : 0, scale: animStep >= 3 ? 1 : 0.85 }}
            transition={{ duration: 0.45, type: "spring", stiffness: 180 }}
            className="flex sm:flex-col items-center gap-3 flex-shrink-0"
          >
            <span className="text-xl text-zinc-600 font-light hidden sm:block">=</span>
            <ArrowRight className="w-4 h-4 text-zinc-600 block sm:hidden" />
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(52,211,153,0)",
                  "0 0 22px rgba(52,211,153,0.28)",
                  "0 0 0px rgba(52,211,153,0)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="px-4 py-3 rounded-xl border border-emerald-500/35 bg-emerald-500/8 text-center"
            >
              <p className="text-xs font-bold text-emerald-400">✓ Valid</p>
              <p className="text-[10px] text-emerald-400/60 mt-0.5">Transaction</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Detail panel ── */}
      <AnimatePresence mode="wait">
        {activeDetail ? (
          <motion.div
            key={activeDetail}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`rounded-2xl border px-5 py-4 overflow-hidden ${details[activeDetail].borderColor} ${details[activeDetail].bgColor}`}
          >
            <div className="flex items-start gap-3">
              <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${details[activeDetail].color}`} />
              <div>
                <p className={`text-xs font-bold mb-1.5 ${details[activeDetail].color}`}>
                  {details[activeDetail].title}
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed">{details[activeDetail].body}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 rounded-xl border border-zinc-800/60 bg-zinc-900/20 px-4 py-3"
          >
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
            </motion.div>
            <p className="text-xs text-zinc-600">Tap any component in the transaction to learn what it does</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Envelope metaphor pill ── */}
      <motion.button
        onClick={() => setEnvelopeOpen((o) => !o)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30 cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <motion.div
            animate={{ rotate: envelopeOpen ? 15 : 0, scale: envelopeOpen ? [1, 1.15, 1] : 1 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
          </motion.div>
          <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
            {envelopeOpen ? "The envelope is open — here's what's inside:" : "Think of it as a sealed envelope — tap to open"}
          </p>
        </div>
        <motion.div animate={{ rotate: envelopeOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {envelopeOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { label: "Sender", value: "🔒 Hidden", color: "text-red-400", sub: "never revealed" },
                { label: "Recipient", value: "🔒 Hidden", color: "text-red-400", sub: "never revealed" },
                { label: "Amount", value: "🔒 Hidden", color: "text-red-400", sub: "never revealed" },
                { label: "Validity", value: "✓ Proven", color: "text-emerald-400", sub: "by ZK proof" },
                { label: "Balance", value: "✓ Proven", color: "text-emerald-400", sub: "no ZEC created" },
                { label: "No reuse", value: "✓ Proven", color: "text-emerald-400", sub: "nullifier check" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-2.5 text-center"
                >
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className={`text-[11px] font-semibold ${item.color}`}>{item.value}</p>
                  <p className="text-[9px] text-zinc-700 mt-0.5">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2: The Note
// ─────────────────────────────────────────────────────────────────────────────

export const TheNoteStage = () => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        A <span className="text-white font-medium">note</span> is Zcash's private UTXO. An encrypted record carrying value, recipient, and randomness — only the recipient's viewing key can decrypt it.
      </motion.p>

      {/* Interactive flip card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full"
      >
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full text-left"
          aria-label="Flip card to see network view"
        >
          <div className="relative" style={{ perspective: "1200px" }}>
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", damping: 22, stiffness: 160 }}
              style={{ transformStyle: "preserve-3d", position: "relative", minHeight: 200 }}
            >
              {/* Front: private */}
              <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                className="absolute inset-0 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Note plaintext (private)
                  </p>
                  <span className="text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">tap to flip →</span>
                </div>
                {[
                  { k: "value",     v: "1.5 ZEC",         vc: "text-emerald-300" },
                  { k: "recipient", v: "u1abc…f3d",        vc: "text-emerald-300" },
                  { k: "rseed",     v: "0xbe71…9903",      vc: "text-emerald-300" },
                  { k: "memo",      v: "Private message…", vc: "text-emerald-300" },
                ].map(({ k, v, vc }, i) => (
                  <motion.div key={k}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 + 0.1 }}
                    className="flex justify-between items-baseline border-b border-zinc-800/40 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-zinc-500">{k}</span>
                    <span className={`font-mono text-[11px] ${vc}`}>{v}</span>
                  </motion.div>
                ))}
                <div className="pt-1 px-3 py-2 rounded-lg bg-emerald-500/8 border border-emerald-500/15 text-[10px] text-emerald-400/80 leading-relaxed">
                  🔒 Encrypted with ChaCha20-Poly1305. Only recipient's incoming viewing key decrypts.
                </div>
              </div>

              {/* Back: network sees */}
              <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <Eye className="w-3 h-3" /> What the network sees
                  </p>
                  <span className="text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5 rounded-full">← flip back</span>
                </div>
                {[
                  { k: "note commitment", v: "cm = 0x4d7e…f9", vc: "text-amber-300" },
                  { k: "enc_ciphertext",  v: "<encrypted>",     vc: "text-zinc-600" },
                  { k: "out_ciphertext",  v: "<encrypted>",     vc: "text-zinc-600" },
                  { k: "ephemeral key",   v: "0xb2a1…4c",       vc: "text-amber-300" },
                ].map(({ k, v, vc }) => (
                  <div key={k} className="flex justify-between items-baseline border-b border-zinc-800/40 pb-2 last:border-0 last:pb-0">
                    <span className="text-xs text-zinc-500">{k}</span>
                    <span className={`font-mono text-[11px] ${vc}`}>{v}</span>
                  </div>
                ))}
                <div className="pt-1 px-3 py-2 rounded-lg bg-amber-500/8 border border-amber-500/15 text-[10px] text-amber-400/80 leading-relaxed">
                  The commitment is a fingerprint added to the global <span className="text-amber-300">Merkle commitment tree</span>.
                </div>
              </div>
            </motion.div>
          </div>
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <motion.div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }} />
        <p className="text-xs text-zinc-500 leading-relaxed">
          Every unspent note is a leaf in the global Merkle commitment tree — the Zcash anonymity set <span className="text-zinc-400">grows with every transaction</span>.
        </p>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 3: Spend Description
// ─────────────────────────────────────────────────────────────────────────────

export const SpendDescriptionStage = () => {
  const [showNullifierDetail, setShowNullifierDetail] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        To spend a note, the wallet creates a <span className="text-white font-medium">Spend Description</span>. It proves ownership and marks the note as used — without revealing which note it is.
      </motion.p>

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
          <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest flex items-center gap-2">
            <EyeOff className="w-3 h-3" /> Private inputs (stay hidden)
          </p>
          {[
            { k: "note value",   v: "1.5 ZEC" },
            { k: "spending key", v: "sk = 0x…" },
            { k: "note position",v: "#83,142" },
            { k: "Merkle path",  v: "32-step witness" },
          ].map(({ k, v }, i) => (
            <motion.div key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.15 }}
              className="flex justify-between items-baseline border-b border-red-900/20 pb-2 last:border-0 last:pb-0">
              <span className="text-xs text-zinc-500">{k}</span>
              <span className="font-mono text-[11px] text-red-300">{v}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-zinc-700/50 bg-zinc-900/40 p-4 space-y-3">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Eye className="w-3 h-3" /> Published on-chain
          </p>
          {[
            { k: "nullifier",       v: "nf = 0x7d3c…a9", vc: "text-amber-300", highlight: true },
            { k: "anchor (root)",   v: "0x9c1f…44",       vc: "text-zinc-400",  highlight: false },
            { k: "value commitment",v: "cv = [v]G+[r]H",  vc: "text-zinc-400",  highlight: false },
            { k: "spend auth sig",  v: "rk, σ",           vc: "text-zinc-400",  highlight: false },
          ].map(({ k, v, vc, highlight }, i) => (
            <motion.div key={k}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.25 }}
              className="flex justify-between items-baseline border-b border-zinc-800/40 pb-2 last:border-0 last:pb-0">
              <span className={`text-xs ${highlight ? "text-amber-400/70 font-medium" : "text-zinc-500"}`}>{k}</span>
              <span className={`font-mono text-[11px] ${vc}`}>{v}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Interactive nullifier explainer */}
      <motion.button
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => setShowNullifierDetail((v) => !v)}
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
        className="w-full px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-left"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-400">What is a Nullifier?</p>
          <motion.div animate={{ rotate: showNullifierDetail ? 180 : 0 }} transition={{ duration: 0.25 }}>
            <ChevronDown className="w-3.5 h-3.5 text-amber-500/60" />
          </motion.div>
        </div>
        <AnimatePresence>
          {showNullifierDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-zinc-400 leading-relaxed mt-2.5">
                The <span className="text-amber-300 font-medium">nullifier</span> = PRF(spending key, note). It's unique and random-looking.
                Validators reject any transaction reusing a known nullifier — preventing double-spending without knowing which note was spent.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <p className="text-xs text-zinc-500 leading-relaxed font-mono">
          Circuit proves: I know a valid note in the Merkle tree, and this nullifier is correctly derived from it — without revealing the note or the key.
        </p>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 4: Output Description
// ─────────────────────────────────────────────────────────────────────────────

export const OutputDescriptionStage = () => {
  const [activeTab, setActiveTab] = useState<"recipient" | "change">("recipient");

  const tabs = {
    recipient: {
      label: "Recipient note",
      color: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
      activeBorder: "border-emerald-500/40",
      fields: [
        { k: "value",          v: "1.2 ZEC",      vc: "text-emerald-300" },
        { k: "to",             v: "u1xyz…89",      vc: "text-emerald-300" },
        { k: "commitment",     v: "cm₁ = 0x…",    vc: "text-emerald-300" },
        { k: "enc_ciphertext", v: "<encrypted>",   vc: "text-zinc-600" },
      ],
    },
    change: {
      label: "Change note",
      color: "text-blue-400",
      borderColor: "border-blue-500/20",
      bg: "bg-blue-500/5",
      activeBorder: "border-blue-500/40",
      fields: [
        { k: "value",      v: "0.2999 ZEC", vc: "text-blue-300" },
        { k: "to",         v: "self",       vc: "text-blue-300" },
        { k: "commitment", v: "cm₂ = 0x…",  vc: "text-blue-300" },
        { k: "fee",        v: "0.0001 ZEC", vc: "text-zinc-400" },
      ],
    },
  };

  const active = tabs[activeTab];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        An <span className="text-white font-medium">Output Description</span> creates a new encrypted note for the recipient. The sender also creates a change note back to themselves.
      </motion.p>

      {/* Tab switcher */}
      <div className="flex gap-2">
        {(["recipient", "change"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === tab
                ? `${tabs[tab].activeBorder} ${tabs[tab].color} ${tabs[tab].bg}`
                : "border-zinc-800 text-zinc-600 hover:text-zinc-400"
            }`}
          >
            {tabs[tab].label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.28 }}
          className={`rounded-2xl border p-5 space-y-3 ${active.borderColor} ${active.bg}`}
        >
          <p className={`text-[10px] font-semibold uppercase tracking-widest ${active.color}`}>
            {active.label} (new)
          </p>
          {active.fields.map(({ k, v, vc }, i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex justify-between items-baseline border-b border-zinc-800/30 pb-2 last:border-0 last:pb-0"
            >
              <span className="text-xs text-zinc-500">{k}</span>
              <span className={`font-mono text-[11px] ${vc}`}>{v}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30">
        <p className="text-xs text-zinc-400 leading-relaxed">
          Both commitments <span className="text-white font-mono">cm₁</span> and <span className="text-white font-mono">cm₂</span> are appended to the global Merkle tree when the block is mined.
          The recipient's wallet scans new blocks and trial-decrypts each output to find theirs.
        </p>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 5: Pedersen Commitment
// ─────────────────────────────────────────────────────────────────────────────

export const PedersenStage = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    { label: "Spend cv",    sub: "[v_in]G + [r₁]H",  color: "border-red-500/30 bg-red-500/8 text-red-300",         hoverBg: "hover:bg-red-500/12",     info: "The value commitment for the input note. Hides v_in behind randomness r₁." },
    { label: "−",           sub: "",                   color: "border-zinc-700 bg-transparent text-zinc-400",        hoverBg: "",                        info: "" },
    { label: "Output cv",   sub: "[v_out]G + [r₂]H", color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300", hoverBg: "hover:bg-emerald-500/12", info: "The value commitment for the output note. Hides v_out behind randomness r₂." },
    { label: "=",           sub: "",                   color: "border-zinc-700 bg-transparent text-zinc-400",        hoverBg: "",                        info: "" },
    { label: "Fee commit",  sub: "[fee]G + [r]H",     color: "border-amber-500/30 bg-amber-500/8 text-amber-300",   hoverBg: "hover:bg-amber-500/12",   info: "The fee commitment is public and known. The binding sig verifies this equality holds." },
    { label: "→",           sub: "",                   color: "border-zinc-700 bg-transparent text-zinc-400",        hoverBg: "",                        info: "" },
    { label: "✓ Balance",   sub: "verified",           color: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300", hoverBg: "hover:bg-emerald-500/15", info: "The network confirms balance without ever seeing a single raw amount." },
  ];

  const isOp = (i: number) => [1, 3, 5].includes(i);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        How does the network confirm <span className="text-white font-medium">inputs = outputs + fee</span> without seeing amounts?
        Through <span className="text-white font-medium">Homomorphic Pedersen Commitments</span>.
      </motion.p>

      {/* Equation flow — tap steps for detail */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {steps.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 + 0.1 }}>
            {isOp(i) ? (
              <span className="text-lg font-light text-zinc-500 px-1">{s.label}</span>
            ) : (
              <motion.button
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className={`px-3 py-2.5 rounded-xl border text-center min-w-[90px] cursor-pointer transition-all ${s.color} ${s.hoverBg} ${activeStep === i ? "ring-1 ring-white/20 shadow-lg" : ""}`}
              >
                <p className="text-xs font-semibold">{s.label}</p>
                {s.sub && <p className="font-mono text-[9px] opacity-70 mt-0.5">{s.sub}</p>}
              </motion.button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Step detail */}
      <AnimatePresence mode="wait">
        {activeStep !== null && !isOp(activeStep) && (
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900/40 px-4 py-3"
          >
            <p className="text-xs text-zinc-300 leading-relaxed">{steps[activeStep].info}</p>
          </motion.div>
        )}
        {activeStep === null && (
          <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-xl border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
            <Info className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0" />
            <p className="text-xs text-zinc-600">Tap any box in the equation to learn what it represents</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
          <p className="text-xs font-semibold text-zinc-300">How it works</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            G and H are fixed elliptic curve base points. A commitment <span className="font-mono text-zinc-400">cm = [v]G + [r]H</span> hides the value <span className="font-mono text-zinc-400">v</span> using randomness <span className="font-mono text-zinc-400">r</span>.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <p className="text-xs font-semibold text-emerald-300">The homomorphic trick</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Commitments can be <span className="text-zinc-400">added and subtracted as elliptic-curve points</span>. The result of subtracting outputs from inputs must equal exactly the fee commitment.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 6: ZK Proof
// ─────────────────────────────────────────────────────────────────────────────

export const ZkProofStage = () => {
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);

  const phases = [
    { label: "Witness Generation", icon: Key,       desc: "Building cryptographic witness from private inputs",   colorClass: "text-violet-400/60", border: "border-violet-500/40", bg: "bg-violet-500/10", glow: "rgba(139,92,246,0.28)", active: "text-violet-400" },
    { label: "Constraint System",  icon: GitBranch, desc: "Encoding arithmetic constraints (R1CS / Plonk)",      colorClass: "text-sky-400/60",    border: "border-sky-500/40",    bg: "bg-sky-500/10",    glow: "rgba(56,189,248,0.28)",  active: "text-sky-400" },
    { label: "Polynomial Commit",  icon: Cpu,       desc: "Generating polynomial commitments over the circuit",  colorClass: "text-amber-400/55",  border: "border-amber-500/40",  bg: "bg-amber-500/10",  glow: "rgba(251,191,36,0.28)",  active: "text-amber-400" },
    { label: "Proof Output",       icon: Shield,    desc: "zk-SNARK proof ready — validity without disclosure",  colorClass: "text-emerald-400/60",border: "border-emerald-500/40",bg: "bg-emerald-500/10",glow: "rgba(52,211,153,0.28)",  active: "text-emerald-400" },
  ];

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % phases.length), 1900);
    return () => clearInterval(t);
  }, [paused]);

  const cur = phases[phase];

  const proofItems = [
    { label: "Note exists in tree", tag: "Merkle witness",  color: "bg-emerald-400" },
    { label: "Nullifier is correct",tag: "nk · ρ · ψ",     color: "bg-blue-400" },
    { label: "Balance = 0",         tag: "Pedersen commit", color: "bg-violet-400" },
    { label: "Signature is valid",  tag: "Spend auth sig",  color: "bg-amber-400" },
    { label: "Output well-formed",  tag: "cm derivation",   color: "bg-emerald-400" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        The wallet runs the <span className="text-white font-medium">Orchard Action circuit (Halo 2)</span>. One circuit proves all of the following simultaneously — without revealing any private inputs.
      </motion.p>

      {/* Circuit panel */}
      <div className="relative overflow-hidden rounded-2xl p-5"
        style={{
          background: "linear-gradient(135deg,#0e1a2e 0%,#0b1520 40%,#0f1a10 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}>
        {/* grid bg */}
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.5) 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }} />
        {/* scan line */}
        <motion.div className="absolute left-0 right-0 h-px opacity-25"
          style={{ background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.9),transparent)" }}
          animate={paused ? {} : { top: ["0%", "100%"] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }} />

        {/* Phase nodes — now clickable */}
        <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-4 mb-5">
          {phases.map((ph, i) => {
            const Icon = ph.icon;
            const isActive = i === phase;
            const isDone = i < phase;
            return (
              <motion.button
                key={ph.label}
                onClick={() => { setPhase(i); setPaused(true); }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all
                    ${isDone || isActive ? `${ph.border} ${ph.bg}` : "border-zinc-700/50 bg-zinc-900/60"}`}
                  animate={{
                    scale: isActive ? [1, 1.09, 1] : isDone ? 1 : 0.94,
                    boxShadow: isActive ? [`0 0 0px ${ph.glow}`, `0 0 22px ${ph.glow}`, `0 0 0px ${ph.glow}`] : "none",
                  }}
                  transition={{ duration: isActive ? 1.3 : 0.3, repeat: isActive ? Infinity : 0 }}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isDone || isActive ? ph.active : "text-zinc-600"}`} />
                </motion.div>
                <p className="text-[8px] sm:text-[9px] text-center text-zinc-500 leading-tight">{ph.label}</p>
                <div className="h-3 flex items-center justify-center">
                  {isActive && (
                    <motion.div className={`w-1.5 h-1.5 rounded-full ${ph.active.replace("text-", "bg-")}`}
                      animate={{ opacity: [0, 1, 0], scale: [0.4, 1.3, 0.4] }}
                      transition={{ duration: 0.85, repeat: Infinity }} />
                  )}
                  {isDone && <CheckCircle className={`w-3 h-3 ${ph.active}`} />}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Pause / resume */}
        <div className="relative z-10 flex items-center justify-end mb-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="text-[9px] text-zinc-600 hover:text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded-full transition-colors"
          >
            {paused ? "▶ resume" : "⏸ pause"}
          </button>
        </div>

        {/* Progress connector */}
        <div className="relative z-10 flex items-center gap-1 mb-4">
          {phases.map((ph, i) => (
            <motion.div key={i} className="flex-1 h-0.5 rounded-full"
              animate={{
                backgroundColor: i <= phase
                  ? (i === 0 ? "#a78bfa" : i === 1 ? "#38bdf8" : i === 2 ? "#fbbf24" : "#34d399")
                  : "#27272a",
                opacity: i <= phase ? 1 : 0.25,
              }}
              transition={{ duration: 0.45 }} />
          ))}
        </div>

        {/* Phase desc */}
        <AnimatePresence mode="wait">
          <motion.p key={phase}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className={`relative z-10 text-xs text-center font-medium mb-4 ${cur.active}`}>
            {cur.desc}
          </motion.p>
        </AnimatePresence>

        {/* Hex stream */}
        <div className="relative z-10 rounded-xl p-3 space-y-1.5"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <motion.div className={`w-1.5 h-1.5 rounded-full ${cur.active.replace("text-", "bg-")}`}
              animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.65, repeat: Infinity }} />
            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">proof stream</span>
          </div>
          {[0, 1, 2].map((row) => (
            <HexRow key={`${phase}-${row}`} delay={row * 0.28} colorClass={cur.colorClass} />
          ))}
        </div>
      </div>

      {/* What's proven */}
      <div className="space-y-2">
        {proofItems.map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-36 flex-shrink-0">{item.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div className={`h-full rounded-full ${item.color}`}
                initial={{ width: 0 }} animate={{ width: "100%" }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.7, ease: "easeOut" }} />
            </div>
            <span className="text-[10px] text-zinc-600 font-mono w-28 text-right flex-shrink-0">{item.tag}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 7: Binding Signature
// ─────────────────────────────────────────────────────────────────────────────

export const BindingSignatureStage = () => {
  const [activeCol, setActiveCol] = useState<number | null>(null);

  const steps = [
    { label: "Sum of all cv", sub: "inputs − outputs", color: "border-zinc-700 bg-zinc-900/50 text-zinc-300" },
    { label: "bsk",           sub: "binding key",       color: "border-blue-500/30 bg-blue-500/8 text-blue-300" },
    { label: "binding_sig",   sub: "RedPallas",          color: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300" },
    { label: "✓ Verified",    sub: "Σcv = fee",          color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
  ];

  const cols = [
    { title: "On-chain published", items: ["nullifier", "commitment", "binding_sig", "fee"],                  color: "text-zinc-400",    border: "border-zinc-700",        bg: "bg-zinc-900/30" },
    { title: "Proven by circuit",  items: ["ownership", "balance", "nullifier derivation", "well-formedness"],color: "text-blue-400",    border: "border-blue-500/20",     bg: "bg-blue-500/5" },
    { title: "Forever hidden",     items: ["sender addr.", "recipient addr.", "amount", "memo"],               color: "text-emerald-400", border: "border-emerald-500/20",  bg: "bg-emerald-500/5" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        The <span className="text-white font-medium">Binding Signature</span> is the final seal. It uses the net value commitment as a signing key, proving amounts balance without anyone knowing what those amounts are.
      </motion.p>

      {/* Flow */}
      <div className="flex flex-wrap items-center gap-2 justify-center">
        {steps.map((s, i) => (
          <motion.div key={i} className="flex items-center gap-2"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.1 }}>
            <motion.div
              className={`px-3 py-2 rounded-xl border text-center min-w-[90px] ${s.color}`}
              whileHover={{ scale: 1.04, y: -2 }}
            >
              <p className="text-xs font-semibold">{s.label}</p>
              {s.sub && <p className="font-mono text-[9px] opacity-70 mt-0.5">{s.sub}</p>}
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
        <p className="text-xs font-semibold text-zinc-300">How binding works</p>
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="text-zinc-400 font-mono">bsk = Σ rcv_spends − Σ rcv_outputs</span>
          <br />
          The signature is only valid if all value commitments cancel to the fee commitment. A full node verifies:
        </p>
        <p className="font-mono text-[10px] text-emerald-400/80 bg-zinc-900/60 px-3 py-2 rounded-lg">
          RedPallas.Verify(bvk, SIGHASH, binding_sig) = ✓
        </p>
      </motion.div>

      {/* Interactive col cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
        className="grid grid-cols-3 gap-2"
      >
        {cols.map((col, ci) => (
          <motion.button
            key={col.title}
            onClick={() => setActiveCol(activeCol === ci ? null : ci)}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className={`rounded-xl border p-3 space-y-2 text-left transition-all cursor-pointer ${
              activeCol === ci ? `${col.border} ${col.bg} shadow-lg` : "border-zinc-800 bg-zinc-900/30"
            }`}
          >
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${col.color}`}>{col.title}</p>
            <AnimatePresence>
              {col.items.map((item, ii) => (
                <motion.p
                  key={item}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: ii * 0.05 }}
                  className={`text-[10px] font-mono transition-colors ${activeCol === ci ? "text-zinc-400" : "text-zinc-700"}`}
                >
                  {item}
                </motion.p>
              ))}
            </AnimatePresence>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeCol !== null && (
          <motion.div
            key={activeCol}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`px-4 py-3 rounded-xl border ${cols[activeCol].border} ${cols[activeCol].bg}`}>
              <p className={`text-xs font-semibold mb-1 ${cols[activeCol].color}`}>{cols[activeCol].title}</p>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {activeCol === 0 && "These fields are visible to anyone scanning the blockchain. They prove the transaction is structurally valid without revealing private data."}
                {activeCol === 1 && "The ZK circuit mathematically proves these properties hold — anyone can verify the proof, but the private witness remains hidden."}
                {activeCol === 2 && "These values are encrypted and never appear on-chain in readable form. Only the recipient's viewing key can decrypt the relevant fields."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 8: Interactive Builder
// ─────────────────────────────────────────────────────────────────────────────

export const BuilderStage = () => {
  const [fromPool, setFromPool] = useState<Pool>("orchard");
  const [toPool, setToPool] = useState<Pool>("orchard");
  const [amount, setAmount] = useState(1.5);
  const [memo, setMemo] = useState("Thank you for the private payment");
  const [showModal, setShowModal] = useState(false);
  const zecPrice = useZecPrice();

  const score = Math.round(
    POOL_META[fromPool].privacy * 0.4 +
    POOL_META[toPool].privacy * 0.4 +
    (memo.trim().length > 0 && toPool !== "transparent" ? 20 : 0)
  );
  const grade = score >= 90 ? "A+" : score >= 70 ? "B" : score >= 40 ? "C" : "D";
  const gradeColor = score >= 90 ? "#34d399" : score >= 70 ? "#fbbf24" : score >= 40 ? "#f97316" : "#f87171";
  const strokeColor = gradeColor;

  const feeZat = calculateZip317Fee(
    fromPool === "transparent" ? 1 : 0,
    toPool === "transparent" ? 1 : 0,
    toPool !== "transparent" ? 1 : 0
  );
  const feeZEC = (feeZat / 100_000_000).toFixed(8);
  const change = Math.max(0, amount - parseFloat(feeZEC)).toFixed(5);
  const usd = zecPrice ? (amount * zecPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : null;

  const pools: Pool[] = ["transparent", "sapling", "orchard"];
  const circumference = 2 * Math.PI * 44;

  return (
    <>
      {showModal && <BroadcastModal onClose={() => setShowModal(false)} />}
      <div className="w-full max-w-2xl mx-auto space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Controls */}
          <div className="space-y-4">
            {/* From pool */}
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">From Pool</label>
              <div className="flex gap-2">
                {pools.map((p) => (
                  <motion.button key={p} onClick={() => setFromPool(p)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-semibold border transition-all ${fromPool === p
                      ? `${POOL_META[p].borderColor} ${POOL_META[p].color} ${POOL_META[p].bg}`
                      : "border-zinc-800 text-zinc-600 hover:text-zinc-400"}`}>
                    {POOL_META[p].label}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={fromPool}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`text-[10px] mt-1.5 leading-relaxed ${POOL_META[fromPool].color}`}
                >
                  {POOL_META[fromPool].desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* To pool */}
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">To Pool</label>
              <div className="flex gap-2">
                {pools.map((p) => (
                  <motion.button key={p} onClick={() => setToPool(p)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-semibold border transition-all ${toPool === p
                      ? `${POOL_META[p].borderColor} ${POOL_META[p].color} ${POOL_META[p].bg}`
                      : "border-zinc-800 text-zinc-600 hover:text-zinc-400"}`}>
                    {POOL_META[p].label}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={toPool}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`text-[10px] mt-1.5 leading-relaxed ${POOL_META[toPool].color}`}
                >
                  {POOL_META[toPool].desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Amount */}
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2">Amount (ZEC)</label>
              <div className="relative">
                <input type="number" value={amount} min={0.00001} step={0.1}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-2.5 text-lg font-mono text-emerald-300 outline-none focus:border-emerald-500/50 transition-colors" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">ZEC</span>
              </div>
              <input type="range" min={0.001} max={100} step={0.001} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer mt-2" />
              {usd && <p className="text-[10px] text-zinc-600 mt-1">≈ ${usd} USD</p>}
            </div>

            {/* Memo */}
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                <Lock className="w-2.5 h-2.5" /> Encrypted Memo
                {toPool === "transparent" && (
                  <span className="text-[9px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded ml-1">Unavailable</span>
                )}
              </label>
              <textarea value={memo} rows={3}
                onChange={(e) => setMemo(e.target.value.slice(0, 512))}
                disabled={toPool === "transparent"}
                placeholder={toPool === "transparent" ? "Not available for transparent" : "Private message…"}
                className={`w-full rounded-xl px-4 py-2.5 text-xs font-mono resize-none outline-none transition-colors border
                  ${toPool !== "transparent"
                    ? "bg-zinc-900/60 border-zinc-700 text-zinc-300 focus:border-emerald-500/40 placeholder:text-zinc-600"
                    : "bg-zinc-950/40 border-zinc-800 text-zinc-600 cursor-not-allowed placeholder:text-zinc-700"}`} />
              {toPool !== "transparent" && (
                <p className="text-[9px] text-zinc-700 mt-1">{memo.length}/512 chars</p>
              )}
            </div>
          </div>

          {/* Score + output */}
          <div className="space-y-4">
            {/* Score ring */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-28 h-28">
                <motion.div className="absolute inset-1 rounded-full"
                  animate={{ boxShadow: [`0 0 0px ${gradeColor}40`, `0 0 28px ${gradeColor}40`, `0 0 0px ${gradeColor}40`] }}
                  transition={{ duration: 2.8, repeat: Infinity }} />
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#27272a" strokeWidth="10" />
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="12"
                    stroke={strokeColor} opacity="0.07"
                    strokeDasharray={`${circumference}`} strokeDashoffset="0" />
                  <motion.circle cx="50" cy="50" r="44" fill="none" strokeWidth="10" strokeLinecap="round"
                    stroke={strokeColor}
                    strokeDasharray={`${circumference}`}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    style={{ filter: `drop-shadow(0 0 5px ${strokeColor}80)` }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span className="text-3xl font-black" style={{ color: gradeColor, textShadow: `0 0 18px ${gradeColor}60` }}
                    key={grade} initial={{ scale: 0.6, rotate: -15 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 220 }}>
                    {grade}
                  </motion.span>
                  <span className="text-[9px] text-zinc-500">{score}/100</span>
                </div>
              </div>

              {/* Warning */}
              <AnimatePresence>
                {(fromPool === "transparent" || toPool === "transparent") && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    Transparent pool exposes addresses &amp; amounts on-chain.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Est. Fee", value: feeZEC + " ZEC", sub: "ZIP 317" },
                { label: "Change",   value: change + " ZEC", sub: "returned to sender" },
                { label: "From pool",value: POOL_META[fromPool].label, sub: POOL_META[fromPool].tag },
                { label: "To pool",  value: POOL_META[toPool].label,   sub: POOL_META[toPool].tag },
              ].map((s) => (
                <motion.div key={s.label}
                  whileHover={{ scale: 1.02 }}
                  className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3">
                  <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-xs font-semibold text-zinc-300 font-mono">{s.value}</p>
                  <p className="text-[9px] text-zinc-600">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            <motion.button onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(52,211,153,0.22)" }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ boxShadow: "0 0 18px rgba(52,211,153,0.14)" }}>
              <Zap className="w-4 h-4" /> Simulate Broadcast
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
};