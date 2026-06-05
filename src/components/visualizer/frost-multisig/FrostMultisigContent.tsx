"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  KeyRound,
  Users,
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Puzzle,
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Fingerprint,
  Eye,
  EyeOff,
  Building2,
  Wallet,
  Home,
  Handshake,
  Sparkles,
  PenTool,
} from "lucide-react";
import { useEffect, useState } from "react";

export type StageType =
  | "single-key"
  | "dkg"
  | "signing"
  | "privacy"
  | "use-cases";

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
    id: "single-key",
    title: "The Single Key Problem",
    subtitle: "One Point of Failure",
    description:
      "A single private key controls everything. If it's stolen or lost, the funds are gone. What if we could split that power?",
    type: "single-key",
    link: "https://frost.zfnd.org/frost.html",
    linkText: "Why Threshold Signatures?",
  },
  {
    id: "dkg",
    title: "Key Generation (DKG)",
    subtitle: "Distributed Key Generation",
    description:
      "n participants jointly create the key. Each holds only a share, and the full private key is never assembled in one place.",
    type: "dkg",
    link: "https://www.rfc-editor.org/rfc/rfc9591.html",
    linkText: "Read RFC 9591 (FROST)",
  },
  {
    id: "signing",
    title: "Threshold Signing",
    subtitle: "Any t-of-n Can Sign",
    description:
      "Pick who signs. If at least t participants cooperate, their partial signatures combine into one valid Schnorr signature. Fewer than t? It fails.",
    type: "signing",
    link: "https://github.com/ZcashFoundation/frost",
    linkText: "ZF FROST Implementation",
  },
  {
    id: "privacy",
    title: "Private & Secure on Zcash",
    subtitle: "Indistinguishable Signatures",
    description:
      "The final signature looks exactly like an ordinary single-key Zcash signature. Re-randomized FROST authorizes Orchard spends, and no one can tell it came from a group.",
    type: "privacy",
    link: "https://frost.zfnd.org/zcash/technical-details.html",
    linkText: "FROST + Zcash Technical Details",
  },
  {
    id: "use-cases",
    title: "Real-World Use Cases",
    subtitle: "Where Threshold Custody Shines",
    description:
      "From DAO treasuries to family savings, FROST distributes trust without sacrificing privacy or creating a single point of failure.",
    type: "use-cases",
    link: "https://frost.zfnd.org/",
    linkText: "Explore the FROST Book",
  },
];

export const PARTICIPANT_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Dave",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
];

const PARTICIPANT_COLORS = [
  "from-blue-500 to-blue-700",
  "from-purple-500 to-purple-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-pink-500 to-pink-700",
  "from-cyan-500 to-cyan-700",
  "from-indigo-500 to-indigo-700",
  "from-rose-500 to-rose-700",
  "from-teal-500 to-teal-700",
  "from-orange-500 to-orange-700",
];

