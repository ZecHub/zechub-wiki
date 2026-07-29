"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Archive,
  ArrowRight,
  BookOpen,
  Camera,
  CheckCircle,
  Coins,
  ExternalLink,
  Mic
} from "lucide-react";
import { useState, useEffect } from "react";

const OPPORTUNITIES_URL = "https://zkav.club/opportunities";

const slides = [
  {
    id: "about",
    title: "What is the ZKAV Club?",
    icon: Camera,
    color: "from-violet-500 to-purple-600",
    steps: [
      "A privacy-first audiovisual club for open-source and decentralized communities",
      "Brings a portable recording station to meetups, conferences and camps",
      "Creators keep ownership; approved recordings go to a public archive",
      "Runs on small networks of people who keep recordings usable long after the event"
    ],
    link: "https://zkav.club/",
    linkText: "Visit zkav.club"
  },
  {
    id: "coordinators",
    title: "Coordinator Roles",
    icon: Archive,
    color: "from-amber-500 to-orange-600",
    steps: [
      "The Archivist — turns messy recording folders into structured archive items",
      "The Archivist keeps metadata clean so the archive stays usable long-term",
      "The Storyteller — adds titles, descriptions, tags and context to recordings",
      "The Storyteller runs the transcription network and keeps public indexes readable"
    ],
    link: OPPORTUNITIES_URL,
    linkText: "Read the Role Descriptions"
  },
  {
    id: "gigs",
    title: "Paid Gigs & Skill Network",
    icon: Mic,
    color: "from-emerald-500 to-teal-600",
    steps: [
      "Workshops — run a hands-on session, publish it and share the recording",
      "Transcription — turn recorded conversations into accurate transcripts and quotes",
      "Event production — camera operation, livestream tech, live translation, show calling",
      "Post-production — long-form edits, social clips, thumbnails and motion graphics"
    ],
    link: OPPORTUNITIES_URL,
    linkText: "See Open Gigs"
  },
  {
    id: "how-it-works",
    title: "How It Works",
    icon: Coins,
    color: "from-yellow-500 to-amber-600",
    steps: [
      "Most gigs are paid per contribution, whenever work is available",
      "Payment is in Zcash — work done in a month is paid at the start of the next",
      "Work appears around events and funding; you get contacted with scope and pay",
      "Open to anyone who wants to help document these communities while preserving privacy"
    ],
    link: OPPORTUNITIES_URL,
    linkText: "Explore Opportunities"
  },
  {
    id: "join",
    title: "Join the Club",
    icon: BookOpen,
    color: "from-rose-500 to-pink-600",
    steps: [
      "Message the club through the Join the Club links on zkav.club",
      "Share your skills, timezone and availability",
      "Add portfolio links and the languages you can work in",
      "The club reaches out when a gig matches what you do"
    ],
    link: OPPORTUNITIES_URL,
    linkText: "Join the Club"
  }
];

export { slides };

interface ZkavClubContentProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isPlaying: boolean;
}

export const ZkavClubContent = ({
  currentSlide,
  onSlideChange,
  isPlaying
}: ZkavClubContentProps) => {
  const [progress, setProgress] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const duration = 10000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      const timer = setTimeout(() => {
        onSlideChange(currentSlide + 1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progress, isPlaying, currentSlide, onSlideChange]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
          ZKAV Club Opportunities
        </h2>
        <p className="text-muted-foreground text-lg">
          Privacy-first audiovisual roles and paid gigs with the
          Zero-knowledge Audiovisual Club
        </p>
      </motion.div>

      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className="relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-violet-400 w-8"
                  : "bg-slate-400/30 hover:bg-slate-400/50"
              }`}
            />
            {index === currentSlide && isPlaying && (
              <motion.div
                className="absolute inset-0 bg-violet-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${slide.color} p-1 shadow-2xl`}
            >
              <div className="w-full h-full bg-background rounded-xl flex items-center justify-center">
                <Icon className="w-12 h-12 text-foreground" />
              </div>

              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${slide.color} opacity-50`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
          >
            {slide.title}
          </motion.h3>

          <div className="grid gap-4 mb-8">
            {slide.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4 bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 hover:border-violet-400/50 hover:bg-card/70 transition-all group"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                  className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${slide.color} flex items-center justify-center text-white font-bold shadow-lg`}
                >
                  {index + 1}
                </motion.div>
                <div className="flex-1 pt-1">
                  <p className="text-foreground text-lg group-hover:text-violet-400 transition-colors">
                    {step}
                  </p>
                </div>
                <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
              </motion.div>
            ))}
          </div>

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
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${slide.color} text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <ExternalLink className="w-5 h-5" />
              {slide.linkText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${slide.color} opacity-10 rounded-full blur-3xl pointer-events-none`}
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br ${slide.color} opacity-10 rounded-full blur-3xl pointer-events-none`}
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 text-center text-sm text-muted-foreground"
      >
        Step {currentSlide + 1} of {slides.length}
      </motion.div>
    </div>
  );
};
