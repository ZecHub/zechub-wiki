"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Shield, Lock, Eye, EyeOff, ArrowRight, Zap, CheckCircle,
  AlertTriangle, Database, Radio, Key, Cpu, GitBranch, X,
  Sparkles, Activity, Binary, Waves, CircleDot
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Pool = "transparent" | "sapling" | "orchard";

export interface StageConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export const STAGES: StageConfig[] = [
  {
    id: "pool-selector",
    title: "Choose Your Pools",
    subtitle: "Step 1 — Source & Destination",
    description: "Select where funds originate and where they land. Each pool has different privacy guarantees.",
  },
  {
    id: "amount-memo",
    title: "Set Amount & Memo",
    subtitle: "Step 2 — Transaction Details",
    description: "Add the transfer amount and an optional encrypted memo — only the recipient can decrypt it.",
  },
  {
    id: "zk-proof",
    title: "Zero-Knowledge Proof",
    subtitle: "Step 3 — Cryptographic Magic",
    description: "Watch the zk-SNARK proof generation. This proves validity without revealing any underlying data.",
  },
  {
    id: "on-chain",
    title: "On-Chain Footprint",
    subtitle: "Step 4 — What the World Sees",
    description: "This is the exact data a blockchain explorer or adversary observes. Compare shielded vs transparent.",
  },
  {
    id: "privacy-score",
    title: "Privacy Score",
    subtitle: "Step 5 — Your Privacy Analysis",
    description: "A breakdown of your transaction's privacy profile and recommendations.",
  },
];

// ─── Pool metadata ────────────────────────────────────────────────────────────

const POOL_META: Record<Pool, { label: string; tag: string; color: string; borderColor: string; bg: string; privacy: number; desc: string }> = {
  transparent: {
    label: "Transparent",
    tag: "t-addr",
    color: "text-red-400",
    borderColor: "border-red-500/40",
    bg: "bg-red-500/10",
    privacy: 0,
    desc: "Fully public. Anyone can see amounts, addresses, history.",
  },
  sapling: {
    label: "Sapling",
    tag: "zs-addr",
    color: "text-amber-400",
    borderColor: "border-amber-500/40",
    bg: "bg-amber-500/10",
    privacy: 70,
    desc: "Shielded via Groth16 zk-SNARKs. Amounts & memos encrypted.",
  },
  orchard: {
    label: "Orchard",
    tag: "u-addr",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    privacy: 100,
    desc: "Maximum privacy via Halo2 proofs. No trusted setup.",
  },
};

// ─── ZIP 317 fee calculation ──────────────────────────────────────────────────

function calculateZip317Fee(
  transparentInputs: number = 0,
  transparentOutputs: number = 0,
  shieldedActions: number = 1
): number {
  const baseFee = 10000;
  const marginalFee = 10000;
  const logicalActions = 1 + transparentInputs + transparentOutputs + shieldedActions;
  return baseFee + marginalFee * Math.max(0, logicalActions - 1);
}

// ─── Live ZEC price hook ──────────────────────────────────────────────────────

function useZecPrice() {
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
        if (!cancelled && data?.zcash?.usd) {
          setPrice(data.zcash.usd);
        }
      } catch {
        // silently fall back to null
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  return price;
}

// ─── Broadcast Modal (replaces alert) ────────────────────────────────────────

