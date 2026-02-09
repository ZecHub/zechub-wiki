"use client";

import { Button } from "@/components/UI/shadcn/button";
import { Progress } from "@/components/UI/shadcn/progress";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, HelpCircle, XCircle } from "lucide-react";
import React, { useState } from "react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizModuleProps {
  title: string;
  questions: QuizQuestion[];
  className?: string;
}

export function QuizModule({ title, questions, className = "" }: QuizModuleProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 border-emerald-500/40 bg-emerald-950/30 dark:bg-emerald-950/40 p-6 md:p-8 ${className}`}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <h3 className="text-xl font-bold text-emerald-100">{title}</h3>
        </div>
        {!isOnResults && (
          <span className="text-sm text-emerald-200/90">
            Question {currentIndex + 1} of {total}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!isOnResults && total > 0 && (
        <div className="mb-6">
          <Progress
            value={((currentIndex + 1) / total) * 100}
            className="h-2 bg-emerald-900/50"
          />
        </div>
      )}

      <div className="min-h-[280px]">
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
              <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-100 font-semibold">Score:</span>
                  <span className="text-emerald-300 font-bold">
                    {score} / {total}
                  </span>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/20"
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
                      className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-4"
                    >
                      <p className="font-medium text-foreground mb-2">{q.question}</p>
                      <div className="flex items-center gap-2 flex-wrap">
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
                <div className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-4">
                  <p className="font-medium text-foreground mb-4 text-lg">
                    {currentQuestion.question}
                  </p>
                  <div className="space-y-2">
                    {currentQuestion.options.map((opt, optIndex) => {
                      const isSelected = selected[currentIndex] === optIndex;
                      const optionStyle =
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-left " +
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

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          onClick={handlePrev}
          disabled={currentIndex === 0 && !showResults}
          variant="outline"
          className="border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {!isOnResults ? (
          <Button
            onClick={handleNext}
            disabled={!hasSelectedCurrent}
            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0 disabled:opacity-50"
          >
            {currentIndex < total - 1 ? (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
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
