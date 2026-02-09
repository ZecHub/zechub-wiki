"use client";

import { Button } from "@/components/UI/shadcn/button";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import React, { useState } from "react";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

interface QuizModuleProps {
  title: string;
  questions: QuizQuestion[];
  onComplete?: () => void;
  passingScore?: number; // percentage to pass (default 70%)
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  title,
  questions,
  onComplete,
  passingScore = 70,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null),
  );
  const [showResults, setShowResults] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswerRevealed) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsAnswerRevealed(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
    setIsAnswerRevealed(false);
  };

  const calculateScore = () => {
    const correctCount = selectedAnswers.filter(
      (answer, index) => answer === questions[index].correctAnswer,
    ).length;
    return {
      correct: correctCount,
      total: questions.length,
      percentage: Math.round((correctCount / questions.length) * 100),
    };
  };

  const score = calculateScore();
  const isPassing = score.percentage >= passingScore;

  if (showResults) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl">
            {/* Score Display */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
                  isPassing
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-amber-500 to-orange-600"
                }`}
              >
                <Trophy className="w-16 h-16 text-white" />
              </motion.div>

              <h2 className="text-4xl font-bold mb-4">
                {isPassing ? "Great Job! 🎉" : "Good Effort! 💪"}
              </h2>

              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {score.percentage}%
              </div>

              <p className="text-xl text-muted-foreground mb-2">
                You got {score.correct} out of {score.total} questions correct
              </p>

              {isPassing ? (
                <p className="text-emerald-500 font-semibold">
                  You passed! Well done! ✓
                </p>
              ) : (
                <p className="text-amber-500 font-semibold">
                  Keep learning! You need {passingScore}% to pass.
                </p>
              )}
            </div>

            {/* Answer Review */}
            <div className="space-y-4 mb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">
                Review Your Answers
              </h3>

              {questions.map((question, qIndex) => {
                const userAnswer = selectedAnswers[qIndex];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                    className={`bg-card/40 border rounded-xl p-6 ${
                      isCorrect ? "border-emerald-500/50" : "border-red-500/50"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      {isCorrect ? (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <X className="w-5 h-5 text-red-500" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-3">
                          {qIndex + 1}. {question.question}
                        </h4>

                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => {
                            const isUserAnswer = userAnswer === oIndex;
                            const isCorrectAnswer =
                              question.correctAnswer === oIndex;

                            return (
                              <div
                                key={oIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? "border-emerald-500/50 bg-emerald-500/10"
                                    : isUserAnswer
                                      ? "border-red-500/50 bg-red-500/10"
                                      : "border-border/30"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                  )}
                                  <span
                                    className={
                                      isCorrectAnswer ? "font-semibold" : ""
                                    }
                                  >
                                    {option}
                                  </span>
                                  {isCorrectAnswer && (
                                    <span className="text-emerald-500 text-sm ml-auto">
                                      ✓ Correct
                                    </span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-red-500 text-sm ml-auto">
                                      Your answer
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && !isCorrect && (
                          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-sm text-blue-400">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleRetakeQuiz}
                variant="outline"
                size="lg"
                className="border-border/50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Quiz
              </Button>

              {onComplete && (
                <Button
                  onClick={onComplete}
                  size="lg"
                  className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full"
      >
        <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <div className="px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <span className="text-sm font-semibold">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-border/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold mb-6">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = isAnswerRevealed && isCorrect;
                  const showIncorrect =
                    isAnswerRevealed && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={isAnswerRevealed}
                      whileHover={!isAnswerRevealed ? { scale: 1.02 } : {}}
                      whileTap={!isAnswerRevealed ? { scale: 0.98 } : {}}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? "border-emerald-500 bg-emerald-500/20"
                          : showIncorrect
                            ? "border-red-500 bg-red-500/20"
                            : isSelected
                              ? "border-yellow-500 bg-yellow-500/10"
                              : "border-border/50 bg-card/40 hover:border-yellow-500/50"
                      } ${isAnswerRevealed ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex-1 font-medium">{option}</span>

                        {showCorrect && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}

                        {showIncorrect && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              {isAnswerRevealed && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-6"
                >
                  <p className="text-sm">
                    <strong className="text-blue-400">Explanation:</strong>{" "}
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!isAnswerRevealed ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    size="lg"
                    className="flex-1 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    size="lg"
                    className="flex-1 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 text-slate-900"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? "Next Question"
                      : "See Results"}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