const BroadcastModal = ({ onClose }: { onClose: () => void }) => {
  const [phase, setPhase] = useState<"broadcasting" | "confirmed">("broadcasting");

  useEffect(() => {
    const t = setTimeout(() => setPhase("confirmed"), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.75)" }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="relative w-full max-w-sm rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0d1a12 0%, #0a1a0f 50%, #091209 100%)",
            border: "1px solid rgba(52,211,153,0.25)",
            boxShadow: "0 0 60px rgba(52,211,153,0.12), 0 0 120px rgba(52,211,153,0.06), inset 0 0 40px rgba(52,211,153,0.03)",
          }}
        >
          {/* Glowing top bar */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.6), transparent)" }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>

          <div className="p-8 flex flex-col items-center text-center gap-5">
            {/* Icon area */}
            <div className="relative w-20 h-20">
              {/* Orbital rings */}
              {phase === "broadcasting" && (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border border-emerald-400/20"
                      animate={{ scale: [1, 2.2 + i * 0.4], opacity: [0.6, 0] }}
                      transition={{ duration: 1.8, delay: i * 0.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  ))}
                </>
              )}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: phase === "confirmed"
                    ? "radial-gradient(circle, rgba(52,211,153,0.25) 0%, rgba(52,211,153,0.05) 100%)"
                    : "radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.05) 100%)",
                  border: phase === "confirmed" ? "1.5px solid rgba(52,211,153,0.5)" : "1.5px solid rgba(59,130,246,0.5)",
                  transition: "all 0.6s ease",
                }}
              >
                <AnimatePresence mode="wait">
                  {phase === "broadcasting" ? (
                    <motion.div
                      key="broadcasting"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.5 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="w-8 h-8 text-blue-400" />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="confirmed"
                      initial={{ opacity: 0, scale: 0.3, rotate: -15 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 14, stiffness: 200 }}
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Text */}
            <AnimatePresence mode="wait">
              {phase === "broadcasting" ? (
                <motion.div
                  key="btext"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-2"
                >
                  <p className="text-base font-bold text-blue-300">Broadcasting…</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">Submitting your shielded transaction to the Zcash network</p>
                  {/* Fake progress dots */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="ctext"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <p className="text-base font-bold text-emerald-300">Transaction Simulated!</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    In a real Zcash wallet, this would broadcast to the network with your selected privacy settings.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fake txid */}
            <AnimatePresence>
              {phase === "confirmed" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full px-4 py-2.5 rounded-xl text-center"
                  style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)" }}
                >
                  <p className="text-[9px] text-zinc-500 mb-1 uppercase tracking-widest">Simulated TXID</p>
                  <p className="font-mono text-[10px] text-emerald-400 break-all">a3f9c2e1...b7d40c88</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close CTA */}
            <AnimatePresence>
              {phase === "confirmed" && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl text-sm font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(52,211,153,0.2) 0%, rgba(16,185,129,0.15) 100%)",
                    border: "1px solid rgba(52,211,153,0.35)",
                    color: "#34d399",
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Done
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Stage 1: Pool Selector ───────────────────────────────────────────────────

export const PoolSelectorStage = ({
  fromPool, toPool, onFromChange, onToChange
}: {
  fromPool: Pool; toPool: Pool;
  onFromChange: (p: Pool) => void; onToChange: (p: Pool) => void;
}) => {
  const pools: Pool[] = ["transparent", "sapling", "orchard"];

  const PoolCard = ({
    pool, selected, onSelect, label
  }: { pool: Pool; selected: boolean; onSelect: () => void; label: string }) => {
    const meta = POOL_META[pool];
    return (
      <motion.button
        onClick={onSelect}
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className={`relative w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer overflow-hidden
          ${selected ? `${meta.borderColor} ${meta.bg}` : "border-zinc-700/50 bg-zinc-900/40 hover:bg-zinc-800/40"}`}
      >
        {/* Shimmer on selected */}
        {selected && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `linear-gradient(105deg, transparent 40%, ${
                pool === "transparent" ? "rgba(248,113,113,0.15)" :
                pool === "sapling" ? "rgba(251,191,36,0.15)" :
                "rgba(52,211,153,0.15)"
              } 60%, transparent 70%)`,
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
          />
        )}
        {selected && (
          <motion.div
            layoutId={`selected-${label}`}
            className={`absolute inset-0 rounded-2xl ${meta.bg} opacity-60`}
          />
        )}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <span className={`font-bold text-sm ${selected ? meta.color : "text-zinc-400"}`}>{meta.label}</span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">{meta.tag}</span>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">{meta.desc}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800">
              <motion.div
                className={`h-full rounded-full ${pool === "transparent" ? "bg-red-400" : pool === "sapling" ? "bg-amber-400" : "bg-emerald-400"}`}
                initial={{ width: 0 }}
                animate={{ width: `${meta.privacy}%` }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                style={{ boxShadow: selected ? `0 0 8px ${pool === "transparent" ? "#f87171" : pool === "sapling" ? "#fbbf24" : "#34d399"}60` : "none" }}
              />
            </div>
            <span className="text-[10px] text-zinc-500">{meta.privacy}%</span>
          </div>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 14, stiffness: 260 }}
            className="absolute top-3 right-3"
          >
            <CheckCircle className={`w-4 h-4 ${meta.color}`} />
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Flow diagram */}
      <div className="flex flex-col md:flex-row items-center gap-3 justify-center">
        {(["transparent", "sapling", "orchard"] as Pool[]).map((p, i) => {
          const meta = POOL_META[p];
          const isFrom = fromPool === p;
          const isTo = toPool === p;
          return (
            <motion.div
              key={p}
              className={`px-5 py-3 rounded-2xl border font-mono text-sm font-bold transition-all
                ${isFrom ? `${meta.borderColor} ${meta.color} ${meta.bg}` : isTo ? `${meta.borderColor} ${meta.color} ${meta.bg} opacity-70` : "border-zinc-800 text-zinc-600"}`}
              animate={{ scale: isFrom || isTo ? 1.05 : 1 }}
              style={{ boxShadow: (isFrom || isTo) ? `0 0 20px ${p === "transparent" ? "rgba(248,113,113,0.12)" : p === "sapling" ? "rgba(251,191,36,0.12)" : "rgba(52,211,153,0.12)"}` : "none" }}
            >
              {meta.label}
              {isFrom && <span className="ml-2 text-[10px] opacity-70">FROM</span>}
              {isTo && <span className="ml-2 text-[10px] opacity-70">TO</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Selectors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Database className="w-3 h-3" /> From Pool
          </p>
          <div className="space-y-2">
            {pools.map(p => (
              <PoolCard key={p} pool={p} selected={fromPool === p} onSelect={() => onFromChange(p)} label="from" />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Radio className="w-3 h-3" /> To Pool
          </p>
          <div className="space-y-2">
            {pools.map(p => (
              <PoolCard key={p} pool={p} selected={toPool === p} onSelect={() => onToChange(p)} label="to" />
            ))}
          </div>
        </div>
      </div>

      {/* Warning for transparent */}
      <AnimatePresence>
        {(fromPool === "transparent" || toPool === "transparent") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            </motion.div>
            <p className="text-xs text-amber-300 leading-relaxed">
              Using a transparent pool exposes addresses and amounts on-chain. Consider using Orchard for full privacy.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Stage 2: Amount & Memo ───────────────────────────────────────────────────

export const AmountMemoStage = ({
  amount, memo, onAmountChange, onMemoChange, toPool, fromPool
}: {
  amount: number; memo: string;
  onAmountChange: (n: number) => void;
  onMemoChange: (s: string) => void;
  toPool: Pool;
  fromPool: Pool;
}) => {
  const memoBytes = new TextEncoder().encode(memo).length;
  const maxBytes = 512;
  const memoAllowed = toPool !== "transparent";
  const zecPrice = useZecPrice();

  const feeZat = calculateZip317Fee(
    fromPool === "transparent" ? 1 : 0,
    toPool === "transparent" ? 1 : 0,
    toPool !== "transparent" ? 1 : 0
  );
  const feeZEC = (feeZat / 100_000_000).toFixed(8);

  const usdEstimate = zecPrice !== null
    ? (amount * zecPrice).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : null;

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Amount */}
      <div>
        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 block">
          Amount (ZEC)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            min={0.00001}
            step={0.1}
            onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
            className="w-full bg-zinc-900/60 border border-zinc-700 rounded-2xl px-5 py-4 text-3xl font-mono text-emerald-300 outline-none focus:border-emerald-500/50 transition-colors"
          />
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-lg">ZEC</span>
        </div>
        <p className="mt-2 text-xs text-zinc-500">
          {usdEstimate !== null
            ? <>≈ <span className="text-zinc-400">${usdEstimate} USD</span> <span className="text-zinc-600">(live · ${zecPrice?.toLocaleString("en-US", { minimumFractionDigits: 2 })} / ZEC)</span></>
            : <span className="text-zinc-600">Fetching live price…</span>
          }
        </p>
      </div>

      {/* Slider */}
      <div>
        <input
          type="range"
          min={0.001}
          max={100}
          step={0.001}
          value={amount}
          onChange={(e) => onAmountChange(parseFloat(e.target.value))}
          className="w-full accent-emerald-400 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>0.001</span><span>50</span><span>100</span>
        </div>
      </div>

      {/* Memo */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-3 h-3" /> Encrypted Memo
          </label>
          {!memoAllowed && (
            <span className="text-[10px] text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Not available for transparent</span>
          )}
        </div>
        <textarea
          value={memo}
          onChange={(e) => onMemoChange(e.target.value.slice(0, maxBytes))}
          disabled={!memoAllowed}
          rows={4}
          placeholder={memoAllowed ? "Private message (only recipient can read this)..." : "Memos unavailable for transparent transactions"}
          className={`w-full rounded-2xl px-5 py-4 text-sm font-mono resize-none outline-none transition-colors border
            ${memoAllowed
              ? "bg-zinc-900/60 border-zinc-700 text-zinc-200 focus:border-emerald-500/50 placeholder:text-zinc-600"
              : "bg-zinc-950/40 border-zinc-800 text-zinc-600 cursor-not-allowed placeholder:text-zinc-700"
            }`}
        />
        {memoAllowed && (
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-zinc-600">End-to-end encrypted with ChaCha20-Poly1305</p>
            <span className={`text-xs ${memoBytes > maxBytes * 0.9 ? "text-amber-400" : "text-zinc-600"}`}>
              {memoBytes}/{maxBytes} bytes
            </span>
          </div>
        )}
      </div>

      {/* Fee estimate */}
      <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Zap className="w-3 h-3 text-yellow-400" /> Estimated Fee
        </div>
        <span className="font-mono text-xs text-yellow-300">
          {feeZEC} ZEC <span className="text-zinc-500">(ZIP 317)</span>
        </span>
      </div>
    </div>
  );
};

// ─── Hex Stream Row ───────────────────────────────────────────────────────────

const HexStreamRow = ({ delay, color }: { delay: number; color: string }) => {
  const [hex, setHex] = useState(() =>
    Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  );

  useEffect(() => {
    const t = setInterval(() => {
      setHex(Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
    }, 900 + delay * 200);
    return () => clearInterval(t);
  }, [delay]);

  return (
    <motion.div
      animate={{ opacity: [0.25, 0.7, 0.25] }}
      transition={{ duration: 2.8, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`font-mono text-[9px] leading-relaxed break-all tracking-wider ${color}`}
    >
      {hex}
    </motion.div>
  );
};

// ─── Stage 3: ZK Proof Visualization ─────────────────────────────────────────

export const ZkProofStage = ({ fromPool, toPool }: { fromPool: Pool; toPool: Pool }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: "Witness Generation", icon: Key, desc: "Building cryptographic witness from private inputs", color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/40", glow: "rgba(139,92,246,0.3)" },
    { label: "Constraint System", icon: GitBranch, desc: "Encoding arithmetic constraints (R1CS / Plonk)", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/40", glow: "rgba(56,189,248,0.3)" },
    { label: "Polynomial Commit", icon: Cpu, desc: "Generating polynomial commitments over the circuit", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/40", glow: "rgba(251,191,36,0.3)" },
    { label: "Proof Output", icon: Shield, desc: "zk-SNARK proof ready — validity without disclosure", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/40", glow: "rgba(52,211,153,0.3)" },
  ];
  const shielded = toPool !== "transparent" || fromPool !== "transparent";

  useEffect(() => {
    if (!shielded) return;
    const t = setInterval(() => setPhase(p => (p + 1) % phases.length), 1800);
    return () => clearInterval(t);
  }, [shielded]);

  if (!shielded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <EyeOff className="w-12 h-12 text-zinc-600" />
        <p className="text-zinc-500 text-sm text-center max-w-xs">
          No zk-SNARK proof needed for fully transparent transactions. All data is public.
        </p>
      </div>
    );
  }

  const currentPhase = phases[phase];

  return (
    <div className="space-y-8">
      {/* Circuit diagram */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, #0e1a2e 0%, #0b1520 40%, #0f1a10 100%)",
          border: "1px solid rgba(99,102,241,0.2)",
          boxShadow: `0 0 40px rgba(99,102,241,0.06), inset 0 0 60px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Animated grid lines */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Moving scan line */}
        <motion.div
          className="absolute left-0 right-0 h-px opacity-30"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Phase nodes */}
        <div className="relative z-10 grid grid-cols-4 gap-3 sm:gap-4 mb-6">
          {phases.map((ph, i) => {
            const Icon = ph.icon;
            const active = i === phase;
            const done = i < phase;
            return (
              <div key={ph.label} className="flex flex-col items-center gap-2">
                {/* Connector line */}
                {i > 0 && (
                  <div className="absolute" style={{ display: "none" }} />
                )}
                <motion.div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all
                    ${done ? `${ph.border} ${ph.bg}` : active ? `${ph.border} ${ph.bg}` : "border-zinc-700/50 bg-zinc-900/60"}`}
                  animate={{
                    scale: active ? [1, 1.08, 1] : done ? 1 : 0.95,
                    boxShadow: active ? [`0 0 0px ${ph.glow}`, `0 0 20px ${ph.glow}`, `0 0 0px ${ph.glow}`] : "none",
                  }}
                  transition={{ duration: active ? 1.2 : 0.4, repeat: active ? Infinity : 0 }}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${done ? ph.color : active ? ph.color : "text-zinc-600"}`} />
                </motion.div>
                <p className="text-[8px] sm:text-[9px] text-center text-zinc-500 leading-tight">{ph.label}</p>
                <div className="h-3 flex items-center justify-center">
                  {active && (
                    <motion.div
                      className={`w-1.5 h-1.5 rounded-full ${ph.color.replace("text-", "bg-")}`}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                  )}
                  {done && <CheckCircle className={`w-3 h-3 ${ph.color}`} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Phase connector bar */}
        <div className="relative z-10 mb-5 flex items-center gap-1">
          {phases.map((ph, i) => (
            <motion.div
              key={i}
              className="flex-1 h-0.5 rounded-full"
              animate={{
                backgroundColor: i <= phase ? ph.color.replace("text-", "#").replace("text-violet-400", "#a78bfa").replace("text-sky-400", "#38bdf8").replace("text-amber-400", "#fbbf24").replace("text-emerald-400", "#34d399") : "#27272a",
                opacity: i <= phase ? 1 : 0.3,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        {/* Active phase description */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative z-10 text-center mb-5 px-2"
          >
            <p className={`text-xs ${currentPhase.color} font-medium`}>{currentPhase.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Hex streams — color-coded per phase */}
        <div className="relative z-10 rounded-xl p-3 overflow-hidden space-y-1.5"
          style={{ background: "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <motion.div
              className={`w-1.5 h-1.5 rounded-full ${currentPhase.color.replace("text-", "bg-")}`}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, repeat: Infinity }}
            />
            <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-mono">proof stream</span>
          </div>
          {[0, 1, 2].map((row) => (
            <HexStreamRow
              key={`${phase}-${row}`}
              delay={row * 0.3}
              color={
                phase === 0 ? "text-violet-400/60" :
                phase === 1 ? "text-sky-400/60" :
                phase === 2 ? "text-amber-400/50" :
                "text-emerald-400/60"
              }
            />
          ))}
        </div>
      </div>

      {/* What's hidden vs visible */}
      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
          whileHover={{ borderColor: "rgba(52,211,153,0.35)", backgroundColor: "rgba(52,211,153,0.07)" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <EyeOff className="w-3.5 h-3.5" /> Kept Private
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            {["Sender address", "Recipient address", "Amount transferred", "Memo contents", "Spending key"].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/40"
          whileHover={{ borderColor: "rgba(113,113,122,0.6)", backgroundColor: "rgba(63,63,70,0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-semibold text-zinc-400 mb-3 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5" /> Publicly Visible
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-500">
            {["Transaction type (shielded)", "Block height", "Fee amount", "Proof validity (true/false)", "Nullifier hash"].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 + 0.1 }}
                className="flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-500/60" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Stage 4: On-Chain Footprint ──────────────────────────────────────────────

export const OnChainStage = ({
  fromPool, toPool, amount, memo
}: {
  fromPool: Pool; toPool: Pool; amount: number; memo: string;
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const fromMeta = POOL_META[fromPool];
  const toMeta = POOL_META[toPool];
  const isShielded = toPool !== "transparent";
  const isFullyShielded = fromPool !== "transparent" && toPool !== "transparent";

  const shieldedOutput = `{
  "txid": "a3f9...c7e2",
  "version": 5,
  "type": "${toPool === "orchard" ? "Orchard" : toPool === "sapling" ? "Sapling" : "Mixed"} Shielded",
  "fee": "0.00001",
  "vin": [],
  "vout": [],
  "orchard_actions": [
    {
      "nullifier": "0x8c3f...a12b",
      "commitment": "0x4d7e...3f90",
      "ephemeral_key": "0xb2a1...9d4c",
      "enc_ciphertext": "<encrypted>",
      "out_ciphertext": "<encrypted>"
    }
  ],
  "binding_sig": "0xffab...1234"
}`;

  const transparentOutput = `{
  "txid": "b8c2...d941",
  "version": 4,
  "type": "Transparent",
  "fee": "0.00001",
  "vin": [
    { "address": "t1Xyz...789", "value": ${amount.toFixed(5)} }
  ],
  "vout": [
    { "address": "t1Abc...456", "value": ${(amount - 0.00001).toFixed(5)} }
  ],
  "memo": "${memo || "(none)"}"
}`;

  return (
    <div className="space-y-6">
      {/* Toggle */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setShowComparison(false)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all
            ${!showComparison ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "text-zinc-500 hover:text-zinc-400"}`}
        >
          Your Transaction
        </button>
        <button
          onClick={() => setShowComparison(true)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all
            ${showComparison ? "bg-red-500/20 text-red-400 border border-red-500/40" : "text-zinc-500 hover:text-zinc-400"}`}
        >
          Compare: Transparent
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showComparison ? (
          <motion.div
            key="shielded"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="rounded-2xl overflow-hidden border border-zinc-800"
          >
            <div className={`px-5 py-3 border-b border-zinc-800 flex items-center justify-between
              ${isFullyShielded ? "bg-emerald-950/40" : "bg-amber-950/30"}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isFullyShielded ? "bg-emerald-400" : "bg-amber-400"}`} />
                <span className="text-xs font-mono text-zinc-400">blockchain_explorer.json</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                ${isFullyShielded ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                {isFullyShielded ? "Fully Shielded" : "Partially Shielded"}
              </span>
            </div>
            <pre className="p-5 text-[11px] font-mono text-emerald-300/80 overflow-x-auto leading-relaxed bg-zinc-950">
              {isShielded ? shieldedOutput : transparentOutput}
            </pre>
          </motion.div>
        ) : (
          <motion.div
            key="transparent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="rounded-2xl overflow-hidden border border-red-800/40"
          >
            <div className="px-5 py-3 border-b border-red-800/40 bg-red-950/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-xs font-mono text-zinc-400">blockchain_explorer.json</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-red-500/20 text-red-400">
                Fully Exposed
              </span>
            </div>
            <pre className="p-5 text-[11px] font-mono text-red-300/80 overflow-x-auto leading-relaxed bg-zinc-950">
              {transparentOutput}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exposure legend */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Amount", hidden: isShielded, icon: EyeOff },
          { label: "Addresses", hidden: isFullyShielded, icon: EyeOff },
          { label: "Memo", hidden: isShielded && memo.length > 0, icon: Lock },
        ].map(({ label, hidden, icon: Icon }) => (
          <motion.div
            key={label}
            whileHover={{ scale: 1.03, y: -1 }}
            className={`p-3 rounded-xl border text-center transition-colors
              ${hidden ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}
          >
            <Icon className={`w-4 h-4 mx-auto mb-1 ${hidden ? "text-emerald-400" : "text-red-400"}`} />
            <p className="text-[10px] text-zinc-400">{label}</p>
            <p className={`text-[10px] font-semibold ${hidden ? "text-emerald-400" : "text-red-400"}`}>
              {hidden ? "Hidden" : "Visible"}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── Stage 5: Privacy Score ───────────────────────────────────────────────────

export const PrivacyScoreStage = ({
  fromPool, toPool, amount, memo
}: {
  fromPool: Pool; toPool: Pool; amount: number; memo: string;
}) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const score = Math.round(
    (POOL_META[fromPool].privacy * 0.4) +
    (POOL_META[toPool].privacy * 0.4) +
    (memo.trim().length > 0 && toPool !== "transparent" ? 20 : 0)
  );

  const factors = [
    {
      label: "Source Pool",
      value: POOL_META[fromPool].label,
      score: Math.round(POOL_META[fromPool].privacy * 0.4),
      max: 40,
      color: POOL_META[fromPool].color,
    },
    {
      label: "Destination Pool",
      value: POOL_META[toPool].label,
      score: Math.round(POOL_META[toPool].privacy * 0.4),
      max: 40,
      color: POOL_META[toPool].color,
    },
    {
      label: "Encrypted Memo",
      value: memo.trim().length > 0 && toPool !== "transparent" ? "Included" : "None",
      score: memo.trim().length > 0 && toPool !== "transparent" ? 20 : 0,
      max: 20,
      color: "text-blue-400",
    },
  ];

  const grade = score >= 90 ? "A+" : score >= 70 ? "B" : score >= 40 ? "C" : "D";
  const gradeColor = score >= 90 ? "text-emerald-400" : score >= 70 ? "text-amber-400" : score >= 40 ? "text-orange-400" : "text-red-400";
  const glowColor = score >= 90 ? "rgba(52,211,153,0.35)" : score >= 70 ? "rgba(251,191,36,0.35)" : score >= 40 ? "rgba(249,115,22,0.35)" : "rgba(248,113,113,0.35)";
  const strokeColor = score >= 90 ? "#34d399" : score >= 70 ? "#fbbf24" : score >= 40 ? "#f97316" : "#f87171";
  const recommendation = score >= 90
    ? "Excellent! Your transaction is highly private using Zcash's full shielding capabilities."
    : score >= 70
    ? "Good privacy. Consider using Orchard on both ends for maximum protection."
    : score >= 40
    ? "Moderate privacy. At least one pool is exposed. Upgrade to shielded pools."
    : "Low privacy. Both sender and receiver are fully exposed on-chain. Use shielded pools.";

  return (
    <>
      {showBroadcastModal && <BroadcastModal onClose={() => setShowBroadcastModal(false)} />}

      <div className="space-y-8 max-w-lg mx-auto">
        {/* Score ring */}
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            {/* Glow ring behind */}
            <motion.div
              className="absolute inset-2 rounded-full"
              animate={{ boxShadow: [`0 0 0px ${glowColor}`, `0 0 30px ${glowColor}`, `0 0 0px ${glowColor}`] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle cx="70" cy="70" r="60" fill="none" stroke="#27272a" strokeWidth="12" />
              {/* Background glow arc */}
              <circle cx="70" cy="70" r="60" fill="none" strokeWidth="16"
                stroke={strokeColor} opacity="0.07"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset="0"
              />
              <motion.circle
                cx="70" cy="70" r="60"
                fill="none"
                strokeWidth="12"
                strokeLinecap="round"
                stroke={strokeColor}
                strokeDasharray={`${2 * Math.PI * 60}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - score / 100) }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                style={{ filter: `drop-shadow(0 0 6px ${strokeColor}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className={`text-4xl font-black ${gradeColor}`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", damping: 12, stiffness: 220 }}
                style={{ textShadow: `0 0 20px ${strokeColor}60` }}
              >
                {grade}
              </motion.span>
              <span className="text-xs text-zinc-500">{score}/100</span>
            </div>
          </div>
        </div>

        {/* Factors */}
        <div className="space-y-3">
          {factors.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400">{f.label} <span className={`${f.color} font-medium`}>({f.value})</span></span>
                <span className="text-zinc-500 font-mono">{f.score}/{f.max}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${f.score >= f.max * 0.9 ? "bg-emerald-400" : f.score >= f.max * 0.5 ? "bg-amber-400" : "bg-red-400"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(f.score / f.max) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                  style={{
                    boxShadow: f.score >= f.max * 0.9 ? "0 0 8px rgba(52,211,153,0.5)" : f.score >= f.max * 0.5 ? "0 0 8px rgba(251,191,36,0.5)" : "0 0 8px rgba(248,113,113,0.5)"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recommendation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className={`p-4 rounded-xl border text-xs leading-relaxed
            ${score >= 70 ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-amber-500/5 border-amber-500/20 text-amber-300"}`}
        >
          <p className="font-semibold mb-1 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5" /> Recommendation
          </p>
          {recommendation}
        </motion.div>

        {/* Simulate button*/}
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(52,211,153,0.25)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowBroadcastModal(true)}
          className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          style={{ boxShadow: "0 0 20px rgba(52,211,153,0.15)" }}
        >
          <Zap className="w-4 h-4" />
          Simulate Broadcast
        </motion.button>
      </div>
    </>
  );
};