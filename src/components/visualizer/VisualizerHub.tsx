"use client";

import { Button } from "@/components/UI/shadcn/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  resolveVisualizerRoute,
  visualizerQuery,
  type QuizSection,
} from "@/lib/visualizerRouting";
import {
  ADVANCED_VISUALIZER_MODULES,
  BASIC_VISUALIZER_MODULES,
  CONTRIBUTOR_VISUALIZER_MODULES,
  VISUALIZER_MODULE_IDS,
  type VisualizerModuleId,
  type VisualizerModuleInfo,
} from "./visualizerModules";
import { visualizerCardCopy } from "./visualizerCardCopy";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BlockchainFoundationVisualizer } from "./blockchain-foundation";
import { BuildShieldedTransactionVisualizer } from "./BuildShieldedTransaction";
import { CoinholderGrantsVisualizer } from "./coinholder-grants";
import { ConsensusVisualizer } from "./consensus-visualizer";
import { ContributionVisualizer } from "./contribution-visualizer";
import CrosslinkProtocolVisualizer from "./CrosslinkProtocol";
import { DAOProposalVisualizer } from "./DAOProposals";
import DistributedDatabaseVisualize from "./distributed-databases/DistributedDatabaseVisualizer";
import { FrostMultisigVisualizer } from "./frost-multisig";
import { GovernanceVisualizer } from "./Governance";
import { HashFunctionVisualizer } from "./hash-function-visualizer";
import { MiningHaloVisualizer } from "./MiningHalo";
import { OpenSourceReposVisualizer } from "./open-source-repos";
import { PayWithZcashVisualizer } from "./pay-with-zcash";
import { PrivacyUseCasesVisualizer } from "./PrivacyUsecases";
import { QuizCard, QuizModule } from "./QuizModule";
import { QUIZ_BEGINNER, QUIZ_CONTRIBUTORS, QUIZ_INTERMEDIATE } from "./quizData";
import { VisualizerNavigationProvider } from "./VisualizerNavigationContext";
import { ZcashCommunityGrantsVisualizer } from "./zcash-community-grants";
import { ZcashDexVisualizer } from "./zcash-dex-visualizer/ZcashDexVisualizer";
import { ZcashInfrastructureVisualizer } from "./zcash-infrastructure-visualizer";
import { ZcashKeyVisualizer } from "./zcash-key-visualizer";
import { ZcashPoolVisualizer } from "./zcash-pool-visualizer";
import { WalletVisualizer } from "./zcash-wallet";
import ZKSNARKProofVisualizer from "./zk-SNARK-proof/ZK-SNARKProofVisualizer";
import { WalletScanningVisualizer } from "./wallet-scanning";
import { ZkavClubVisualizer } from "./zkav-club";

type VisualizerType = "welcome" | VisualizerModuleId;

type VisualizerInfo = VisualizerModuleInfo & {
  component: React.ComponentType<{
    onComplete?: () => void;
    autoStart?: boolean;
  }>;
};

const VISUALIZER_COMPONENTS: Record<
  VisualizerModuleId,
  VisualizerInfo["component"]
> = {
  "zcash-wallet": WalletVisualizer,
  pool: ZcashPoolVisualizer,
  "pay-with-zcash": PayWithZcashVisualizer,
  "zcash-dex": ZcashDexVisualizer,
  "hash-function": HashFunctionVisualizer,
  "blockchain-foundation": BlockchainFoundationVisualizer,
  "distributed-database": DistributedDatabaseVisualize,
  zkproof: ZKSNARKProofVisualizer,
  "build-shielded-transaction": BuildShieldedTransactionVisualizer,
  "wallet-scanning": WalletScanningVisualizer,
  "CrossLink-Protocol": CrosslinkProtocolVisualizer,
  "zcash-key": ZcashKeyVisualizer,
  infrastructure: ZcashInfrastructureVisualizer,
  consensus: ConsensusVisualizer,
  "mining-halo": MiningHaloVisualizer,
  "privacy-use-cases": PrivacyUseCasesVisualizer,
  governance: GovernanceVisualizer,
  "frost-multisig": FrostMultisigVisualizer,
  "zechub-bounties": ContributionVisualizer,
  "dao-proposal": DAOProposalVisualizer,
  "zcash-community-grants": ZcashCommunityGrantsVisualizer,
  "coinholder-grants": CoinholderGrantsVisualizer,
  "open-source-repos": OpenSourceReposVisualizer,
  "zkav-club": ZkavClubVisualizer,
};

