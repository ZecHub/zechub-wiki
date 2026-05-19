"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pickaxe, Vote, Link2, Lock, Unlock, ShieldAlert, ShieldCheck,
  AlertTriangle, CheckCircle, Coins, Users, Cpu, ArrowRight, ArrowDown,
  Layers, Hourglass, ChevronDown, Info,
  Anchor, Skull, Ban, Clock, Award, TrendingUp, X, Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

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
    title: "Two Layers, One Chain",
    subtitle: "Step 1 · What is Crosslink?",
    description: "Crosslink is a hybrid consensus that runs PoW mining and a BFT finality gadget side-by-side. PoW writes the chain; BFT seals it shut.",
    icon: Layers,
  },
  {
    id: "the-problem",
    title: "Why Hybrid?",
    subtitle: "Step 2 · The PoW-only weakness",
    description: "Pure PoW gives probabilistic finality. A well-funded attacker can rewrite recent history. Crosslink adds an irreversible 'point of no return'.",
    icon: AlertTriangle,
  },
  {
    id: "pow-layer",
    title: "The PoW Layer",
    subtitle: "Step 3 · Best-effort chain",
    description: "Equihash miners continue producing blocks every ~75 seconds. This is the 'best-effort' chain: fast, censorship-resistant, but reversible.",
    icon: Pickaxe,
  },
  {
    id: "bft-layer",
    title: "The BFT Finality Layer",
    subtitle: "Step 4 · Finalizers vote",
    description: "Up to 100 staked finalizers run Malachite (Rust Tendermint). They don't validate transactions; they vote on which PoW blocks become final.",
    icon: Vote,
  },
  {
    id: "crosslink-ref",
    title: "The Crosslink",
    subtitle: "Step 5 · Snap-and-chat reference",
    description: "Each new PoW block contains a pointer (fin) to the most recent BFT-final block the miner knew about. This snaps the two layers together.",
    icon: Link2,
  },
  {
    id: "trailing-finality",
    title: "Trailing Finality",
    subtitle: "Step 6 · Past a depth σ, irreversible",
    description: "BFT finality 'trails' the PoW tip. PoW blocks rejected if they roll back a final block. Confirmed = economically irreversible.",
    icon: Anchor,
  },
  {
    id: "staking",
    title: "Staking & Finalizers",
    subtitle: "Step 7 · Delegate, earn, get slashed",
    description: "Holders stake ZEC (in powers of 10) to finalizers. Top 100 by weight form the active set. 90% of issuance to stakers, 10% commission.",
    icon: Coins,
  },
  {
    id: "attack-simulator",
    title: "Attack Simulator",
    subtitle: "Step 8 · Try a 51% attack",
    description: "Launch a hostile PoW reorg and watch the Trailing Finality Layer reject it. Tune attacker hashrate, depth, and BFT response.",
    icon: ShieldAlert,
  },
];

// ─── Reusable mini block component ──────────────────────────────────────────

interface MiniBlockProps {
  height: number;
  status: "pow" | "bft-final" | "attacker" | "pending";
  label?: string;
  small?: boolean;
}

