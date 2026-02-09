"use client";

import { Button } from "@/components/UI/shadcn/button";
import { motion } from "framer-motion";
import { Home, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useState } from "react";
import { CoinholderGrantsVisualizer } from "./coinholder-grants";
import { ConsensusVisualizer } from "./consensus-visualizer";
import { ContributionVisualizer } from "./contribution-visualizer";
import { HashFunctionVisualizer } from "./hash-function-visualizer";
import { OpenSourceReposVisualizer } from "./open-source-repos";
import { PayWithZcashVisualizer } from "./pay-with-zcash";
import { ZcashCommunityGrantsVisualizer } from "./zcash-community-grants";
import { ZcashDexVisualizer } from "./zcash-dex-visualizer/ZcashDexVisualizer";
import { ZcashInfrastructureVisualizer } from "./zcash-infrastructure-visualizer";
import { ZcashKeyVisualizer } from "./zcash-key-visualizer";
import { ZcashPoolVisualizer } from "./zcash-pool-visualizer";
import { WalletVisualizer } from "./zcash-wallet";
import ZKSNARKProofVisualizer from "./zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { BlockchainFoundationVisualizer } from "./blockchain-foundation";
import { MiningHaloVisualizer } from "./MiningHalo";
import { PrivacyUseCasesVisualizer } from "./PrivacyUsecases";
import { GovernanceVisualizer } from "./Governance";
import { QuizModule, type QuizQuestion } from "./QuizModule";

const QUIZ_BEGINNER: QuizQuestion[] = [
  {
    question: "What do Zcash wallets provide for users?",
    options: ["Only transparent addresses", "Shielded functionality", "Mining only", "Exchange listing"],
    correctIndex: 1,
  },
  {
    question: "How can you get ZEC in a permissionless way?",
    options: ["Only from banks", "Through centralized exchanges only", "Using decentralized exchanges (DEX)", "ZEC cannot be bought"],
    correctIndex: 2,
  },
  {
    question: "Which pool offers the strongest privacy on Zcash?",
    options: ["Transparent", "Sapling", "Orchard", "Both Sapling and Orchard"],
    correctIndex: 3,
  },
  {
    question: "What does a zk-SNARK proof demonstrate in a shielded transaction?",
    options: ["The transaction amount publicly", "Valid ownership without revealing details", "Only the sender address", "Mining reward"],
    correctIndex: 1,
  },
  {
    question: "Where can you typically use ZEC for payments?",
    options: ["Only on one website", "Nowhere", "At merchants and services that accept ZEC", "Only in mining"],
    correctIndex: 2,
  },
  {
    question: "What does Zcash infrastructure refer to?",
    options: ["Only one server", "How nodes, wallets, and network components work together", "Only websites", "Only mining pools"],
    correctIndex: 1,
  },
];

const QUIZ_INTERMEDIATE: QuizQuestion[] = [
  {
    question: "What is Halo 2 used for in Zcash?",
    options: ["Mining only", "Recursive zero-knowledge proofs", "Wallet storage", "Exchange trading"],
    correctIndex: 1,
  },
  {
    question: "What are privacy use cases on Zcash?",
    options: ["Only personal use", "Real-world applications of privacy technology", "Only for miners", "There are none"],
    correctIndex: 1,
  },
  {
    question: "How is Zcash development funded?",
    options: ["Only by one company", "Through governance and the Dev Fund", "Only by miners", "Exchanges only"],
    correctIndex: 1,
  },
  {
    question: "What role do hash functions play in Zcash?",
    options: ["Mining rewards only", "Integrity, commitments, and binding data", "Only for addresses", "Display names"],
    correctIndex: 1,
  },
];

