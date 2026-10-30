"use client";

import { Button } from "@/components/UI/shadcn/button";
import { motion } from "framer-motion";
import { ArrowRight, Home, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
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
import DistributedDatabaseVisualize  from "./distributed-databases/DistributedDatabaseVisualizer";
import { WalletVisualizer } from "./zcash-wallet";
import ZKSNARKProofVisualizer from "./zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { BlockchainFoundationVisualizer } from "./blockchain-foundation";
import { MiningHaloVisualizer } from "./MiningHalo";
import { PrivacyUseCasesVisualizer } from "./PrivacyUsecases";
import { GovernanceVisualizer } from "./Governance";
import { QuizCard, QuizModule, type QuizQuestion } from "./QuizModule";
import { DAOProposalVisualizer } from "./DAOProposals";
import { BuildShieldedTransactionVisualizer } from "./BuildShieldedTransaction";
import CrosslinkProtocolVisualizer from "./CrosslinkProtocol";
import { FrostMultisigVisualizer } from "./frost-multisig";
import { ZkavClubVisualizer } from "./zkav-club";

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
  {
    question: "In a shielded Zcash transaction, what does the zk-SNARK proof allow a sender to demonstrate?",
    options: [
      "Their full wallet balance to the recipient",
      "Valid ownership and transaction correctness without revealing private inputs",
      "The memo contents to all network observers",
      "Which pool the funds originated from",
    ],
    correctIndex: 1,
  },
  {
    question: "Which Zcash address pool offers the strongest privacy with no trusted setup requirement?",
    options: ["Transparent (t-addr)", "Sapling (zs-addr)", "Orchard (u-addr)", "All pools are equally private"],
    correctIndex: 2,
  },
  {
    question: "In a FROST t-of-n threshold signature scheme, how many participants must cooperate to produce a valid signature?",
    options: [
      "All n participants every time",
      "At least t participants",
      "Exactly one trusted coordinator",
      "A simple majority, regardless of t",
    ],
    correctIndex: 1,
  },
  {
    question: "What makes a FROST signature private on Zcash?",
    options: [
      "It hides the transaction amount on its own",
      "It is indistinguishable from an ordinary single-key Schnorr signature, so observers can't tell a group signed",
      "It publishes each signer's share on-chain",
      "It only works with transparent addresses",
    ],
    correctIndex: 1,
  },
  {
    question: "What does a value pool turnstile reveal?",
    options: [
      "The sender and receiver of every transaction",
      "Nothing at all — it is fully shielded",
      "The amount of value crossing between pools, while sender and receiver stay private",
      "Each user's total balance",
    ],
    correctIndex: 2,
  },
  {
    question: "Why was the Ironwood pool introduced in NU6.3?",
    options: [
      "To lower transaction fees",
      "To open a clean pool and seal Orchard behind a turnstile so supply can be audited after the circuit bug",
      "To replace proof-of-work with proof-of-stake",
      "To remove shielded transactions entirely",
    ],
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
  {
    question: "Where are ZecHub bounties managed?",
    options: [
      "A public Google Sheet",
      "ZEC Bounties at bounties.zechub.wiki",
      "Only in Discord threads",
      "By emailing the ZecHub team",
    ],
    correctIndex: 1,
  },
  {
    question: "How do you tell ZEC Bounties where to send your reward?",
    options: [
      "Post your address in Discord",
      "Rewards are sent to an exchange account",
      "Save a Unified Address (u1...) on your ZEC Bounties profile",
      "Rewards are claimed in person at an event",
    ],
    correctIndex: 2,
  },
  {
    question: "What does the ZKAV Club offer contributors?",
    options: [
      "Mining hardware rentals",
      "Paid audiovisual gigs and coordinator roles for documenting communities",
      "Exchange listings",
      "Free ZEC airdrops",
    ],
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
  | "dao-proposal"
  | "zcash-community-grants"
  | "coinholder-grants"
  | "open-source-repos"
  | "zkav-club"
  | "build-shielded-transaction"
  | "CrossLink-Protocol"
  | "frost-multisig"
  | "distributed-database";

interface VisualizerInfo {
  id: VisualizerType;
  title: string;
  description: string;
  component: React.ComponentType<{
    onComplete?: () => void;
    autoStart?: boolean;
  }>;
}

// BASIC VISUALIZERS - Foundational concepts
const BASIC_VISUALIZERS: VisualizerInfo[] = [
  {
    id: "zcash-wallet",
    title: "Introduction to Zcash Wallets",
    description: "Providing Shielded Functionality",
    component: WalletVisualizer,
  },
  {
    id: "pool",
    title: "Value Pools & Address Types",
    description:
      "Explore Zcash privacy pools, address types and the Ironwood migration",
    component: ZcashPoolVisualizer,
  },
  {
    id: "pay-with-zcash",
    title: "Pay with Zcash",
    description: "Discover where and how to use ZEC for private payments",
    component: PayWithZcashVisualizer,
  },
  {
    id: "zcash-dex",
    title: "Zcash Exchanges (DEX)",
    description:
      "Permissionless, censorship-resistant access to ZEC using decentralized exchanges",
    component: ZcashDexVisualizer,
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
    id: "distributed-database",
    title: "Distributed Databases",
    description: "Compare centralized databases with blockchains",
    component: DistributedDatabaseVisualize,
  },
];

// ADVANCED VISUALIZERS - Technical deep dives
const ADVANCED_VISUALIZERS: VisualizerInfo[] = [
  {
    id: "zkproof",
    title: "zk-SNARKs",
    description: "Interactive demonstration of shielded transactions",
    component: ZKSNARKProofVisualizer,
  },
  {
    id: "build-shielded-transaction",
    title: "Build a Shielded Transaction",
    description: "Step-by-step construction of a shielded transaction",
    component: BuildShieldedTransactionVisualizer,
  },
  {
    id: "CrossLink-Protocol",
    title: "CrossLink Protocol",
    description: "Hybrid PoW + BFT finality: How Crosslink seals Zcash blocks",
    component: CrosslinkProtocolVisualizer,
  },
  {
    id: "zcash-key",
    title: "Zcash Keys",
    description: "Understanding Zcash Keys",
    component: ZcashKeyVisualizer,
  },
  {
    id: "infrastructure",
    title: "Zcash Infrastructure",
    description: "How Zcash components work together",
    component: ZcashInfrastructureVisualizer,
  },
  {
    id: "consensus",
    title: "Consensus",
    description: "How do hundreds of nodes agree on chain state?",
    component: ConsensusVisualizer,
  },
  {
    id: "mining-halo",
    title: "Zcash Mining",
    description:
      "Understanding Equihash mining and recursive zero-knowledge proofs",
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
    description:
      "Community-driven development and decentralized decision making",
    component: GovernanceVisualizer,
  },
  {
    id: "frost-multisig",
    title: "FROST & Private Multi Signatures",
    description: "Secure multisig without a single point of failure",
    component: FrostMultisigVisualizer,
  },
];

// CONTRIBUTOR VISUALIZERS - Community contribution pathways
const CONTRIBUTOR_VISUALIZERS: VisualizerInfo[] = [
  {
    id: "zechub-bounties",
    title: "ZecHub Bounties",
    description:
      "Claim bounties on bounties.zechub.wiki and get paid natively in ZEC",
    component: ContributionVisualizer,
  },
  {
  id: "dao-proposal",
  title: "DAO Proposals",
  description: "Step-by-step guide to creating a ZecHub DAO governance proposal",
  component: DAOProposalVisualizer,
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
  {
    id: "zkav-club",
    title: "ZKAV Club Opportunities",
    description:
      "Privacy-first audiovisual roles and paid gigs with the Zero-knowledge Audiovisual Club",
    component: ZkavClubVisualizer,
  },
];

// Combined array for sequential playback
const ALL_VISUALIZERS = [
  ...BASIC_VISUALIZERS,
  ...ADVANCED_VISUALIZERS,
  ...CONTRIBUTOR_VISUALIZERS,
];

type OpenQuizSection = "basic" | "advanced" | "contributors" | null;

export const VisualizerHub: React.FC = () => {
  const [currentVisualizer, setCurrentVisualizer] =
    useState<VisualizerType>("welcome");
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [openQuiz, setOpenQuiz] = useState<OpenQuizSection>(null);
  const { t } = useLanguage();

  const startPlayAll = useCallback(() => {
    setIsPlayingAll(true);
    setCurrentVisualizer(ALL_VISUALIZERS[0].id);
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
      const currentIdx = ALL_VISUALIZERS.findIndex((v) => v.id === current);
      if (currentIdx < ALL_VISUALIZERS.length - 1) {
        return ALL_VISUALIZERS[currentIdx + 1].id;
      } else {
        return current;
      }
    });

    setIsPlayingAll((playing) => {
      if (playing) {
        setCurrentVisualizer((current) => {
          const currentIdx = ALL_VISUALIZERS.findIndex((v) => v.id === current);
          if (currentIdx === ALL_VISUALIZERS.length - 1) {
            return ALL_VISUALIZERS[0].id;
          }
          return current;
        });
      }
      return playing;
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentVisualizer((current) => {
      const currentIdx = ALL_VISUALIZERS.findIndex((v) => v.id === current);
      if (currentIdx > 0) {
        return ALL_VISUALIZERS[currentIdx - 1].id;
      }
      return current;
    });
  }, []);

  const handleVisualizerComplete = useCallback(() => {
    setIsPlayingAll((playing) => {
      if (playing) {
        setCurrentVisualizer((current) => {
          const currentIdx = ALL_VISUALIZERS.findIndex((v) => v.id === current);
          const nextIndex = currentIdx + 1;

          if (nextIndex < ALL_VISUALIZERS.length) {
            return ALL_VISUALIZERS[nextIndex].id;
          } else {
            return ALL_VISUALIZERS[0].id;
          }
        });
      }
      return playing;
    });
  }, []);

  const currentIdx = ALL_VISUALIZERS.findIndex(
    (v) => v.id === currentVisualizer,
  );

  if (currentVisualizer !== "welcome") {
    const CurrentComponent = ALL_VISUALIZERS[currentIdx]?.component;
    const isFirst = currentIdx === 0;
    const isLast = currentIdx === ALL_VISUALIZERS.length - 1;
    const nextVisualizer = !isLast
      ? ALL_VISUALIZERS[currentIdx + 1]
      : ALL_VISUALIZERS[0];
    const prevVisualizer = !isFirst ? ALL_VISUALIZERS[currentIdx - 1] : null;

    if (!CurrentComponent) return null;

    return (
      <div className="relative min-h-screen">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          onClick={goHome}
          className="fixed top-[6rem] left-2 sm:left-4 imd:top-[7rem] imd:left-8 z-50 p-2 sm:p-3 rounded-full bg-card/80 backdrop-blur-md border border-border/50 hover:bg-card transition-all shadow-lg"
          aria-label="Back to Visualizer Hub"
        >
          <Home className="w-5 h-5 text-foreground" />
        </motion.button>

        {isPlayingAll && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-2 sm:right-4 md:right-6 z-50 flex flex-wrap gap-2 justify-end"
          >
            <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                Auto-playing ({currentIdx + 1}/{ALL_VISUALIZERS.length})
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

        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 max-w-[95vw] px-1">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-card/90 backdrop-blur-md border border-border/50 rounded-lg px-3 py-2 max-w-[140px] sm:max-w-[180px] md:max-w-[250px]"
          >
            <div className="text-xs text-muted-foreground mb-1">
              Current Module
            </div>
            <div className="font-semibold text-sm truncate">
              {ALL_VISUALIZERS[currentIdx].title}
            </div>
          </motion.div>

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

  const sections: {
    key: Exclude<OpenQuizSection, null>;
    id: string;
    title: string;
    description: string;
    data: VisualizerInfo[];
    quizTitle: string;
    questions: QuizQuestion[];
  }[] = [
    {
      key: "basic",
      id: "basic",
      title: t.visualizer?.basic || "Basic",
      description: t.visualizer?.basicDescription || "Foundational concepts and essential features of Zcash",
      data: BASIC_VISUALIZERS,
      quizTitle: t.visualizer?.beginnerQuiz || "Beginner Quiz",
      questions: QUIZ_BEGINNER,
    },
    {
      key: "advanced",
      id: "advance",
      title: t.visualizer?.advanced || "Advanced",
      description: t.visualizer?.advancedDescription || "Deep technical dives into cryptography, consensus, and infrastructure",
      data: ADVANCED_VISUALIZERS,
      quizTitle: t.visualizer?.intermediateQuiz || "Intermediate Quiz",
      questions: QUIZ_INTERMEDIATE,
    },
    {
      key: "contributors",
      id: "contribution",
      title: t.visualizer?.contributors || "Contributors",
      description: t.visualizer?.contributorsDescription || "Ways to contribute to the Zcash ecosystem and earn rewards",
      data: CONTRIBUTOR_VISUALIZERS,
      quizTitle: t.visualizer?.contributorsQuiz || "Contributors Quiz",
      questions: QUIZ_CONTRIBUTORS,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-10 imd:px-4 md:px-6 md:py-14">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl"
        >
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl md:text-5xl">
            {t.visualizer?.title || "Zcash Visualizers"}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.visualizer?.description || "Interactive educational tools to understand Zcash privacy technology, infrastructure, and zero-knowledge proofs"}
          </p>
          <button
            type="button"
            onClick={startPlayAll}
            className="mt-7 inline-flex items-center gap-2.5 rounded-lg border border-brand bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand/20 dark:text-white dark:hover:bg-brand/30"
          >
            <Play aria-hidden="true" className="h-4 w-4" />
            {t.visualizer?.playAll || "Play All Visualizers"}
          </button>
        </motion.header>

        {sections.map((sec, n) => (
          <section key={sec.key} id={sec.id} className="mt-14 md:mt-20">
            <div className="mb-6 flex items-baseline gap-4 border-b border-slate-200 pb-4 dark:border-white/10">
              <span className="font-mono text-sm font-semibold text-brand dark:text-brand-soft">
                {String(n + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{sec.title}</h2>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">{sec.description}</p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-4 imd:grid-cols-2 lg:grid-cols-3">
              <VisualizerCard data={sec.data} goToVisualizer={goToVisualizer} startDelay={0.1} />
              {openQuiz !== sec.key && (
                <QuizCard title={sec.quizTitle} className="w-full" onOpen={() => setOpenQuiz(sec.key)} />
              )}
            </div>
            {openQuiz === sec.key && (
              <div className="mt-6 w-full">
                <QuizModule title={sec.quizTitle} questions={sec.questions} onClose={() => setOpenQuiz(null)} />
              </div>
            )}
          </section>
        ))}

        <p className="mt-14 text-xs text-muted-foreground sm:text-sm">
          {t.visualizer?.autoPlayNote || "Each visualizer runs automatically. Use controls to navigate or pause."}
        </p>
      </div>
    </div>
  );
};

type CardProps = {
  data: VisualizerInfo[];
  goToVisualizer: (id: VisualizerType) => void;
  startDelay?: number;
};

function VisualizerCard(props: CardProps) {
  const { data, goToVisualizer, startDelay = 0.1 } = props;
  const { t } = useLanguage();

  return data.map((v, index) => (
    <motion.div
      key={v.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: startDelay + index * 0.04 }}
      className="h-full"
    >
      <button
        type="button"
        onClick={() => goToVisualizer(v.id)}
        className="group flex h-full min-h-[150px] w-full flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-left transition-colors hover:border-brand/40 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {t?.components?.visualizer?.[v.id]?.title ?? v.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {t?.components?.visualizer?.[v.id]?.description ?? v.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-all group-hover:gap-2.5 dark:text-brand-soft">
          {(t.common?.clickToExplore || "Explore").replace(/\s*→\s*$/, "")}
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </span>
      </button>
    </motion.div>
  ));
}