function withComponents(
  modules: readonly VisualizerModuleInfo[],
): VisualizerInfo[] {
  return modules.map((module) => ({
    ...module,
    component: VISUALIZER_COMPONENTS[module.id],
  }));
}

// BASIC VISUALIZERS - Foundational concepts
const BASIC_VISUALIZERS = withComponents(BASIC_VISUALIZER_MODULES);

// ADVANCED VISUALIZERS - Technical deep dives
const ADVANCED_VISUALIZERS = withComponents(ADVANCED_VISUALIZER_MODULES);

// CONTRIBUTOR VISUALIZERS - Community contribution pathways
const CONTRIBUTOR_VISUALIZERS = withComponents(CONTRIBUTOR_VISUALIZER_MODULES);

// Combined array for sequential playback
const ALL_VISUALIZERS = [
  ...BASIC_VISUALIZERS,
  ...ADVANCED_VISUALIZERS,
  ...CONTRIBUTOR_VISUALIZERS,
];

type OpenQuizSection = QuizSection | null;

const ALL_VISUALIZER_IDS = VISUALIZER_MODULE_IDS;

export const VisualizerHub: React.FC = () => {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // The selected module and open quiz live in the query string, so a
  // visualizer can be linked to, survives a reload, and the browser's back
  // button steps through them. Play All stays local: a shared link should open
  // a visualizer, not start playing the whole sequence at someone.
  const route = useMemo(
    () => resolveVisualizerRoute(searchParams, ALL_VISUALIZER_IDS),
    [searchParams],
  );
  const currentVisualizer: VisualizerType = route.module ?? "welcome";
  const openQuiz: OpenQuizSection = route.quiz;
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Only the query string changes here, never the path. The router is not used
  // for that: asked to go from /visualizer?module=x to /visualizer it treats
  // the two as the same route and leaves the stale query in the address bar,
  // which silently breaks Home and closing a quiz. The history API changes it
  // reliably, and Next keeps useSearchParams in step with native history
  // calls, so the hub re-renders from the new URL either way. Reading the path
  // off window keeps whatever locale prefix is in the address.
  const navigate = useCallback(
    (
      next: { module?: VisualizerType | null; quiz?: OpenQuizSection },
      mode: "push" | "replace",
    ) => {
      const path = window.location.pathname;
      const target = `${path}${visualizerQuery(next)}`;
      if (`${path}${window.location.search}` === target) return;
      if (mode === "push") window.history.pushState(null, "", target);
      else window.history.replaceState(null, "", target);
    },
    [],
  );

  // An unknown or mis-cased id still renders something real; put the address
  // bar back in step with it rather than leaving a dead id there to be copied
  // again.
  useEffect(() => {
    if (route.canonical) return;
    navigate(route, "replace");
  }, [route, navigate]);

  const select = useCallback(
    (next: { module?: VisualizerType | null; quiz?: OpenQuizSection }) =>
      navigate(next, "push"),
    [navigate],
  );

  // Play All advances on its own, so it replaces rather than pushes: the back
  // button should leave the sequence, not walk back through every step it ran.
  const advanceTo = useCallback(
    (id: VisualizerType) => navigate({ module: id }, "replace"),
    [navigate],
  );

  const setOpenQuiz = useCallback(
    (quiz: OpenQuizSection) => select({ quiz }),
    [select],
  );

  const indexOf = useCallback(
    (id: VisualizerType) => ALL_VISUALIZERS.findIndex((v) => v.id === id),
    [],
  );

  const startPlayAll = useCallback(() => {
    setIsPlayingAll(true);
    select({ module: ALL_VISUALIZERS[0].id });
  }, [select]);

  const stopPlayAll = useCallback(() => {
    setIsPlayingAll(false);
  }, []);

  const goToVisualizer = useCallback(
    (visualizerId: VisualizerType) => {
      setIsPlayingAll(false);
      select({ module: visualizerId });
    },
    [select],
  );

  const goHome = useCallback(() => {
    setIsPlayingAll(false);
    select({});
  }, [select]);

  const goToNext = useCallback(() => {
    const idx = indexOf(currentVisualizer);
    if (idx < 0) return;
    const isLast = idx === ALL_VISUALIZERS.length - 1;
    // Stepping past the end only wraps while Play All is running, matching the
    // previous behaviour.
    if (isLast && !isPlayingAll) return;
    const next = ALL_VISUALIZERS[isLast ? 0 : idx + 1].id;
    if (isPlayingAll) advanceTo(next);
    else select({ module: next });
  }, [currentVisualizer, indexOf, isPlayingAll, advanceTo, select]);

  const goToPrevious = useCallback(() => {
    const idx = indexOf(currentVisualizer);
    if (idx <= 0) return;
    const prev = ALL_VISUALIZERS[idx - 1].id;
    if (isPlayingAll) advanceTo(prev);
    else select({ module: prev });
  }, [currentVisualizer, indexOf, isPlayingAll, advanceTo, select]);

  const handleVisualizerComplete = useCallback(() => {
    if (!isPlayingAll) return;
    const idx = indexOf(currentVisualizer);
    if (idx < 0) return;
    const nextIndex = idx + 1;
    advanceTo(
      ALL_VISUALIZERS[nextIndex < ALL_VISUALIZERS.length ? nextIndex : 0].id,
    );
  }, [currentVisualizer, indexOf, isPlayingAll, advanceTo]);

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
      <div className="relative flex min-h-screen min-w-0 flex-col overflow-hidden">
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

        <VisualizerNavigationProvider
          goHome={goHome}
          goToModule={goToVisualizer}
        >
          <CurrentComponent
            onComplete={handleVisualizerComplete}
            autoStart={isPlayingAll}
          />
        </VisualizerNavigationProvider>
      </div>
    );
  }

  const sections = [
    {
      key: "basic" as const,
      id: "basic",
      title: t.visualizer?.basic || "Basic",
      description: t.visualizer?.basicDescription || "Foundational concepts and essential features of Zcash",
      data: BASIC_VISUALIZERS,
      quizTitle: t.visualizer?.beginnerQuiz || "Beginner Quiz",
      questions: QUIZ_BEGINNER,
    },
    {
      key: "advanced" as const,
      id: "advance",
      title: t.visualizer?.advanced || "Advanced",
      description: t.visualizer?.advancedDescription || "Deep technical dives into cryptography, consensus, and infrastructure",
      data: ADVANCED_VISUALIZERS,
      quizTitle: t.visualizer?.intermediateQuiz || "Intermediate Quiz",
      questions: QUIZ_INTERMEDIATE,
    },
    {
      key: "contributors" as const,
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
            {t.visualizer?.description ||
              "Interactive educational tools to understand Zcash privacy technology, infrastructure, and zero-knowledge proofs"}
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

  return data.map((v, index) => {
    const copy = visualizerCardCopy(t, v);
    return (
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
          className="group flex h-full min-h-[150px] w-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-5 text-left transition-colors hover:border-brand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-brand/40"
        >
          <h3 className="mb-2 text-lg font-semibold text-foreground">{copy.title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
          <span
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-all group-hover:gap-2.5 dark:text-brand-soft"
            aria-hidden="true"
          >
            {(t.common?.clickToExplore || "Explore").replace(/\s*→\s*$/, "")}
            <ArrowRight className="h-4 w-4" />
          </span>
        </button>
      </motion.div>
    );
  });
}