const QUIZ_CONTRIBUTORS: QuizQuestion[] = [
  {
    question: "How can you earn ZEC through ZecHub?",
    options: ["Only by mining", "By completing bounties and contributing", "By buying only", "ZecHub does not offer ZEC"],
    correctIndex: 1,
  },
  {
    question: "What are Zcash Community Grants for?",
    options: ["Personal use", "Funding ecosystem projects and development", "Only for miners", "Exchange fees"],
    correctIndex: 1,
  },
  {
    question: "Who directs Coinholder Directed Grants?",
    options: ["A single company", "ZEC holders (retroactive funding)", "Only developers", "Exchanges only"],
    correctIndex: 1,
  },
  {
    question: "How do nodes in the Zcash network agree on the chain?",
    options: ["By voting on a leader", "Through consensus rules", "Only miners decide", "There is no agreement"],
    correctIndex: 1,
  },
  {
    question: "What are Zcash keys used for?",
    options: ["Only for logging in", "Sending, receiving, and proving ownership of funds", "Mining only", "Website passwords"],
    correctIndex: 1,
  },
  {
    question: "How can you contribute to Zcash open source?",
    options: ["Only by donating money", "Through code, docs, and repos listed in the visualizer", "Only by mining", "You cannot contribute"],
    correctIndex: 1,
  },
];

type VisualizerType =
  | "welcome"
  | "pay-with-zcash"
  | "pool"
  | "zkproof"
  | "infrastructure"
  | "zcash-wallet"
  | "zcash-dex"
  | "mining-halo"
  | "privacy-use-cases"
  | "governance"
  | "hash-function"
  | "consensus"
  | "zcash-key"
  | "blockchain-foundation"
  | "zechub-bounties"
  | "zcash-community-grants"
  | "coinholder-grants"
  | "open-source-repos";

interface VisualizerInfo {
  id: VisualizerType;
  title: string;
  description: string;
  component: React.ComponentType<{
    onComplete?: () => void;
    autoStart?: boolean;
  }>;
}

const VISUALIZERS: VisualizerInfo[] = [
  {
    id: "zcash-wallet",
    title: "Introduction to Zcash Wallets",
    description: "Providing Shielded Functionality",
    component: WalletVisualizer,
  },
  {
    id: "zcash-dex",
    title: "Zcash Exchanges (DEX)",
    description:
      "Permissionless, censorship-resistant access to ZEC using decentralized exchanges",
    component: ZcashDexVisualizer,
  },
  {
    id: "pool",
    title: "Value Pools & Address Types",
    description: "Explore Zcash privacy pools and address types",
    component: ZcashPoolVisualizer,
  },
  {
    id: "pay-with-zcash",
    title: "Pay with Zcash",
    description: "Discover where and how to use ZEC for private payments",
    component: PayWithZcashVisualizer,
  },
  {
    id: "zkproof",
    title: "zk-SNARKs",
    description: "Interactive demonstration of shielded transactions",
    component: ZKSNARKProofVisualizer,
  },
  {
    id: "infrastructure",
    title: "Zcash Infrastructure",
    description: "How Zcash components work together",
    component: ZcashInfrastructureVisualizer,
  },
  {
    id: "mining-halo",
    title: "Zcash Mining & Halo 2",
    description: "Understanding Equihash mining and recursive zero-knowledge proofs",
    component: MiningHaloVisualizer,
  },
  {
    id: "privacy-use-cases",
    title: "Privacy Use Cases",
    description: "Real-world applications of privacy technology on Zcash",
    component: PrivacyUseCasesVisualizer,
  },
  {
    id: "governance",
    title: "Governance & Dev Fund",
    description: "Community-driven development and decentralized decision making",
    component: GovernanceVisualizer,
  },
  {
    id: "hash-function",
    title: "Hash Functions",
    description: "What is a Hash Function?",
    component: HashFunctionVisualizer,
  },
  {
    id: "blockchain-foundation",
    title: "Zcash Blockchain Fundamentals",
    description: "Understanding Zcash Blockchain Foundation",
    component: BlockchainFoundationVisualizer,
  },
  {
    id: "consensus",
    title: "Consensus",
    description: "How do hundreds of nodes agree on chain state?",
    component: ConsensusVisualizer,
  },
  {
    id: "zcash-key",
    title: "Zcash Keys",
    description: "Understanding Zcash Keys",
    component: ZcashKeyVisualizer,
  },
  {
    id: "zechub-bounties",
    title: "ZecHub Bounties",
    description: "Contribute to ZecHub and earn ZEC",
    component: ContributionVisualizer,
  },
  {
    id: "zcash-community-grants",
    title: "Zcash Community Grants",
    description: "Funding for Zcash ecosystem projects",
    component: ZcashCommunityGrantsVisualizer,
  },
  {
    id: "coinholder-grants",
    title: "Coinholder Directed Grants",
    description: "Retroactive funding directed by ZEC holders",
    component: CoinholderGrantsVisualizer,
  },
  {
    id: "open-source-repos",
    title: "Open Source Repositories",
    description: "Contribute to Zcash open source projects",
    component: OpenSourceReposVisualizer,
  },
];

