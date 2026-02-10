"use client";

import { Button } from "@/components/UI/shadcn/button";
import { Progress } from "@/components/UI/shadcn/progress";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, HelpCircle, X, XCircle } from "lucide-react";
import React, { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizModuleProps {
  title: string;
  questions: QuizQuestion[];
  description?: string;
  className?: string;
}

const DEFAULT_QUIZ_DESCRIPTION = "Test your knowledge with a short quiz. Click to open.";

export function QuizModule({ title, questions, description = DEFAULT_QUIZ_DESCRIPTION, className = "" }: QuizModuleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const total = questions.length;
  const isOnResults = showResults;
  const isOnQuestion = !isOnResults && currentIndex < total;
  const currentQuestion = questions[currentIndex];
  const hasSelectedCurrent = currentQuestion && selected[currentIndex] !== undefined;

  const handleSelect = (optionIndex: number) => {
    setSelected((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentIndex(total - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setSelected({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const score = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.correctIndex ? 1 : 0),
    0
  );

  if (!isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.95 }}
        className={className}
      >
        <div
          onClick={() => setIsExpanded(true)}
          className="cursor-pointer group flex flex-row items-center justify-between gap-4 min-h-0 bg-emerald-950/50 dark:bg-emerald-900/40 backdrop-blur-md border border-emerald-500/30 rounded-lg py-3 px-4 h-full hover:bg-emerald-900/60 hover:border-emerald-500/50 transition-all duration-300"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 group-hover:text-emerald-300 transition-colors" />
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-emerald-100 truncate group-hover:text-emerald-50 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-emerald-200/80 truncate">
                {description}
              </p>
            </div>
          </div>
          <span className="text-emerald-400 flex-shrink-0 text-xs font-medium flex items-center gap-1 group-hover:text-emerald-300 transition-colors">
            Open <ChevronDown className="w-4 h-4" />
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 border-emerald-500/40 bg-emerald-950/30 dark:bg-emerald-950/40 p-4 sm:p-6 md:p-8 min-w-0 max-w-full ${className}`}
    >
      {/* Header: stack on mobile, row on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl font-bold text-emerald-100 truncate">{title}</h3>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
          {!isOnResults && (
            <span className="text-xs sm:text-sm text-emerald-200/90 whitespace-nowrap">
              Question {currentIndex + 1} of {total}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/20 shrink-0 h-8 w-8"
            aria-label="Close quiz"
          >
            <X className="w-4 h-4 shrink-0" />
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {!isOnResults && total > 0 && (
        <div className="mb-4 sm:mb-6">
          <Progress
            value={((currentIndex + 1) / total) * 100}
            className="h-2 bg-emerald-900/50"
          />
        </div>
      )}

      <div className="min-h-[200px] sm:min-h-[280px]">
        <AnimatePresence mode="wait">
          {isOnResults ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-100 font-semibold text-sm sm:text-base">Score:</span>
                  <span className="text-emerald-300 font-bold text-sm sm:text-base">
                    {score} / {total}
                  </span>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/20 w-full sm:w-auto"
                >
                  Retry Quiz
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-emerald-200/90">Correct answers</p>
                {questions.map((q, qIndex) => {
                  const correctOpt = q.options[q.correctIndex];
                  const userOpt = selected[qIndex];
                  const isCorrect = userOpt === q.correctIndex;
                  return (
                    <div
                      key={qIndex}
                      className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-3 sm:p-4"
                    >
                      <p className="font-medium text-foreground mb-2 text-sm sm:text-base break-words">{q.question}</p>
                      <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-emerald-100">
                          Correct: {correctOpt}
                        </span>
                        {!isCorrect && selected[qIndex] !== undefined && (
                          <span className="text-sm text-red-300/90">
                            (You chose: {q.options[selected[qIndex]]})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            currentQuestion && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-3 sm:p-4">
                  <p className="font-medium text-foreground mb-3 sm:mb-4 text-base sm:text-lg">
                    {currentQuestion.question}
                  </p>
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, optIndex) => {
                      const isSelected = selected[currentIndex] === optIndex;
                      const optionStyle =
                        "flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-colors text-left text-sm sm:text-base " +
                        (isSelected
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                          : "border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/10");

                      return (
                        <div
                          key={optIndex}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelect(optIndex)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleSelect(optIndex);
                          }}
                          className={optionStyle}
                          aria-pressed={isSelected}
                        >
                          <span className="flex-1">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Navigation: stacked on small screens to avoid overflow; side-by-side on md+ */}
      <div className="mt-4 sm:mt-6 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3 md:gap-4 min-w-0 w-full">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0 && !showResults}
          variant="outline"
          className="border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50 w-full md:w-auto min-w-0 max-w-full md:min-w-0 order-2 md:order-1 shrink-0"
        >
          <ChevronLeft className="w-4 h-4 mr-2 shrink-0" />
          Previous
        </Button>
        {!isOnResults ? (
          <Button
            onClick={handleNext}
            disabled={!hasSelectedCurrent}
            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 disabled:opacity-50 w-full md:w-auto min-w-0 max-w-full md:min-w-0 order-1 md:order-2 shrink-0"
          >
            {currentIndex < total - 1 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2 shrink-0" />
              </>
            ) : (
              "See results"
            )}
          </Button>
        ) : null}
      </div>
    </motion.div>
  );
}