// ----------------------------------------------------------------------------
// Stage 1: The Single Key Problem
// ----------------------------------------------------------------------------
const SingleKeyAnimation = () => {
  const [compromised, setCompromised] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCompromised((prev) => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <motion.div
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white"
            animate={{
              scale: compromised ? [1, 1.05, 1] : 1,
              boxShadow: compromised
                ? "0 0 50px rgba(239, 68, 68, 0.7)"
                : "0 0 25px rgba(245, 158, 11, 0.5)",
              rotate: compromised ? [0, -4, 4, -2, 0] : 0,
            }}
            transition={{ duration: 1 }}
          >
            <KeyRound className="w-14 h-14 md:w-20 md:h-20" />
          </motion.div>

          <AnimatePresence>
            {compromised && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-3 -right-3 w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500 flex items-center justify-center border-2 border-background"
              >
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          className="text-sm md:text-base font-semibold text-center"
          animate={{ color: compromised ? "#f87171" : "#9ca3af" }}
        >
          {compromised
            ? "Key stolen or lost → everything is gone."
            : "One person holds the entire private key."}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          {
            icon: AlertTriangle,
            label: "Theft",
            desc: "One hack drains all funds",
            color: "text-red-400 bg-red-500/10 border-red-500/30",
          },
          {
            icon: XCircle,
            label: "Loss",
            desc: "Lose the key, lose everything",
            color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
          },
          {
            icon: ShieldAlert,
            label: "Coercion",
            desc: "A single signer can be pressured",
            color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          },
        ].map((risk) => {
          const Icon = risk.icon;
          return (
            <div
              key={risk.label}
              className={`p-3 md:p-4 rounded-lg border text-center ${risk.color}`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-2" />
              <div className="text-sm md:text-base font-semibold text-foreground">
                {risk.label}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {risk.desc}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 md:p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center">
        <p className="text-sm md:text-base text-foreground">
          Even classic multisig has trade-offs.{" "}
          <span className="text-blue-400 font-semibold">FROST</span> (Flexible
          Round-Optimized Schnorr Threshold signatures) splits one key into
          shares, so no single person ever holds the whole thing.
        </p>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stage 2: Distributed Key Generation (interactive n / t)
// ----------------------------------------------------------------------------
interface InteractiveProps {
  n: number;
  t: number;
  setN: (n: number) => void;
  setT: (t: number) => void;
  signers: number[];
  toggleSigner: (i: number) => void;
}

const DKGAnimation = ({ n, t, setN, setT }: InteractiveProps) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Participants (n)
            </label>
            <span className="text-lg md:text-xl font-bold text-blue-400">
              {n}
            </span>
          </div>
          <input
            type="range"
            min={3}
            max={10}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer"
            aria-label="Total participants"
          />
        </div>

        <div className="p-4 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm md:text-base font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Threshold (t)
            </label>
            <span className="text-lg md:text-xl font-bold text-emerald-400">
              {t}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={n}
            value={t}
            onChange={(e) => setT(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
            aria-label="Signing threshold"
          />
        </div>
      </div>

      <div className="text-center text-sm md:text-base text-muted-foreground">
        <span className="font-semibold text-foreground">
          {t}-of-{n}
        </span>{" "}
        scheme: any {t} can sign, and you can lose up to{" "}
        <span className="font-semibold text-emerald-400">{n - t}</span> share
        {n - t === 1 ? "" : "s"} and still be safe.
      </div>

      {/* Key shares */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {Array.from({ length: n }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br ${
                PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length]
              } flex items-center justify-center text-white`}
            >
              <Puzzle className="w-7 h-7 md:w-8 md:h-8" />
              <motion.div
                className="absolute inset-0 rounded-xl border-2 border-white/40"
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            </div>
            <span className="text-xs md:text-sm text-muted-foreground">
              {PARTICIPANT_NAMES[i]}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="p-3 md:p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
        <p className="text-sm md:text-base text-foreground">
          Each participant gets a <span className="font-semibold">key share</span>{" "}
          via Distributed Key Generation. Built on{" "}
          <span className="text-emerald-400 font-semibold">
            verifiable secret sharing
          </span>
          , so the full private key is never created in one place.
        </p>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stage 3: Threshold Signing (interactive, the core)
// ----------------------------------------------------------------------------
const SigningAnimation = ({ n, t, signers, toggleSigner }: InteractiveProps) => {
  const [signed, setSigned] = useState(false);
  const selectedCount = signers.length;
  const isValid = selectedCount >= t;

  // Reset the result whenever the selection or threshold changes.
  useEffect(() => {
    setSigned(false);
  }, [signers, t, n]);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center text-sm md:text-base">
        <span className="text-muted-foreground">Tap participants to sign: </span>
        <span className="font-semibold text-foreground">
          {selectedCount}
        </span>
        <span className="text-muted-foreground"> of </span>
        <span className="font-semibold text-emerald-400">{t}</span>
        <span className="text-muted-foreground"> required</span>
      </div>

      {/* Participant cards */}
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {Array.from({ length: n }).map((_, i) => {
          const isSelected = signers.includes(i);
          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => toggleSigner(i)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors ${
                isSelected
                  ? "border-emerald-400 bg-emerald-500/15"
                  : "border-border bg-card/40 hover:border-border/80"
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${
                  PARTICIPANT_COLORS[i % PARTICIPANT_COLORS.length]
                } flex items-center justify-center text-white`}
              >
                {isSelected ? (
                  <UserCheck className="w-6 h-6 md:w-7 md:h-7" />
                ) : (
                  <Users className="w-6 h-6 md:w-7 md:h-7" />
                )}
                {isSelected && (
                  <motion.div
                    layoutId={`sig-ring-${i}`}
                    className="absolute inset-0 rounded-full border-2 border-emerald-300"
                  />
                )}
              </div>
              <span className="text-xs md:text-sm text-foreground">
                {PARTICIPANT_NAMES[i]}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Sign button */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={() => setSigned(true)}
          disabled={selectedCount === 0}
          whileHover={{ scale: selectedCount === 0 ? 1 : 1.04 }}
          whileTap={{ scale: selectedCount === 0 ? 1 : 0.96 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <PenTool className="w-5 h-5" />
          Sign Transaction
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {signed && (
          <motion.div
            key={isValid ? "valid" : "failed"}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className={`p-4 md:p-6 rounded-xl border-2 text-center ${
              isValid
                ? "bg-emerald-500/10 border-emerald-500/40"
                : "bg-red-500/10 border-red-500/40"
            }`}
          >
            {isValid ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-3">
                  {signers.slice(0, t).map((s, idx) => (
                    <motion.div
                      key={s}
                      initial={{ x: (idx - 1) * 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.12 }}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${
                        PARTICIPANT_COLORS[s % PARTICIPANT_COLORS.length]
                      } flex items-center justify-center -ml-2 border-2 border-background`}
                    >
                      <Fingerprint className="w-4 h-4 text-white" />
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: t * 0.12 }}
                  >
                    <ArrowRight className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: t * 0.12 + 0.1 }}
                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center"
                  >
                    <CheckCircle className="w-6 h-6 text-white" />
                  </motion.div>
                </div>
                <p className="text-emerald-400 font-bold text-base md:text-lg">
                  Valid Signature
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {selectedCount} partial signatures combined into one Schnorr
                  signature.
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 font-bold text-base md:text-lg">
                  Signing Failed
                </p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  Only {selectedCount} signed, so the threshold of {t}{" "}
                  wasn&apos;t met. Stealing fewer than {t} shares is not enough.
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!signed && (
        <div className="p-3 md:p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
          <p className="text-xs md:text-sm text-foreground">
            <span className="font-semibold text-amber-400">Try it:</span> select{" "}
            <span className="font-semibold">{t - 1}</span> to see it fail, then{" "}
            <span className="font-semibold">{t}</span> to see it succeed.
          </p>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stage 4: Privacy & Security on Zcash
// ----------------------------------------------------------------------------
const PrivacyAnimation = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRevealed((prev) => !prev);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        {/* Group of signers */}
        <div className="flex -space-x-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br ${PARTICIPANT_COLORS[i]} flex items-center justify-center text-white border-2 border-background`}
            >
              <UserCheck className="w-6 h-6" />
            </div>
          ))}
        </div>

        <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
        </motion.div>

        {/* The signature blob */}
        <div className="relative">
          <motion.div
            className="px-5 py-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white font-mono text-xs md:text-sm flex items-center gap-2"
            animate={{
              boxShadow: revealed
                ? "0 0 30px rgba(99, 102, 241, 0.6)"
                : "0 0 15px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Fingerprint className="w-5 h-5" />
            <span>sig: 0x8f3a…c1d9</span>
          </motion.div>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            {revealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Looks single-key
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> On-chain view
              </>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-sm md:text-base text-foreground max-w-xl mx-auto">
        A FROST signature is <span className="font-semibold text-indigo-400">indistinguishable</span>{" "}
        from an ordinary single-key signature. Observers can&apos;t tell a group produced it,
        or how many signers there were.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          {
            icon: Sparkles,
            title: "Schnorr Output",
            desc: "One compact signature, not a stack of them",
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
          },
          {
            icon: Lock,
            title: "Orchard Spends",
            desc: "Re-randomized FROST authorizes shielded spends",
            color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
          },
          {
            icon: Shield,
            title: "No Metadata Leak",
            desc: "Group size & policy stay private",
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className={`p-3 md:p-4 rounded-lg border ${c.color}`}>
              <Icon className="w-5 h-5 md:w-6 md:h-6 mb-2" />
              <div className="text-sm md:text-base font-semibold text-foreground">
                {c.title}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">{c.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stage 5: Use Cases
// ----------------------------------------------------------------------------
const UseCasesAnimation = () => {
  const cases = [
    {
      icon: Building2,
      title: "DAO Treasury",
      desc: "Multiple stewards approve spends, so no single admin controls the funds.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      icon: Wallet,
      title: "Exchange / Custody",
      desc: "Spread signing across teams and devices to resist insider theft.",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: Home,
      title: "Family Savings",
      desc: "Shared funds where any 2 of 3 family members can authorize a payment.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Handshake,
      title: "Secure Escrow",
      desc: "Buyer, seller, and arbiter; any two release the funds.",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
      {cases.map((c, idx) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12 }}
            whileHover={{ scale: 1.03 }}
            className="p-4 md:p-6 rounded-xl bg-card/50 border border-border flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white flex-shrink-0`}
            >
              <Icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <div className="text-base md:text-lg font-semibold text-foreground mb-1">
                {c.title}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {c.desc}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------------
// Stage dispatcher
// ----------------------------------------------------------------------------
interface StageContentProps {
  stage: Stage;
  isAnimating: boolean;
  interactive: InteractiveProps;
}

export const StageContent = ({ stage, interactive }: StageContentProps) => {
  const renderContent = () => {
    switch (stage.type) {
      case "single-key":
        return <SingleKeyAnimation />;
      case "dkg":
        return <DKGAnimation {...interactive} />;
      case "signing":
        return <SigningAnimation {...interactive} />;
      case "privacy":
        return <PrivacyAnimation />;
      case "use-cases":
        return <UseCasesAnimation />;
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
        {/* Stage Header */}
        <div className="text-center mb-8 md:mb-12 px-4">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs md:text-sm text-blue-400 font-medium mb-2"
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

        {/* Animated Content */}
        <div className="max-w-4xl mx-auto px-4">{renderContent()}</div>

        {/* Learn More Link */}
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
            className="inline-flex items-center gap-2 text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>{stage.linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
