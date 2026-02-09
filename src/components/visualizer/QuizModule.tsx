"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/UI/shadcn/button";

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
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
  };

  const score = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.correctIndex ? 1 : 0),
    0
  );
  const total = questions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 border-emerald-500/40 bg-emerald-950/30 dark:bg-emerald-950/40 p-6 md:p-8 ${className}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-6 h-6 text-emerald-400" />
        <h3 className="text-xl font-bold text-emerald-100">{title}</h3>
      </div>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="rounded-lg bg-emerald-900/20 dark:bg-emerald-900/30 border border-emerald-500/20 p-4"
          >
            <p className="font-medium text-foreground mb-3">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, optIndex) => {
                const isSelected = selected[qIndex] === optIndex;
                const isCorrect = optIndex === q.correctIndex;
                const showResult = submitted;

                let optionStyle =
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-left ";
                if (!showResult) {
                  optionStyle += isSelected
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                    : "border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-500/10";
                } else {
                  if (isCorrect) {
                    optionStyle += " border-emerald-500 bg-emerald-500/25 text-emerald-100";
                  } else if (isSelected && !isCorrect) {
                    optionStyle += " border-red-500/60 bg-red-500/15 text-red-200";
                  } else {
                    optionStyle += " border-border/50 bg-muted/30 text-muted-foreground";
                  }
                }

                return (
                  <div
                    key={optIndex}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelect(qIndex, optIndex)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleSelect(qIndex, optIndex);
                    }}
                    className={optionStyle}
                    aria-pressed={isSelected}
                    aria-label={`${opt}${showResult && isCorrect ? " (Correct)" : ""}`}
                  >
                    {showResult && (
                      <span className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : null}
                      </span>
                    )}
                    <span className="flex-1">{opt}</span>
                    {showResult && isCorrect && (
                      <span className="text-xs font-medium text-emerald-400">Correct</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(selected).length !== questions.length}
            className="bg-emerald-600 hover:bg-emerald-500 text-white border-0"
          >
            Submit Quiz
          </Button>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4"
        >
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
        </motion.div>
      )}
    </motion.div>
  );
}
