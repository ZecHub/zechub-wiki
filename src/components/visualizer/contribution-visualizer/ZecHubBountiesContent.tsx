"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  ExternalLink,
  LayoutGrid,
  LogIn,
  MessageSquare,
  PlusCircle,
  Send,
  ToolCase,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisualizerCanvas } from "../VisualizerCanvas";

const BOUNTIES_URL = "https://bounties.zechub.wiki/home";
const PROFILE_URL = "https://bounties.zechub.wiki/profile";

const slides = [
  {
    id: "discord",
    title: "Join Zcash Discord",
    icon: MessageSquare,
    color: "from-blue-500 to-indigo-600",
    steps: [
      "Click the Discord invite link",
      "Accept the community guidelines",
      "Add the ZecHub role in #lang-menu channel",
      "Say hello in the ZecHub channels and ask what needs doing",
    ],
    link: "https://discord.gg/zcash",
    linkText: "Join Discord Community",
  },
  {
    id: "sign-in",
    title: "Sign in to ZEC Bounties",
    icon: LogIn,
    color: "from-purple-500 to-pink-600",
    steps: [
      "Go to bounties.zechub.wiki — ZecHub's bounty platform",
      "Sign in with your GitHub account",
      "Open your profile and set a nickname",
      "Turn on email notifications for newly posted bounties",
    ],
    link: BOUNTIES_URL,
    linkText: "Open ZEC Bounties",
  },
  {
    id: "payment-address",
    title: "Set Your Payment Address",
    icon: Wallet,
    color: "from-amber-500 to-orange-600",
    steps: [
      "Open Profile and paste your Mainnet payment address — a unified address starting with u1",
      "Hit Save address; this is where bounty rewards are sent",
      "Add a Testnet payment address (u or z) for development bounties, then Verify",
      "Your profile is all the onboarding you need to start claiming work",
    ],
    link: PROFILE_URL,
    linkText: "Set Payment Address",
  },
  {
    id: "find-bounty",
    title: "Find a Bounty",
    icon: LayoutGrid,
    color: "from-emerald-500 to-teal-600",
    steps: [
      "Filter by category: Web Development, Writing and Research, Design and Videos",
      "Each card shows the reward in ZEC, a difficulty tag and a deadline",
      "Watch work move across the Todo, In Progress, In Review and Done columns",
      "Pick one that fits your skills and coordinate in the ZecHub Discord channels",
    ],
    link: BOUNTIES_URL,
    linkText: "Browse Open Bounties",
  },
  {
    id: "submit",
    title: "Submit Work & Get Paid in ZEC",
    icon: Send,
    color: "from-cyan-500 to-blue-600",
    steps: [
      "Your claimed bounty sits under In Progress and is tagged Yours",
      "Use the submit button on the card to send your deliverable for review",
      "The bounty moves to In Review, then to Done once a reviewer accepts it",
      "The reward is paid natively in ZEC to the address saved on your profile",
    ],
    link: "https://bounties.zechub.wiki/my-bounties",
    linkText: "Track My Bounties",
  },
  {
    id: "create",
    title: "Create a Bounty",
    icon: PlusCircle,
    color: "from-rose-500 to-red-600",
    steps: [
      "Click New Bounty to open the Create New Bounty dialog",
      "Give it a clear Bounty Title and pick a Category",
      "Set the Reward in ZEC and a Time to Complete date",
      "Write a Description with deliverables and acceptance criteria, then Create Bounty",
    ],
    link: BOUNTIES_URL,
    linkText: "Create a Bounty",
  },
];

export { slides };

