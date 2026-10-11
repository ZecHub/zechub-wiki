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
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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

        <VisualizerNavigationProvider goHome={goHome}>
          <CurrentComponent
            onComplete={handleVisualizerComplete}
            autoStart={isPlayingAll}
          />
        </VisualizerNavigationProvider>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
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

      <div className="relative z-10 w-full max-w-[100vw] overflow-x-hidden container mx-auto px-5 imd:px-4 md:px-6 flex flex-col py-6 sm:py-8 md:py-12">
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r dark:from-yellow-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-foreground dark:text-transparent">
              {t.visualizer?.title || "Zcash Visualizers"}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-0">
              {t.visualizer?.description ||
                "Interactive educational tools to understand Zcash privacy technology, infrastructure, and zero-knowledge proofs"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center mb-6 sm:mb-8 px-2"
          >
            <Button
              onClick={startPlayAll}
              size="lg"
              className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 shadow-[0_0_40px_rgba(251,191,36,0.5)] hover:shadow-[0_0_60px_rgba(251,191,36,0.7)] transition-all px-5 sm:px-8 py-3 text-base sm:text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              {t.visualizer?.playAll || "Play All Visualizers"}
            </Button>
          </motion.div>
        </section>

        {/* BASIC SECTION */}
        <section id="basic" className="mt-12 sm:mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {t.visualizer?.basic || "Basic"}
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              {t.visualizer?.basicDescription ||
                "Foundational concepts and essential features of Zcash"}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto w-full">
            <VisualizerCard
              data={BASIC_VISUALIZERS}
              goToVisualizer={goToVisualizer}
              startDelay={0.4}
            />
            {openQuiz !== "basic" && (
              <div className="min-h-[160px] imd:min-h-[200px] lg:min-h-[240px] h-full flex">
                <QuizCard
                  title={t.visualizer?.beginnerQuiz || "Beginner Quiz"}
                  className="w-full h-full min-h-[160px] imd:min-h-[200px] lg:min-h-[240px]"
                  onOpen={() => setOpenQuiz("basic")}
                />
              </div>
            )}
          </div>
          {openQuiz === "basic" && (
            <div className="max-w-6xl mx-auto mt-6 sm:mt-8 w-full px-0">
              <QuizModule
                title={t.visualizer?.beginnerQuiz || "Beginner Quiz"}
                questions={QUIZ_BEGINNER}
                onClose={() => setOpenQuiz(null)}
              />
            </div>
          )}
        </section>

        {/* ADVANCED SECTION */}
        <section id="advance" className="mt-12 sm:mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              {t.visualizer?.advanced || "Advanced"}
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              {t.visualizer?.advancedDescription ||
                "Deep technical dives into cryptography, consensus, and infrastructure"}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto w-full">
            <VisualizerCard
              data={ADVANCED_VISUALIZERS}
              goToVisualizer={goToVisualizer}
              startDelay={0.6}
            />
            {openQuiz !== "advanced" && (
              <div className="min-h-[160px] imd:min-h-[200px] lg:min-h-[240px] h-full flex">
                <QuizCard
                  title={t.visualizer?.intermediateQuiz || "Intermediate Quiz"}
                  className="w-full h-full min-h-[160px] imd:min-h-[200px] lg:min-h-[240px]"
                  onOpen={() => setOpenQuiz("advanced")}
                />
              </div>
            )}
          </div>
          {openQuiz === "advanced" && (
            <div className="max-w-6xl mx-auto mt-6 sm:mt-8 w-full px-0">
              <QuizModule
                title={t.visualizer?.intermediateQuiz || "Intermediate Quiz"}
                questions={QUIZ_INTERMEDIATE}
                onClose={() => setOpenQuiz(null)}
              />
            </div>
          )}
        </section>

        {/* CONTRIBUTORS SECTION */}
        <section id="contribution" className="mt-12 sm:mt-16 md:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t.visualizer?.contributors || "Contributors"}
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              {t.visualizer?.contributorsDescription ||
                "Ways to contribute to the Zcash ecosystem and earn rewards"}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 imd:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto w-full">
            <VisualizerCard
              data={CONTRIBUTOR_VISUALIZERS}
              goToVisualizer={goToVisualizer}
              startDelay={0.8}
            />
            {openQuiz !== "contributors" && (
              <div className="min-h-[160px] imd:min-h-[200px] lg:min-h-[240px] h-full flex">
                <QuizCard
                  title={t.visualizer?.contributorsQuiz || "Contributors Quiz"}
                  className="w-full h-full min-h-[160px] imd:min-h-[200px] lg:min-h-[240px]"
                  onOpen={() => setOpenQuiz("contributors")}
                />
              </div>
            )}
          </div>
          {openQuiz === "contributors" && (
            <div className="max-w-6xl mx-auto mt-6 sm:mt-8 w-full px-0">
              <QuizModule
                title={t.visualizer?.contributorsQuiz || "Contributors Quiz"}
                questions={QUIZ_CONTRIBUTORS}
                onClose={() => setOpenQuiz(null)}
              />
            </div>
          )}
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-10 sm:mt-16"
        >
          <p className="text-muted-foreground text-xs sm:text-sm px-2">
            {t.visualizer?.autoPlayNote ||
              "Each visualizer runs automatically. Use controls to navigate or pause."}
          </p>
        </motion.div>
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
  const { data, goToVisualizer, startDelay = 0.3 } = props;
  const { t } = useLanguage();

  return data.map((v, index) => {
    const copy = visualizerCardCopy(t, v);
    return (
      <motion.div
        key={v.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: startDelay + index * 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          type="button"
          onClick={() => goToVisualizer(v.id)}
          className="cursor-pointer group block w-full rounded-xl focus-visible:ring-2 focus-visible:ring-yellow-500"
        >
          <div className="flex flex-col min-h-[160px] imd:min-h-[200px] lg:min-h-[240px] bg-card/70 backdrop-blur-md border border-border/50 rounded-xl p-4 sm:p-6 h-full hover:bg-card/80 hover:border-border/50 transition-all duration-300">
            <div className="flex-1 text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-yellow-500 dark:group-hover:text-primary transition-colors">
                {copy.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-muted-foreground transition-colors">
                {copy.description}
              </p>
            </div>
            <div className="text-yellow-500 text-center group-hover:text-yellow-400 transition-colors">
              <span className="text-sm font-medium" aria-hidden="true">
                {t.common?.clickToExplore || "Click to explore →"}
              </span>
            </div>
          </div>
        </button>
      </motion.div>
    );
  });
}
