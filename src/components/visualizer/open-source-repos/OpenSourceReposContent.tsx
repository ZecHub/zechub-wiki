"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Code2,
  Github,
  GitPullRequest,
  Heart,
  GitFork,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";

const slides = [
  {
    id: "explore",
    title: "Explore Repositories",
    icon: Search,
    color: "from-slate-600 to-gray-800",
    steps: [
      "Visit Zcash Protocol repository (zcash/zcash)",
      "Check Zebra alternative node (ZcashFoundation/zebra)",
      "Explore ZecHub Wiki and documentation",
      "Review wallet and tooling repositories",
      "Browse open issues labeled 'good first issue'"
    ],
    link: "https://github.com/zcash/zcash",
    linkText: "Zcash Protocol Repo"
  },
  {
    id: "setup",
    title: "Fork & Clone Repository",
    icon: GitFork,
    color: "from-blue-500 to-indigo-600",
    steps: [
      "Click 'Fork' button on the repository page",
      "Clone your forked repository to local machine",
      "Set up development environment per README",
      "Add upstream remote to track original repo",
      "Create a new branch for your changes"
    ],
    link: "https://docs.github.com/en/get-started/quickstart/fork-a-repo",
    linkText: "GitHub Fork Guide"
  },
  {
    id: "develop",
    title: "Make Your Contribution",
    icon: Code2,
    color: "from-emerald-500 to-green-600",
    steps: [
      "Write clean, well-documented code",
      "Follow the project's coding standards",
      "Add tests for new features or bug fixes",
      "Update documentation as needed",
      "Commit changes with clear, descriptive messages"
    ],
    link: "https://www.conventionalcommits.org/",
    linkText: "Commit Best Practices"
  },
  {
    id: "pr",
    title: "Submit Pull Request",
    icon: GitPullRequest,
    color: "from-purple-500 to-pink-600",
    steps: [
      "Push your branch to your forked repository",
      "Open a pull request to the main repository",
      "Write a clear PR description explaining changes",
      "Link related issues using keywords (fixes #123)",
      "Request review from project maintainers"
    ],
    link: "https://github.com/zcash/zcash/pulls",
    linkText: "View Open PRs"
  },
  {
    id: "review",
    title: "Code Review & Collaboration",
    icon: MessageSquare,
    color: "from-amber-500 to-orange-600",
    steps: [
      "Respond to reviewer feedback promptly",
      "Make requested changes in new commits",
      "Participate in technical discussions",
      "Address CI/CD test failures if any",
      "Be patient and professional throughout"
    ],
    link: "https://github.com/zcash/zcash/blob/master/CONTRIBUTING.md",
    linkText: "Contributing Guide"
  },
  {
    id: "merge",
    title: "Merge & Recognition",
    icon: Heart,
    color: "from-rose-500 to-red-600",
    steps: [
      "PR gets approved by maintainers",
      "Your contribution is merged to main branch",
      "You're added to the contributors list",
      "Consider ongoing contributions to the project",
      "Share your success with the community!"
    ],
    link: "https://github.com/zechub/zechub",
    linkText: "Contribute to ZecHub"
  }
];

export { slides };

interface OpenSourceReposContentProps {
  currentSlide: number;
  onSlideChange: (index: number) => void;
  isPlaying: boolean;
}

export const OpenSourceReposContent = ({ 
  currentSlide, 
  onSlideChange,
  isPlaying 
}: OpenSourceReposContentProps) => {
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
        <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-slate-400 to-gray-600 bg-clip-text text-transparent">
          Open Source Repositories
        </h2>
        <p className="text-muted-foreground text-lg">
          Contribute to Zcash open source projects
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
                  ? 'bg-slate-400 w-8' 
                  : 'bg-slate-400/30 hover:bg-slate-400/50'
              }`}
            />
            {index === currentSlide && isPlaying && (
              <motion.div
                className="absolute inset-0 bg-slate-400 rounded-full"
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
                className="flex items-start gap-4 bg-card/50 backdrop-blur-sm p-5 rounded-xl border border-border/50 hover:border-slate-400/50 hover:bg-card/70 transition-all group"
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
                  <p className="text-foreground text-lg group-hover:text-slate-400 transition-colors">
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
