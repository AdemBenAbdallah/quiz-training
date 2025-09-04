"use client";

import { TQuizParts, QuizParts, QuizPartsKey } from "@/app/(preview)/parts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from "@/hook/useLocalStorage";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BadgeInfo,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import QuestionExplainDialog from "./QuestionExplainDialog";
import ServiceInfoDialog from "./ServiceInfoDialog";
import QuizReview from "./quiz-overview";
import QuizScore from "./score";
import {
  handleAnswerSelection,
  canSelectMoreAnswers,
  isAnswerCorrect,
  calculateScore,
  isChoiceDisabled,
} from "@/lib/selection";
import { Question, Choice } from "@/types/quiz";
import QuestionCard from "./QuestionCard";
import CopyButton from "./ui/copy-button";

type QuizProps = {
  idx: number;
  levelId: number;
  questions: Question[];
  title: string;
};

function Quiz({ idx, levelId, questions, title = "Quiz" }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Choice[][]>(
    Array(questions.length).fill([]) as Choice[][],
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean[]>(
    Array(questions.length).fill(false),
  );
  const [score, setScore] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  const handleSelectAnswer = (answer: Choice) => {
    if (!isSubmitted[currentQuestionIndex]) {
      const newAnswers = [...answers];
      const currentAnswers = newAnswers[currentQuestionIndex] || [];

      newAnswers[currentQuestionIndex] = handleAnswerSelection(
        currentAnswers,
        answer,
        questions[currentQuestionIndex],
      );

      setAnswers(newAnswers);
    }
  };

  const handleSubmitCurrent = () => {
    const updated = [...isSubmitted];
    updated[currentQuestionIndex] = true;
    setIsSubmitted(updated);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const correctAnswers = calculateScore(answers, questions);
    setScore(correctAnswers);
    setIsSubmitted(Array(questions.length).fill(true));
    if (correctAnswers === questions.length) {
      handlePassNextPart();
    }
  };

  const handleReset = () => {
    setAnswers(Array(questions.length).fill([]) as Choice[][]);
    setIsSubmitted(Array(questions.length).fill(false));
    setScore(null);
    setCurrentQuestionIndex(0);
    setProgress(0);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const [quizParts, setQuizParts] = useLocalStorage<TQuizParts>(
    QuizPartsKey(levelId),
    QuizParts(levelId),
  );
  if (!quizParts) return null;

  // check if it open
  const isPartAccessible = quizParts.data.find(
    (part) => part.id === +idx,
  )?.passed;
  if (!isPartAccessible) return null;

  const handlePassNextPart = () => {
    setQuizParts((prevQuizParts) => {
      if (!prevQuizParts) {
        return prevQuizParts;
      }
      const newData = prevQuizParts.data.map((part) => {
        if (part.id === +idx + 1) {
          return { ...part, passed: true };
        }
        return part;
      });
      return { ...prevQuizParts, data: newData };
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-center text-foreground">
              {title}
            </h1>
            <div className="flex items-center gap-2">
              {/*<ServiceInfoDialog question={currentQuestion} />*/}
            </div>
          </div>
          <CopyButton />
        </div>
        <div className="relative">
          {!isSubmitted.every(Boolean) && (
            <Progress value={progress} className="h-1 mb-8" />
          )}
          <div className="min-h-[400px]">
            {/* Prevent layout shift */}
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isSubmitted[currentQuestionIndex]
                    ? `sults-${currentQuestionIndex}`
                    : currentQuestionIndex
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isSubmitted.every(Boolean) ? (
                  <div className="space-y-8">
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswers={answers[currentQuestionIndex] || []}
                      onSelectAnswer={handleSelectAnswer}
                      isSubmitted={isSubmitted[currentQuestionIndex]}
                      showCorrectAnswer={isSubmitted[currentQuestionIndex]}
                    />
                    {!isSubmitted[currentQuestionIndex] && (
                      <QuestionExplainDialog question={currentQuestion} />
                    )}
                    <div className="flex justify-between items-center pt-4">
                      <Button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        variant="ghost"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                      </Button>
                      <span className="text-sm font-medium">
                        {currentQuestionIndex + 1} / {questions.length}
                      </span>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!answers[currentQuestionIndex]?.length}
                        variant="ghost"
                      >
                        {currentQuestionIndex === questions.length - 1
                          ? "Finish"
                          : "Next"}{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />
                    <div className="space-y-12">
                      <QuizReview questions={questions} userAnswers={answers} />
                    </div>
                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="bg-muted hover:bg-muted/80 w-full"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset Quiz
                      </Button>
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 w-full"
                      >
                        <NextLink href="/">
                          <FileText className="mr-2 h-4 w-4" /> View All Parts
                        </NextLink>
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Quiz;