export const VisualizerHub: React.FC = () => {
  const [currentVisualizer, setCurrentVisualizer] =
    useState<VisualizerType>("welcome");
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  const startPlayAll = useCallback(() => {
    setIsPlayingAll(true);
    setCurrentVisualizer(VISUALIZERS[0].id);
  }, []);

  const stopPlayAll = useCallback(() => {
    setIsPlayingAll(false);
  }, []);

  const goToVisualizer = useCallback((visualizerId: VisualizerType) => {
    setCurrentVisualizer(visualizerId);
    setIsPlayingAll(false);
  }, []);

  const goHome = useCallback(() => {
    setCurrentVisualizer("welcome");
    setIsPlayingAll(false);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentVisualizer((current) => {
      const currentIdx = VISUALIZERS.findIndex((v) => v.id === current);
      if (currentIdx < VISUALIZERS.length - 1) {
        return VISUALIZERS[currentIdx + 1].id;
      } else {
        // Only loop if in auto-play mode
        return current; // Stay on current if not auto-playing
      }
    });
    
    // Handle looping for auto-play separately
    setIsPlayingAll((playing) => {
      if (playing) {
        setCurrentVisualizer((current) => {
          const currentIdx = VISUALIZERS.findIndex((v) => v.id === current);
          if (currentIdx === VISUALIZERS.length - 1) {
            return VISUALIZERS[0].id; // Loop back to start
          }
          return current;
        });
      }
      return playing;
    });
  }, []); // No dependencies needed

  const goToPrevious = useCallback(() => {
    setCurrentVisualizer((current) => {
      const currentIdx = VISUALIZERS.findIndex((v) => v.id === current);
      if (currentIdx > 0) {
        return VISUALIZERS[currentIdx - 1].id;
      }
      return current;
    });
  }, []);

  const handleVisualizerComplete = useCallback(() => {
    setIsPlayingAll((playing) => {
      if (playing) {
        setCurrentVisualizer((current) => {
          const currentIdx = VISUALIZERS.findIndex((v) => v.id === current);
          const nextIndex = currentIdx + 1;
          
          if (nextIndex < VISUALIZERS.length) {
            return VISUALIZERS[nextIndex].id;
          } else {
            // Loop back to start
            return VISUALIZERS[0].id;
          }
        });
      }
      return playing;
    });
  }, []);

  // Calculate current index for display
  const currentIdx = VISUALIZERS.findIndex((v) => v.id === currentVisualizer);

  if (currentVisualizer !== "welcome") {
    const CurrentComponent = VISUALIZERS[currentIdx]?.component;
    const isFirst = currentIdx === 0;
    const isLast = currentIdx === VISUALIZERS.length - 1;
    const nextVisualizer = !isLast
      ? VISUALIZERS[currentIdx + 1]
      : VISUALIZERS[0];
    const prevVisualizer = !isFirst ? VISUALIZERS[currentIdx - 1] : null;

    if (!CurrentComponent) return null;

    return (
      <div className="relative min-h-screen">
        {/* Back to hub button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={goHome}
          className="fixed top-[6rem] left-[1.5rem] imd:top-[7rem] imd:left-8 z-50 p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:bg-card transition-all shadow-lg"
          aria-label="Back to Visualizer Hub"
        >
          <Home className="w-5 h-5 text-foreground" />
        </motion.button>

        {/* Auto-play indicator */}
        {isPlayingAll && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50 flex gap-2"
          >
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Auto-playing ({currentIdx + 1}/{VISUALIZERS.length})
              </span>
            </div>
            <Button
              onClick={stopPlayAll}
              variant="secondary"
              size="sm"
              className="bg-card/80 backdrop-blur-md border border-border/50"
            >
              <Pause className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </motion.div>
        )}

        {/* Navigation buttons */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 max-w-[95vw]">
          {/* Previous button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={goToPrevious}
              disabled={isFirst}
              variant="secondary"
              className="bg-card/90 backdrop-blur-md border border-border/50 hover:bg-card disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {prevVisualizer && (
                <span className="hidden md:inline max-w-[150px] lg:max-w-[200px] truncate">
                  {prevVisualizer.title}
                </span>
              )}
              <span className="md:hidden">Previous</span>
            </Button>
          </motion.div>

          {/* Current module indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 max-w-[180px] md:max-w-[250px]"
          >
            <div className="text-xs text-muted-foreground mb-1">
              Current Module
            </div>
            <div className="font-semibold text-sm truncate">
              {VISUALIZERS[currentIdx].title}
            </div>
          </motion.div>

          {/* Next button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={goToNext}
              variant="secondary"
              className="bg-card/90 backdrop-blur-md border border-border/50 hover:bg-card"
            >
              {nextVisualizer && (
                <span className="hidden md:inline max-w-[150px] lg:max-w-[200px] truncate">
                  {nextVisualizer.title}
                </span>
              )}
              <span className="md:hidden">Next</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>

        <CurrentComponent
          onComplete={handleVisualizerComplete}
          autoStart={isPlayingAll}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col  py-12">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r dark:from-yellow-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-foreground dark:text-transparent">
              Zcash Visualizers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Interactive educational tools to understand Zcash privacy
              technology, infrastructure, and zero-knowledge proofs
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Button
              onClick={startPlayAll}
              size="lg"
              className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all px-8 py-3 text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Play All Visualizers
            </Button>
          </motion.div>
        </section>

        <section id="basic" className="mt-24">
          <h2 className="text-2xl font-bold text-foreground mb-6 max-w-6xl mx-auto">
            Beginner
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <VisualizerCard
              data={VISUALIZERS.slice(0, 6)}
              goToVisualizer={goToVisualizer}
            />
          </div>
          <div className="max-w-6xl mx-auto mt-12">
            <QuizModule title="Beginner Quiz" questions={QUIZ_BEGINNER} />
          </div>
        </section>

        <section id="advance" className="mt-24">
          <h2 className="text-2xl font-bold text-foreground mb-6 max-w-6xl mx-auto">
            Intermediate
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <VisualizerCard
              data={VISUALIZERS.slice(6, 10)}
              goToVisualizer={goToVisualizer}
            />
          </div>
          <div className="max-w-6xl mx-auto mt-12">
            <QuizModule title="Intermediate Quiz" questions={QUIZ_INTERMEDIATE} />
          </div>
        </section>

        <section id="contribution" className="mt-24">
          <h2 className="text-2xl font-bold text-foreground mb-6 max-w-6xl mx-auto">
            Contributors
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <VisualizerCard
              data={VISUALIZERS.slice(10)}
              goToVisualizer={goToVisualizer}
            />
          </div>
          <div className="max-w-6xl mx-auto mt-12">
            <QuizModule title="Contributors Quiz" questions={QUIZ_CONTRIBUTORS} />
          </div>
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground text-sm">
            Each visualizer runs automatically. Use controls to navigate or
            pause.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

type CardProps = {
  data: VisualizerInfo[];
  goToVisualizer: (id: VisualizerType) => void;
};

function VisualizerCard(props: CardProps) {
  return props.data.map((v, index) => (
    <motion.div
      key={v.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        onClick={() => props.goToVisualizer(v.id)}
        className="cursor-pointer group"
      >
        <div className="flex flex-col min-h-[240px] bg-card/70 backdrop-blur-md border border-border/50 rounded-xl p-6 h-full hover:bg-card/80 hover:border-border/50 transition-all duration-300">
          <div className="flex-1 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-yellow-500 dark:group-hover:text-primary transition-colors">
              {v.title}
            </h3>
            <p className="text-muted-foreground group-hover:text-muted-foreground transition-colors">
              {v.description}
            </p>
          </div>

          <div className="text-yellow-500 text-center group-hover:text-yellow-400 transition-colors">
            <span className="text-sm font-medium">Click to explore →</span>
          </div>
        </div>
      </div>
    </motion.div>
  ));
}