const MiniBlock = ({ height, status, label, small }: MiniBlockProps) => {
  const palette: Record<MiniBlockProps["status"], { bg: string; border: string; text: string; glow: string }> = {
    "pow":       { bg: "rgba(244,183,40,0.10)", border: "rgba(244,183,40,0.45)", text: "text-amber-300",   glow: "rgba(244,183,40,0.25)" },
    "bft-final": { bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.55)", text: "text-emerald-300", glow: "rgba(52,211,153,0.35)" },
    "attacker":  { bg: "rgba(239,68,68,0.10)",  border: "rgba(239,68,68,0.50)",  text: "text-red-300",     glow: "rgba(239,68,68,0.30)" },
    "pending":   { bg: "rgba(113,113,122,0.08)",border: "rgba(113,113,122,0.40)",text: "text-zinc-400",    glow: "rgba(113,113,122,0.10)" },
  };
  const p = palette[status];
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", damping: 18, stiffness: 220 }}
      className={`rounded-lg ${small ? "px-2 py-1.5" : "px-2.5 py-2"} text-center flex-shrink-0`}
      style={{
        background: p.bg,
        border: `1px solid ${p.border}`,
        boxShadow: status === "bft-final" ? `0 0 16px ${p.glow}` : undefined,
        minWidth: small ? 44 : 56,
      }}
    >
      <p className={`${small ? "text-[8px]" : "text-[9px]"} text-zinc-500 leading-none mb-0.5`}>#{height}</p>
      <p className={`${small ? "text-[9px]" : "text-[10px]"} font-bold ${p.text} leading-none`}>
        {label ?? (status === "bft-final" ? "FINAL" : status === "attacker" ? "ATK" : "PoW")}
      </p>
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 1: Overview — Two layers, one chain
// ─────────────────────────────────────────────────────────────────────────────

export const OverviewStage = () => {
  const [activeLayer, setActiveLayer] = useState<"pow" | "bft" | null>(null);
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setAnimStep(1), 350),
      setTimeout(() => setAnimStep(2), 850),
      setTimeout(() => setAnimStep(3), 1350),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const layers = {
    pow: {
      title: "PoW Layer (best-effort)",
      body: "Equihash miners produce candidate blocks. Fast, permissionless, censorship-resistant, but always reversible until the BFT layer seals it.",
      color: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-500/8",
    },
    bft: {
      title: "BFT Layer (finality gadget)",
      body: "Up to 100 staked finalizers run Tendermint-style consensus. They vote on which PoW blocks become permanently final. They never validate transactions.",
      color: "text-emerald-400",
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/8",
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Crosslink is Zcash's proposed <span className="text-white font-medium">hybrid consensus</span>: keep the existing PoW chain, then add a BFT (Byzantine Fault Tolerance) finality gadget on top. Two layers, working together, on one chain.
      </motion.p>

      {/* Two-layer diagram */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 overflow-hidden">

        {/* BFT layer (top) */}
        <motion.button
          onClick={() => setActiveLayer(activeLayer === "bft" ? null : "bft")}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: animStep >= 1 ? 1 : 0, y: animStep >= 1 ? 0 : -12 }}
          whileHover={{ scale: 1.01 }}
          className={`w-full rounded-xl px-4 py-3 mb-4 border transition-all ${
            activeLayer === "bft" ? "border-emerald-500/60 bg-emerald-500/10" : "border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Vote className="w-4 h-4 text-emerald-400" />
              <p className="text-xs font-bold text-emerald-300">BFT Finality Layer</p>
            </div>
            <span className="text-[9px] text-emerald-400/60 uppercase tracking-wider">Tendermint / Malachite</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            {[0,1,2,3,4].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0,-3,0] }}
                transition={{ duration: 1.6, delay: i*0.15, repeat: Infinity, ease: "easeInOut" }}
                className="w-7 h-7 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center"
              >
                <Users className="w-3 h-3 text-emerald-400" />
              </motion.div>
            ))}
          </div>
        </motion.button>

        {/* Vertical link arrows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: animStep >= 2 ? 1 : 0 }}
          className="flex justify-around mb-2"
        >
          {[0,1,2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [-2, 2, -2], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, delay: i*0.4, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <div className="w-px h-4 bg-gradient-to-b from-emerald-500/60 to-amber-500/60" />
              <ArrowDown className="w-3 h-3 text-zinc-500 -mt-1" />
            </motion.div>
          ))}
        </motion.div>

        {/* PoW layer (bottom) */}
        <motion.button
          onClick={() => setActiveLayer(activeLayer === "pow" ? null : "pow")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: animStep >= 2 ? 1 : 0, y: animStep >= 2 ? 0 : 12 }}
          whileHover={{ scale: 1.01 }}
          className={`w-full rounded-xl px-4 py-3 border transition-all ${
            activeLayer === "pow" ? "border-amber-500/60 bg-amber-500/10" : "border-amber-500/25 bg-amber-500/5 hover:border-amber-500/40"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Pickaxe className="w-4 h-4 text-amber-400" />
              <p className="text-xs font-bold text-amber-300">PoW Layer (Equihash)</p>
            </div>
            <span className="text-[9px] text-amber-400/60 uppercase tracking-wider">existing Zcash chain</span>
          </div>
          <div className="flex items-center gap-1 justify-center overflow-hidden">
            {[1,2,3,4,5,6].map((h) => (
              <motion.div
                key={h}
                animate={{ x: [0, -2, 0] }}
                transition={{ duration: 4, delay: h*0.1, repeat: Infinity }}
              >
                <MiniBlock height={1000+h} status="pow" small />
              </motion.div>
            ))}
          </div>
        </motion.button>

        {/* Result badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: animStep >= 3 ? 1 : 0, scale: animStep >= 3 ? 1 : 0.85 }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(52,211,153,0)", "0 0 20px rgba(52,211,153,0.3)", "0 0 0px rgba(52,211,153,0)"] }}
            transition={{ duration: 2.4, repeat: Infinity }}
            className="px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/8"
          >
            <p className="text-xs font-bold text-emerald-300">= Hybrid PoW + BFT finality</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {activeLayer ? (
          <motion.div
            key={activeLayer}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-2xl border px-5 py-4 overflow-hidden ${layers[activeLayer].border} ${layers[activeLayer].bg}`}
          >
            <div className="flex items-start gap-3">
              <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 ${layers[activeLayer].color}`} />
              <div>
                <p className={`text-xs font-bold mb-1.5 ${layers[activeLayer].color}`}>{layers[activeLayer].title}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{layers[activeLayer].body}</p>
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
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
            </motion.div>
            <p className="text-xs text-zinc-600">Tap either layer above to see what it does</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 2: The Problem — Why PoW alone isn't enough
// ─────────────────────────────────────────────────────────────────────────────

export const ProblemStage = () => {
  const [attackOn, setAttackOn] = useState(false);
  const [forkVisible, setForkVisible] = useState(false);

  useEffect(() => {
    if (!attackOn) {
      setForkVisible(false);
      return;
    }
    const t = setTimeout(() => setForkVisible(true), 600);
    return () => clearTimeout(t);
  }, [attackOn]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Bitcoin-style <span className="text-white font-medium">probabilistic finality</span> means a transaction is "probably" final after N confirmations. An attacker with enough hashrate can mine a deeper private chain and rewrite history.
      </motion.p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">PoW chain (no finality)</p>
          <motion.button
            onClick={() => setAttackOn(!attackOn)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
              attackOn
                ? "bg-red-500/20 border-red-500/50 text-red-300"
                : "bg-zinc-900/60 border-zinc-700 text-zinc-300 hover:border-red-500/40"
            }`}
          >
            {attackOn ? <ShieldAlert className="w-3 h-3" /> : <Skull className="w-3 h-3" />}
            {attackOn ? "Attack running" : "Launch 51% attack"}
          </motion.button>
        </div>

        {/* Honest chain */}
        <div>
          <p className="text-[9px] text-amber-400/60 mb-2 uppercase tracking-wider">Honest chain</p>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[100,101,102,103,104,105,106].map((h, i) => (
              <React.Fragment key={h}>
                <MiniBlock height={h} status="pow" small />
                {i < 6 && <div className="w-3 h-px bg-zinc-700 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Attacker chain */}
        <AnimatePresence>
          {forkVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <p className="text-[9px] text-red-400/70 mb-2 uppercase tracking-wider">Attacker's private chain · appears with more work</p>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[103,104,105,106,107,108].map((h, i) => (
                  <React.Fragment key={h}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i*0.12 }}
                    >
                      <MiniBlock height={h} status="attacker" small />
                    </motion.div>
                    {i < 5 && <div className="w-3 h-px bg-red-500/40 shrink-0" />}
                  </React.Fragment>
                ))}
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3 flex items-center gap-2 text-[11px] text-red-300"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Heaviest-chain rule swaps to attacker → recent transactions reversed
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {!attackOn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-[11px] text-zinc-500"
          >
            <Info className="w-3.5 h-3.5" />
            Wait several confirmations, but "several" depends on attacker resources
          </motion.div>
        )}
      </div>

      {/* Crosslink fix preview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-300 mb-1">Crosslink's answer</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Once a block is BFT-final, the protocol rejects any PoW chain that tries to roll it back, even one with more accumulated work. Finality becomes a hard wall, not a probability.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 3: PoW Layer — mining animation
// ─────────────────────────────────────────────────────────────────────────────

export const PowLayerStage = () => {
  const [hashAttempts, setHashAttempts] = useState(0);
  const [mining, setMining] = useState(true);
  const [blocks, setBlocks] = useState<number[]>([1001]);
  const [foundHash, setFoundHash] = useState<string>("");

  // Hash counter
  useEffect(() => {
    if (!mining) return;
    const t = setInterval(() => setHashAttempts((n) => n + 7437), 90);
    return () => clearInterval(t);
  }, [mining]);

  // Auto-find blocks
  useEffect(() => {
    if (!mining) return;
    const t = setInterval(() => {
      setBlocks((b) => {
        const next = b[b.length - 1] + 1;
        return b.length >= 6 ? [...b.slice(1), next] : [...b, next];
      });
      setFoundHash(
        "0000" + Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      );
    }, 3800);
    return () => clearInterval(t);
  }, [mining]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        The PoW layer is unchanged from today's Zcash. Equihash miners burn energy hunting for a hash below the network target, averaging one block every <span className="text-amber-300 font-mono">~75 sec</span>.
      </motion.p>

      {/* Miner card */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-zinc-950/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={mining ? { rotate: [0, -20, 20, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Pickaxe className="w-5 h-5 text-amber-400" />
            </motion.div>
            <p className="text-xs font-bold text-amber-300">Equihash Miner</p>
          </div>
          <motion.button
            onClick={() => setMining(!mining)}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${
              mining ? "bg-amber-500/15 border-amber-500/40 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-400"
            }`}
          >
            {mining ? "● mining" : "○ paused"}
          </motion.button>
        </div>

        {/* Live hash counter */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">Attempts</p>
            <p className="text-sm font-mono text-amber-300 tabular-nums">{hashAttempts.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-zinc-900/60 border border-zinc-800 px-3 py-2">
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-0.5">Algorithm</p>
            <p className="text-sm font-mono text-amber-300">Equihash 200,9</p>
          </div>
        </div>

        {/* Found block */}
        <AnimatePresence mode="wait">
          {foundHash && (
            <motion.div
              key={foundHash}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg bg-emerald-500/8 border border-emerald-500/30 px-3 py-2 mb-3"
            >
              <p className="text-[9px] text-emerald-400/70 uppercase tracking-wider mb-1">Latest block hash</p>
              <p className="font-mono text-[10px] text-emerald-300 break-all">{foundHash}…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chain */}
        <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2">Best-effort chain</p>
        <div className="flex items-center gap-1 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {blocks.map((h, i) => (
              <motion.div
                key={h}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1"
              >
                <MiniBlock height={h} status="pow" />
                {i < blocks.length - 1 && <div className="w-3 h-px bg-zinc-700" />}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Properties */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Fast", value: "~75s", color: "text-amber-400", icon: Zap },
          { label: "Open", value: "anyone mines", color: "text-amber-400", icon: Cpu },
          { label: "Reversible", value: "until BFT", color: "text-red-400", icon: Unlock },
        ].map((p) => (
          <motion.div
            key={p.label}
            whileHover={{ y: -2 }}
            className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 text-center"
          >
            <p.icon className={`w-4 h-4 mx-auto mb-1 ${p.color}`} />
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">{p.label}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${p.color}`}>{p.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// STAGE 4: BFT Finality Layer — finalizer voting
// ─────────────────────────────────────────────────────────────────────────────

interface Finalizer {
  id: number;
  name: string;
  stake: number;
  voted: boolean;
  byzantine: boolean;
}

export const BftLayerStage = () => {
  const [round, setRound] = useState(0);
  const [showSlash, setShowSlash] = useState(false);

  const finalizers: Finalizer[] = useMemo(() => [
    { id: 1, name: "F-Alpha",   stake: 12_500_000, voted: round >= 1, byzantine: false },
    { id: 2, name: "F-Bravo",   stake: 10_200_000, voted: round >= 1, byzantine: false },
    { id: 3, name: "F-Charlie", stake:  8_900_000, voted: round >= 2, byzantine: false },
    { id: 4, name: "F-Delta",   stake:  7_400_000, voted: round >= 2, byzantine: false },
    { id: 5, name: "F-Echo",    stake:  6_100_000, voted: round >= 3, byzantine: false },
    { id: 6, name: "F-Foxtrot", stake:  4_800_000, voted: round >= 3, byzantine: true  },
  ], [round]);

  const totalStake = finalizers.reduce((s, f) => s + f.stake, 0);
  const honestStake = finalizers.filter((f) => f.voted && !f.byzantine).reduce((s, f) => s + f.stake, 0);
  const pct = (honestStake / totalStake) * 100;
  const finalized = pct >= 66.7;

  // Auto-cycle rounds
  useEffect(() => {
    const t = setInterval(() => {
      setRound((r) => (r >= 3 ? 0 : r + 1));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Finalizers are nodes staked with ZEC running <span className="text-emerald-300 font-mono">Malachite</span> (a Rust port of Tendermint). They never validate transactions; they vote on which PoW block to mark final. A block is finalized when <span className="text-emerald-300 font-semibold">⅔ of staked weight</span> votes for it.
      </motion.p>

      <div className="rounded-2xl border border-emerald-500/30 bg-zinc-950/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Vote className="w-4 h-4 text-emerald-400" />
            <p className="text-xs font-bold text-emerald-300">Voting on block #1042</p>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">round {round}/3</p>
        </div>

        {/* Finalizers grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {finalizers.map((f) => (
            <motion.div
              key={f.id}
              animate={{
                borderColor: f.voted
                  ? (f.byzantine ? "rgba(239,68,68,0.6)" : "rgba(52,211,153,0.6)")
                  : "rgba(63,63,70,0.6)",
                scale: f.voted ? [1, 1.05, 1] : 1,
              }}
              transition={{ duration: 0.4 }}
              className="rounded-lg p-2 border bg-zinc-900/40"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-zinc-300">{f.name}</p>
                {f.voted && !f.byzantine && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                {f.voted && f.byzantine && <X className="w-3 h-3 text-red-400" />}
                {!f.voted && <Hourglass className="w-3 h-3 text-zinc-600" />}
              </div>
              <p className="text-[9px] text-zinc-500 font-mono">{(f.stake/1e6).toFixed(1)}M ZEC</p>
            </motion.div>
          ))}
        </div>

        {/* Tally bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px]">
            <span className="text-zinc-500">Honest yes-votes (weighted)</span>
            <span className={`font-mono font-bold ${finalized ? "text-emerald-400" : "text-zinc-400"}`}>
              {pct.toFixed(1)}% / 66.7%
            </span>
          </div>
          <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
              className={`h-full ${finalized ? "bg-emerald-400" : "bg-amber-400"}`}
            />
          </div>
          <AnimatePresence>
            {finalized && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[11px] text-emerald-300"
              >
                <Lock className="w-3.5 h-3.5" />
                Block #1042 is now <span className="font-bold">BFT-final</span> · irreversible
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Slashing toggle */}
      <motion.button
        onClick={() => setShowSlash(!showSlash)}
        whileHover={{ scale: 1.01 }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/30"
      >
        <div className="flex items-center gap-2.5">
          <Ban className="w-4 h-4 text-red-400" />
          <p className="text-xs text-zinc-400">Byzantine finalizers (like F-Foxtrot) get slashed · tap to see how</p>
        </div>
        <motion.div animate={{ rotate: showSlash ? 180 : 0 }}>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-600" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showSlash && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-4"
          >
            <p className="text-xs text-zinc-400 leading-relaxed">
              If a finalizer signs <span className="text-red-300 font-medium">conflicting votes</span> for the same height (provably double-voting), anyone can submit a slashing proof. The finalizer loses a portion of staked ZEC, and the report submitter is rewarded. This is what makes BFT finality economically secure.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 5: The Crosslink Reference — snap-and-chat
// ─────────────────────────────────────────────────────────────────────────────

export const CrosslinkReferenceStage = () => {
  const [highlightedBlock, setHighlightedBlock] = useState<number | null>(null);

  // Auto-walk through blocks
  useEffect(() => {
    const seq = [1003, 1004, 1005, null];
    let i = 0;
    const t = setInterval(() => {
      setHighlightedBlock(seq[i]);
      i = (i + 1) % seq.length;
    }, 1800);
    return () => clearInterval(t);
  }, []);

  const blocks = [
    { h: 1000, status: "bft-final" as const, finRef: null },
    { h: 1001, status: "pow" as const, finRef: 1000 },
    { h: 1002, status: "pow" as const, finRef: 1000 },
    { h: 1003, status: "bft-final" as const, finRef: 1000 },
    { h: 1004, status: "pow" as const, finRef: 1003 },
    { h: 1005, status: "pow" as const, finRef: 1003 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Each PoW block contains <span className="text-white font-medium font-mono">two</span> references: <span className="text-amber-300">prev</span> (parent PoW block) and <span className="text-emerald-300 font-mono">fin</span> (most recent BFT-final block the miner saw). The <span className="text-emerald-300">fin</span> pointer is the actual "crosslink".
      </motion.p>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 relative overflow-hidden">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">PoW chain with crosslinks</p>

        {/* Block row */}
        <div className="flex items-end justify-between gap-2 mb-8 relative">
          {blocks.map((b, i) => (
            <div key={b.h} className="flex flex-col items-center gap-1 flex-1 relative">
              <motion.div
                onMouseEnter={() => setHighlightedBlock(b.h)}
                onMouseLeave={() => setHighlightedBlock(null)}
                animate={{
                  scale: highlightedBlock === b.h ? 1.15 : 1,
                  boxShadow: highlightedBlock === b.h
                    ? "0 0 24px rgba(52,211,153,0.5)"
                    : "0 0 0px rgba(0,0,0,0)",
                }}
                className="cursor-pointer rounded-lg w-full"
              >
                <MiniBlock height={b.h} status={b.status} />
              </motion.div>
              {b.status === "bft-final" && (
                <motion.p
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[8px] text-emerald-400 font-bold flex items-center gap-0.5"
                >
                  <Anchor className="w-2 h-2" /> FIN
                </motion.p>
              )}
              {i < blocks.length - 1 && (
                <div className="absolute top-1/2 left-[calc(100%-6px)] w-3 h-px bg-zinc-700 z-0" />
              )}
            </div>
          ))}
        </div>

        {/* Fin reference arrows */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {blocks.map((b, i) => {
            if (!b.finRef) return null;
            const finIdx = blocks.findIndex((x) => x.h === b.finRef);
            if (finIdx < 0) return null;
            const blockCount = blocks.length;
            const fromX = ((i + 0.5) / blockCount) * 100;
            const toX = ((finIdx + 0.5) / blockCount) * 100;
            const isHighlight = highlightedBlock === b.h;
            return (
              <motion.path
                key={`arc-${b.h}`}
                d={`M ${fromX}% 75 Q ${(fromX+toX)/2}% 140, ${toX}% 75`}
                fill="none"
                stroke={isHighlight ? "#34d399" : "rgba(52,211,153,0.35)"}
                strokeWidth={isHighlight ? 2 : 1}
                strokeDasharray="4 3"
                animate={isHighlight ? { strokeDashoffset: [0, -14] } : {}}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              />
            );
          })}
        </svg>

        {/* Selected block detail */}
        <AnimatePresence mode="wait">
          {highlightedBlock !== null ? (
            <motion.div
              key={highlightedBlock}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3"
            >
              {(() => {
                const b = blocks.find((x) => x.h === highlightedBlock)!;
                return (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <p className="text-zinc-500">block #{b.h} <span className="text-zinc-700">({b.status === "bft-final" ? "BFT-final" : "PoW"})</span></p>
                    <p>
                      <span className="text-amber-400">prev</span>
                      <span className="text-zinc-600"> → </span>
                      <span className="text-zinc-300">#{b.h - 1}</span>
                    </p>
                    {b.finRef && (
                      <p>
                        <span className="text-emerald-400">fin </span>
                        <span className="text-zinc-600"> → </span>
                        <span className="text-emerald-300">#{b.finRef}</span>
                        <span className="text-zinc-600"> (last BFT-final)</span>
                      </p>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-[11px] text-zinc-600 text-center"
            >
              Hover a block to inspect its <span className="font-mono text-emerald-400">fin</span> pointer
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <ArrowRight className="w-3 h-3 text-amber-400" />
            <p className="text-[10px] font-bold text-amber-300">prev</p>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">Standard PoW parent pointer · builds the work chain</p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Anchor className="w-3 h-3 text-emerald-400" />
            <p className="text-[10px] font-bold text-emerald-300">fin</p>
          </div>
          <p className="text-[10px] text-zinc-400 leading-relaxed">Crosslink to latest BFT-final · what makes the two layers one</p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 6: Trailing Finality — the σ-bound depth
// ─────────────────────────────────────────────────────────────────────────────

export const TrailingFinalityStage = () => {
  const [sigma, setSigma] = useState(3);
  const tip = 1010;
  const finalDepth = tip - sigma;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Finality <span className="text-white font-medium">trails</span> the tip by depth <span className="font-mono text-emerald-300">σ</span>. Blocks deeper than σ are BFT-final and immutable. Lower σ = faster finality but tighter coordination requirement.
      </motion.p>

      {/* σ slider */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Rollback bound σ</p>
          <span className="font-mono text-sm text-emerald-300">σ = {sigma}</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          value={sigma}
          onChange={(e) => setSigma(parseInt(e.target.value))}
          className="w-full accent-emerald-400"
        />
        <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
          <span>fast finality</span>
          <span>safer / slower</span>
        </div>
      </div>

      {/* Chain with finality zone */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 overflow-hidden">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">PoW chain</p>
        <div className="relative">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {Array.from({ length: 11 }, (_, i) => {
              const h = tip - 10 + i;
              const isFinal = h <= finalDepth;
              return (
                <motion.div
                  key={h}
                  animate={{
                    opacity: 1,
                    y: isFinal ? 0 : [0, -2, 0],
                  }}
                  transition={{ duration: 2, repeat: isFinal ? 0 : Infinity }}
                  className="flex items-center gap-1 flex-shrink-0"
                >
                  <MiniBlock
                    height={h}
                    status={isFinal ? "bft-final" : "pow"}
                    label={h === tip ? "TIP" : undefined}
                    small
                  />
                  {i < 10 && <div className={`w-2 h-px ${isFinal ? "bg-emerald-500/40" : "bg-zinc-700"}`} />}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-300 font-mono">≤ #{finalDepth}: final</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Unlock className="w-3 h-3 text-amber-400" />
            <span className="text-amber-300 font-mono">&gt; #{finalDepth}: best-effort</span>
          </div>
        </div>
      </div>

      {/* Rule callout */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4"
      >
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-emerald-300">PoW validity rule (Crosslink)</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              A new PoW block is <span className="text-emerald-300 font-medium">invalid</span> if its chain rolls back the most recent BFT-final block, even if it has more accumulated PoW. Honest miners simply refuse to build on it.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 7: Staking — finalizer set, delegation, rewards
// ─────────────────────────────────────────────────────────────────────────────

export const StakingStage = () => {
  const [delegatedAmount, setDelegatedAmount] = useState(100);
  const [selectedFinalizer, setSelectedFinalizer] = useState(0);

  const finalizers = [
    { name: "ZecMint",       stake: 4_200_000, commission: 8,  uptime: 99.9 },
    { name: "OrchardStake",  stake: 3_100_000, commission: 10, uptime: 99.7 },
    { name: "SaplingPool",   stake: 2_400_000, commission: 5,  uptime: 99.8 },
  ];

  const annualIssuance = 350_000;
  const totalActiveStake = 100_000_000;
  const fin = finalizers[selectedFinalizer];
  const myShare = delegatedAmount / (fin.stake + delegatedAmount);
  const finRewards = (annualIssuance * fin.stake) / totalActiveStake;
  const myRewards = finRewards * myShare * (1 - fin.commission/100);
  const apr = (myRewards / delegatedAmount) * 100;

  // Quantize to nearest power of 10
  const quantized = useMemo(() => {
    if (delegatedAmount < 10) return 1;
    return Math.pow(10, Math.floor(Math.log10(delegatedAmount)));
  }, [delegatedAmount]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        ZEC holders delegate stake (in <span className="font-mono text-emerald-300">powers of 10</span>) to finalizers. Top 100 by weight form the active set. Stakers earn <span className="text-emerald-300 font-medium">90%</span> of new issuance; finalizers take a commission.
      </motion.p>

      {/* Finalizer cards */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pick a finalizer</p>
        {finalizers.map((f, i) => (
          <motion.button
            key={f.name}
            onClick={() => setSelectedFinalizer(i)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-left ${
              selectedFinalizer === i
                ? "border-emerald-500/50 bg-emerald-500/8"
                : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
            }`}
          >
            <motion.div
              animate={selectedFinalizer === i ? { rotate: [0, 360] } : {}}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                selectedFinalizer === i ? "bg-emerald-500/20" : "bg-zinc-800"
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${selectedFinalizer === i ? "text-emerald-300" : "text-zinc-300"}`}>{f.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono">{(f.stake/1e6).toFixed(2)}M ZEC staked</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-zinc-500">commission</p>
              <p className="text-[11px] font-mono text-zinc-300">{f.commission}%</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-zinc-500">uptime</p>
              <p className="text-[11px] font-mono text-emerald-400">{f.uptime}%</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Delegation slider */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Stake amount</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-emerald-300">{delegatedAmount.toLocaleString()} ZEC</span>
            <span className="text-[9px] text-zinc-600 font-mono">→ quantized to {quantized.toLocaleString()}</span>
          </div>
        </div>
        <input
          type="range"
          min="10"
          max="10000"
          step="10"
          value={delegatedAmount}
          onChange={(e) => setDelegatedAmount(parseInt(e.target.value))}
          className="w-full accent-emerald-400"
        />

        {/* Rewards estimate */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-center">
            <Award className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Est. APR</p>
            <p className="text-sm font-mono font-bold text-emerald-300">{apr.toFixed(2)}%</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-center">
            <TrendingUp className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-400" />
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Annual</p>
            <p className="text-sm font-mono font-bold text-emerald-300">+{myRewards.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-3 text-center">
            <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-amber-400" />
            <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Unbond</p>
            <p className="text-sm font-mono font-bold text-amber-300">~1 epoch</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 text-center leading-relaxed">
        Numbers are illustrative; final tokenomics are under design in Milestone 4 of the Crosslink roadmap.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// STAGE 8: Attack Simulator — interactive 51% attack
// ─────────────────────────────────────────────────────────────────────────────

type AttackPhase = "idle" | "mining" | "reorging" | "rejected" | "succeeded";

export const AttackSimulatorStage = () => {
  const [hashrate, setHashrate] = useState(55);
  const [depth, setDepth] = useState(4);
  const [crosslinkOn, setCrosslinkOn] = useState(true);
  const [phase, setPhase] = useState<AttackPhase>("idle");
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sigma = 3; // protocol parameter

  const runAttack = () => {
    setPhase("mining");
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + (hashrate - 50) * 0.4 + 1;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("reorging");
          setTimeout(() => {
            if (crosslinkOn && depth >= sigma) {
              setPhase("rejected");
            } else if (!crosslinkOn) {
              setPhase("succeeded");
            } else {
              setPhase("rejected");
            }
          }, 900);
          return 100;
        }
        return next;
      });
    }, 80);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase("idle");
    setProgress(0);
  };

  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const result = (() => {
    if (phase === "rejected") {
      return {
        icon: ShieldCheck,
        color: "text-emerald-300",
        border: "border-emerald-500/50",
        bg: "bg-emerald-500/8",
        title: "Attack rejected by TFL",
        body: `Attacker's chain attempted to roll back ${depth} blocks, but blocks deeper than σ=${sigma} were BFT-final. Honest nodes reject the chain regardless of cumulative work.`,
      };
    }
    if (phase === "succeeded") {
      return {
        icon: AlertTriangle,
        color: "text-red-300",
        border: "border-red-500/50",
        bg: "bg-red-500/8",
        title: "Attack succeeded (PoW-only)",
        body: `With Crosslink disabled, the attacker's heavier chain replaces the honest tip. Recent transactions are reversed. This is the vulnerability Crosslink eliminates.`,
      };
    }
    return null;
  })();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm text-zinc-400 leading-relaxed"
      >
        Try it: launch a hostile reorg with adjustable hashrate and depth. Toggle Crosslink off to see how PoW-only Zcash would respond.
      </motion.p>

      {/* Controls */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 space-y-5">

        {/* Hashrate */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Attacker hashrate</p>
            <span className="font-mono text-sm text-red-300">{hashrate}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="80"
            value={hashrate}
            onChange={(e) => setHashrate(parseInt(e.target.value))}
            disabled={phase !== "idle"}
            className="w-full accent-red-400"
          />
        </div>

        {/* Reorg depth */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Reorg depth</p>
            <span className="font-mono text-sm text-red-300">{depth} blocks {depth >= sigma && <span className="text-emerald-400">(crosses σ)</span>}</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
            disabled={phase !== "idle"}
            className="w-full accent-red-400"
          />
        </div>

        {/* Crosslink toggle */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link2 className={`w-4 h-4 ${crosslinkOn ? "text-emerald-400" : "text-zinc-600"}`} />
            <p className="text-xs font-bold text-zinc-300">Crosslink (BFT finality)</p>
          </div>
          <button
            onClick={() => setCrosslinkOn(!crosslinkOn)}
            disabled={phase !== "idle"}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              crosslinkOn ? "bg-emerald-500/60" : "bg-zinc-700"
            }`}
          >
            <motion.div
              animate={{ x: crosslinkOn ? 20 : 2 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
            />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={runAttack}
            whileTap={{ scale: 0.97 }}
            disabled={phase !== "idle"}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
              phase !== "idle"
                ? "bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
            }`}
          >
            {phase === "idle" ? "▶ Launch attack" : phase === "mining" ? "⛏ mining private chain…" : phase === "reorging" ? "↻ broadcasting reorg…" : "complete"}
          </motion.button>
          <motion.button
            onClick={reset}
            whileTap={{ scale: 0.97 }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600"
          >
            Reset
          </motion.button>
        </div>

        {/* Progress */}
        {(phase === "mining" || phase === "reorging") && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Attacker private chain</span>
              <span className="font-mono">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-900 overflow-hidden">
              <motion.div
                animate={{ width: `${Math.min(100, progress)}%` }}
                className="h-full bg-red-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Chain visualization */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">Live chain</p>

        {/* Honest */}
        <div className="space-y-3">
          <div>
            <p className="text-[9px] text-amber-400/70 mb-1.5 uppercase tracking-wider">Honest PoW + BFT</p>
            <div className="flex items-center gap-1 overflow-x-auto">
              {Array.from({ length: 8 }, (_, i) => {
                const h = 2000 + i;
                const isFinal = crosslinkOn && i <= 8 - sigma - 1;
                return (
                  <div key={h} className="flex items-center gap-1 flex-shrink-0">
                    <MiniBlock height={h} status={isFinal ? "bft-final" : "pow"} small />
                    {i < 7 && <div className="w-2 h-px bg-zinc-700" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attacker (visible during/after attack) */}
          <AnimatePresence>
            {(phase === "mining" || phase === "reorging" || phase === "rejected" || phase === "succeeded") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[9px] text-red-400/80 mb-1.5 uppercase tracking-wider">Attacker private fork (depth {depth})</p>
                <div className="flex items-center gap-1 overflow-x-auto">
                  {Array.from({ length: 8 - depth }, (_, i) => (
                    <div key={`s${i}`} className="flex items-center gap-1 flex-shrink-0">
                      <MiniBlock height={2000+i} status="pending" small label="·" />
                      {i < (8-depth)-1 && <div className="w-2 h-px bg-zinc-800" />}
                    </div>
                  ))}
                  {Array.from({ length: depth + 1 }, (_, i) => {
                    const h = 2000 + (8 - depth) + i;
                    return (
                      <motion.div
                        key={`a${h}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: phase === "rejected" ? 0.3 : 1,
                          scale: 1,
                          x: phase === "rejected" ? -10 : 0,
                        }}
                        transition={{ delay: i*0.08 }}
                        className="flex items-center gap-1 flex-shrink-0"
                      >
                        <MiniBlock height={h} status="attacker" small />
                        {i < depth && <div className="w-2 h-px bg-red-500/40" />}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl border p-4 ${result.border} ${result.bg}`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <result.icon className={`w-5 h-5 ${result.color}`} />
              </motion.div>
              <div>
                <p className={`text-xs font-bold mb-1 ${result.color}`}>{result.title}</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{result.body}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