interface ZecHubBountiesContentProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const ZecHubBountiesContent = ({
  onComplete,
  autoStart = false,
}: ZecHubBountiesContentProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoStart);
  const [progress, setProgress] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const duration = 10000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + increment, 1000));
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying]);

  /**
   * Auto-advance once the current slide has completed.
   */
  useEffect(() => {
    if (!isPlaying || progress < 100) {
      return;
    }

    const timer = setTimeout(() => {
      if (currentSlide >= slides.length - 1) {
        setIsPlaying(false);
        onComplete?.();
        return;
      }

      setCurrentSlide((prev) => prev + 1);
      setProgress(0);
    }, 0);

    return () => clearTimeout(timer);
  }, [progress, isPlaying, currentSlide, onComplete]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev >= slides.length - 1) {
        return prev;
      }

      return prev + 1;
    });

    setProgress(0);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev <= 0) {
        return prev;
      }

      return prev - 1;
    });

    setProgress(0);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(slides.length - 1, index));

    setCurrentSlide(nextIndex);
    setProgress(0);
  }, []);

  const restart = useCallback(() => {
    setCurrentSlide(0);
    setProgress(0);
    setIsPlaying(false);
  }, []);

  return (
    // <div className="max-w-5xl mx-auto px-4">
    //   {/* Header */}
    //   <motion.div
    //     initial={{ opacity: 0, y: -20 }}
    //     animate={{ opacity: 1, y: 0 }}
    //     className="text-center mb-8"
    //   >
    //     <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
    //       ZecHub Bounties
    //     </h2>
    //     <p className="text-muted-foreground text-lg">
    //       Contribute to ZecHub and earn ZEC on{" "}
    //       <a
    //         href={BOUNTIES_URL}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-yellow-500 hover:underline"
    //       >
    //         bounties.zechub.wiki
    //       </a>
    //     </p>
    //   </motion.div>

    //   {/* Slide Navigation Dots */}
    //   <div className="flex justify-center gap-2 mb-8">
    //     {slides.map((_, index) => (
    //       <button
    //         key={index}
    //         onClick={() => onSlideChange(index)}
    //         className="relative"
    //       >
    //         <div
    //           className={`w-2 h-2 rounded-full transition-all duration-300 ${
    //             index === currentSlide
    //               ? "bg-yellow-400 w-8"
    //               : "bg-slate-400/30 hover:bg-slate-400/50"
    //           }`}
    //         />
    //         {index === currentSlide && isPlaying && (
    //           <motion.div
    //             className="absolute inset-0 bg-yellow-400 rounded-full"
    //             initial={{ scaleX: 0 }}
    //             animate={{ scaleX: progress / 100 }}
    //             style={{ transformOrigin: "left" }}
    //           />
    //         )}
    //       </button>
    //     ))}
    //   </div>

    //   {/* Main Slide Content */}
    //   <AnimatePresence mode="wait">
    //     <motion.div
    //       key={currentSlide}
    //       initial={{ opacity: 0, x: 100 }}
    //       animate={{ opacity: 1, x: 0 }}
    //       exit={{ opacity: 0, x: -100 }}
    //       transition={{ duration: 0.5 }}
    //       className="relative"
    //     >
    //       {/* Icon Header */}
    //       <div className="flex items-center justify-center mb-8">
    //         <motion.div
    //           initial={{ scale: 0, rotate: -180 }}
    //           animate={{ scale: 1, rotate: 0 }}
    //           transition={{
    //             type: "spring",
    //             stiffness: 200,
    //             damping: 15,
    //             delay: 0.2,
    //           }}
    //           className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${slide.color} p-1 shadow-2xl`}
    //         >
    //           <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
    //             <Icon className="w-12 h-12 text-foreground" />
    //           </div>

    //           {/* Animated Ring */}
    //           <motion.div
    //             className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${slide.color} opacity-50`}
    //             animate={{
    //               scale: [1, 1.2, 1],
    //               opacity: [0.5, 0, 0.5],
    //             }}
    //             transition={{
    //               duration: 2,
    //               repeat: Infinity,
    //               ease: "easeInOut",
    //             }}
    //           />
    //         </motion.div>
    //       </div>

    //       {/* Title */}
    //       <motion.h3
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ delay: 0.3 }}
    //         className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
    //       >
    //         {slide.title}
    //       </motion.h3>

    //       {/* Steps */}
    //       <div className="grid gap-4 mb-8">
    //         {slide.steps.map((step, index) => (
    //           <motion.div
    //             key={index}
    //             initial={{ opacity: 0, x: -50 }}
    //             animate={{ opacity: 1, x: 0 }}
    //             transition={{ delay: 0.4 + index * 0.1 }}
    //             className="flex items-start gap-4 bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 hover:border-yellow-400/50 hover:bg-card/70 transition-all group"
    //           >
    //             <motion.div
    //               initial={{ scale: 0 }}
    //               animate={{ scale: 1 }}
    //               transition={{
    //                 delay: 0.5 + index * 0.1,
    //                 type: "spring",
    //                 stiffness: 200,
    //               }}
    //               className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${slide.color} flex items-center justify-center text-white font-bold shadow-lg`}
    //             >
    //               {index + 1}
    //             </motion.div>
    //             <div className="flex-1 pt-1">
    //               <p className="text-foreground text-lg group-hover:text-yellow-400 transition-colors">
    //                 {step}
    //               </p>
    //             </div>
    //             <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
    //           </motion.div>
    //         ))}
    //       </div>

    //       {/* Action Button */}
    //       <motion.div
    //         initial={{ opacity: 0, y: 20 }}
    //         animate={{ opacity: 1, y: 0 }}
    //         transition={{ delay: 0.8 }}
    //         className="flex justify-center"
    //       >
    //         <a
    //           href={slide.link}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${slide.color} text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
    //         >
    //           <ExternalLink className="w-5 h-5" />
    //           {slide.linkText}
    //           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
    //         </a>
    //       </motion.div>

    //       {/* Decorative Elements */}
    //       <motion.div
    //         animate={{
    //           rotate: [0, 360],
    //           scale: [1, 1.2, 1],
    //         }}
    //         transition={{
    //           duration: 20,
    //           repeat: Infinity,
    //           ease: "linear",
    //         }}
    //         className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${slide.color} opacity-10 rounded-full blur-3xl pointer-events-none`}
    //       />
    //       <motion.div
    //         animate={{
    //           rotate: [360, 0],
    //           scale: [1, 1.3, 1],
    //         }}
    //         transition={{
    //           duration: 15,
    //           repeat: Infinity,
    //           ease: "linear",
    //         }}
    //         className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br ${slide.color} opacity-10 rounded-full blur-3xl pointer-events-none`}
    //       />
    //     </motion.div>
    //   </AnimatePresence>

    //   {/* Progress Indicator */}
    //   <motion.div
    //     initial={{ opacity: 0 }}
    //     animate={{ opacity: 1 }}
    //     className="mt-12 text-center text-sm text-muted-foreground"
    //   >
    //     Step {currentSlide + 1} of {slides.length}
    //   </motion.div>
    // </div>

    <VisualizerCanvas
      title="ZecHub Bounties"
      description="Contribute to ZecHub and earn ZEC on bounties"
      currentStep={currentSlide}
      totalSteps={slides.length}
      isPlaying={isPlaying}
      onPrevious={goToPrevious}
      onNext={goToNext}
      onPlay={() => setIsPlaying(true)}
      onPause={() => setIsPlaying(false)}
      onRestart={restart}
      iconHeader={<ToolCase className="w-10 h-10 text-yellow-400" />}
    >
      <div className="mx-auto w-full max-w-5xl p-8">
        {/* External resource description */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <p className="text-lg text-muted-foreground">
            Contribute to ZecHub and earn ZEC on{" "}
            <a
              href={BOUNTIES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:underline"
            >
              bounties.zechub.wiki
            </a>
          </p>
        </motion.div>

        {/* Slide Navigation */}
        <div className="mb-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "step" : undefined}
              className="relative"
            >
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "w-8 bg-yellow-400"
                    : "w-2 bg-slate-400/30 hover:bg-slate-400/50"
                }`}
              />

              {index === currentSlide && isPlaying && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-yellow-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progress / 100 }}
                  style={{ transformOrigin: "left" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Icon */}
            <div className="mb-8 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className={`relative h-24 w-24 rounded-2xl bg-gradient-to-br ${slide.color} p-1 shadow-2xl`}
              >
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-background">
                  <Icon className="h-12 w-12 text-foreground" />
                </div>

                <motion.div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${slide.color} opacity-50`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Slide Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl"
            >
              {slide.title}
            </motion.h2>

            {/* Steps */}
            <div className="mb-8 grid gap-4">
              {slide.steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group flex items-start gap-4 rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-yellow-400/50 hover:bg-card/70"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${slide.color} font-bold text-white shadow-lg`}
                  >
                    {index + 1}
                  </motion.div>

                  <div className="flex-1 pt-1">
                    <p className="text-lg text-foreground transition-colors group-hover:text-yellow-400">
                      {step}
                    </p>
                  </div>

                  <CheckCircle className="mt-2 h-5 w-5 flex-shrink-0 text-green-500 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center"
            >
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r ${slide.color} px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl`}
              >
                <ExternalLink className="h-5 w-5" />
                {slide.linkText}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${slide.color} opacity-10 blur-3xl`}
            />

            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className={`pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br ${slide.color} opacity-10 blur-3xl`}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </VisualizerCanvas>
  );
};
