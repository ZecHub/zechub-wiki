"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText,
  Github,
  MessageCircle,
  Users,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  Target
} from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    id: "prepare",
    title: "Prepare Your Proposal",
    icon: Lightbulb,
    color: "from-purple-500 to-violet-600",
    steps: [
      "Project title and applicant details",
      "Problem statement and proposed solution",
      "Deliverables, timeline, and milestones",
      "Budget and funding request",
      "Relevant experience and potential risks"
    ],
    link: "https://zcashcommunitygrants.org/",
    linkText: "Visit ZCG Website"
  },
  {
    id: "github",
    title: "Submit on GitHub",
    icon: Github,
    color: "from-slate-600 to-slate-800",
    steps: [
      "Go to Zcash Community Grants GitHub repository",
      "Open the Issues tab and click New Issue",
      "Select the grant application template",
      "Complete all required fields",
      "Submit your GitHub issue (official record)"
    ],
    link: "https://github.com/ZcashCommunityGrants/arborist-calls",
    linkText: "Open GitHub Repository"
  },
  {
    id: "forum",
    title: "Create a Forum Post",
    icon: MessageCircle,
    color: "from-blue-500 to-cyan-600",
    steps: [
      "Go to the Zcash Community Forum",
      "Create a new thread in ZCG category",
      "Use the same title as GitHub issue",
      "Add a short summary of your proposal",
      "Include a link to the GitHub issue"
    ],
    link: "https://forum.zcashcommunity.com/",
    linkText: "Visit Community Forum"
  },
  {
    id: "review",
    title: "Engage in Review",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
    steps: [
      "Monitor your GitHub issue and forum thread",
      "Respond to questions from ZCG Committee",
      "Address community feedback promptly",
      "Clarify any concerns or requirements",
      "Update proposal based on input"
    ],
    link: "https://zcashcommunitygrants.org/committee/",
    linkText: "Meet the Committee"
  },
  {
    id: "outcome",
    title: "Outcome & Next Steps",
    icon: Target,
    color: "from-amber-500 to-orange-600",
    steps: [
      "ZCG Committee reviews your complete application",
      "Approved proposals proceed to funding",
      "Begin work on deliverables and milestones",
      "Submit regular progress reports",
      "Unapproved proposals may be revised and resubmitted"
    ],
    link: "https://docs.google.com/spreadsheets/d/1FQ28rDCyRW0TiNxrm3rgD8ai2KGUsXAjPieQmI1kKKg/",
    linkText: "View Approved Projects"
  }
];

export { slides };

interface ZcashCommunityGrantsContentProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isPlaying: boolean;
}

export const ZcashCommunityGrantsContent = ({ 
  currentSlide, 
  onSlideChange,
  isPlaying 
}: ZcashCommunityGrantsContentProps) => {
  const [progress, setProgress] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const duration = 8000;
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

  // Handle slide change when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      const timer = setTimeout(() => {
        onSlideChange((currentSlide + 1) % slides.length);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progress, isPlaying, currentSlide, onSlideChange]);

  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Zcash Community Grants
        </h2>
        <p className="text-muted-foreground text-lg">
          Funding independent teams for the public good of Zcash
        </p>
      </motion.div>

      {/* Slide Navigation Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => onSlideChange(index)}
            className="relative"
          >
            <div 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-purple-400 w-8' 
                  : 'bg-slate-400/30 hover:bg-slate-400/50'
              }`}
            />
            {index === currentSlide && isPlaying && (
              <motion.div
                className="absolute inset-0 bg-purple-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                style={{ transformOrigin: 'left' }}
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
          {/* Icon Header */}
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

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground"
          >
            {slide.title}
          </motion.h3>

          {/* Steps */}
          <div className="grid gap-4 mb-8">
            {slide.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-4 bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 hover:border-purple-400/50 hover:bg-card/70 transition-all group"
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
                  <p className="text-foreground text-lg group-hover:text-purple-400 transition-colors">
                    {step}
                  </p>
                </div>
                <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
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
              className={`group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r ${slide.color} text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105`}
            >
              <ExternalLink className="w-5 h-5" />
              {slide.linkText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Decorative Elements */}
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

      {/* Progress Indicator */}
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
