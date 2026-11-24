"use client";

import { Button } from "@/components/UI/shadcn/button";
import { Progress } from "@/components/UI/shadcn/progress";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X,
  XCircle,
} from "lucide-react";
import React, { useId, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizModuleProps {
  title: string;
  questions: QuizQuestion[];
  className?: string;
  onClose?: () => void;
}

interface QuizCardProps {
  title: string;
  description?: string;
  className?: string;
  onOpen: () => void;
}

const DEFAULT_QUIZ_DESCRIPTION =
  "Test your knowledge with a short quiz. Click to open.";

/**
 * Grid card that looks like the other visualizer cards.
 * Used as the minimized quiz entry point.
 */
export function QuizCard({
  title,
  description = DEFAULT_QUIZ_DESCRIPTION,
  className = "",
  onOpen,
}: QuizCardProps) {
  const descriptionId = useId();
  const { t } = useLanguage();
  const desc =
    description === DEFAULT_QUIZ_DESCRIPTION
      ? t?.visualizer?.defaultQuizDescription ?? DEFAULT_QUIZ_DESCRIPTION
      : description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      tabIndex={-1}
      className={`h-full ${className}`}
    >
      <div className="group relative h-full">
        <div className="flex h-full min-h-[150px] flex-col rounded-xl border border-brand/40 bg-brand/10 p-5 transition-colors group-hover:border-brand group-hover:bg-brand/15 dark:border-brand/40 dark:bg-brand/10">
          <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand dark:text-brand-soft">
            <HelpCircle aria-hidden="true" className="h-3.5 w-3.5" />
            Quiz
          </span>
          <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
          <p id={descriptionId} className="flex-1 text-sm leading-relaxed text-muted-foreground">
            {desc}
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand dark:text-brand-soft">
            {(t?.visualizer?.clickToOpenQuiz ?? "Open quiz").replace(/\s*→\s*$/, "")}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </span>
        </div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={title}
          aria-describedby={descriptionId}
          className="absolute inset-0 h-full w-full cursor-pointer rounded-xl border-0 bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>
    </motion.div>
  );
}

/**
 * Full-width quiz module (expanded state), rendered below the section grid.
 */
export function QuizModule({
  title,
  questions,
  className = "",
  onClose,
}: QuizModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const total = questions.length;
  const isOnResults = showResults;
  const currentQuestion = questions[currentIndex];
  const hasSelectedCurrent =
    currentQuestion && selected[currentIndex] !== undefined;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 border-emerald-500/40 bg-emerald-950/30 dark:bg-emerald-950/40 p-4 sm:p-6 md:p-8 w-full max-w-full ${className}`}
    >
      {/* Header: stack on mobile, row on larger screens */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 min-w-0">
          <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
          <h3 className="text-lg sm:text-xl font-bold text-foreground dark:text-emerald-100 truncate">
            {title}
          </h3>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
          {!isOnResults && (
            <span className="text-xs sm:text-sm text-foreground dark:text-emerald-200/90 whitespace-nowrap">
              Question {currentIndex + 1} of {total}
            </span>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-foreground dark:text-emerald-200 dark:hover:text-emerald-100 hover:bg-emerald-500/20 shrink-0 h-8 w-8"
              aria-label="Close quiz"
            >
              <X className="w-4 h-4 shrink-0" />
            </Button>
          )}
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
                  <span className="text-foreground dark:text-emerald-100 font-semibold text-sm sm:text-base">
                    Score:
                  </span>
                  <span className="text-foreground dark:text-emerald-300 font-bold text-sm sm:text-base">
                    {score} / {total}
                  </span>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-emerald-500/50 text-foreground dark:text-emerald-200 hover:bg-emerald-500/20 w-full sm:w-auto"
                >
                  Retry Quiz
                </Button>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-foreground dark:text-emerald-200/90">
                  Correct answers
                </p>
                {questions.map((q, qIndex) => {
                  const correctOpt = q.options[q.correctIndex];
                  const userOpt = selected[qIndex];
                  const isCorrect = userOpt === q.correctIndex;
                  return (
                    <div
                      key={qIndex}
                      className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-3 sm:p-4"
                    >
                      <p className="font-medium text-foreground mb-2 text-sm sm:text-base break-words">
                        {q.question}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        )}
                        <span className="text-sm text-foreground dark:text-emerald-100">
                          Correct: {correctOpt}
                        </span>
                        {!isCorrect && selected[qIndex] !== undefined && (
                          <span className="text-sm text-foreground dark:text-red-300/90">
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
                          ? "border-emerald-400 bg-emerald-500/20 text-foreground dark:text-emerald-100"
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
          className="border-emerald-500/50 text-foreground dark:text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50 w-full md:w-auto min-w-0 max-w-full md:min-w-0 order-2 md:order-1 shrink-0"
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
