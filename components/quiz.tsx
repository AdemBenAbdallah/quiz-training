"use client";

import { QuizPart, QuizParts } from "@/app/(preview)/parts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import useLocalStorage from "@/hook/useLocalStorage";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw,
  X,
} from "lucide-react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import QuestionExplainDialog from "./QuestionExplainDialog";
import QuizReview from "./quiz-overview";
import QuizScore from "./score";

export type Choice = "A" | "B" | "C" | "D" | "E";
export type Question = {
  question: string;
  options: string[];
  answer: Choice[];
  questionNumber?: string;
  answerComments?: string[];
  multipleAnswers?: boolean;
};

type QuizProps = {
  idx: number;
  questions: Question[];
  title: string;
};

const QuestionCard: React.FC<{
  question: Question;
  selectedAnswers: Choice[];
  onSelectAnswer: (answer: Choice) => void;
  isSubmitted: boolean;
  showCorrectAnswer: boolean;
}> = ({ question, selectedAnswers, onSelectAnswer, showCorrectAnswer }) => {
  const answerLabels: Choice[] = ["A", "B", "C", "D", "E"];
  const availableOptions = answerLabels.slice(0, question.options.length);

  return (
    <div className="space-y-6">
      {question.questionNumber && (
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          {question.questionNumber}
        </div>
      )}
      <h2 className="text-lg font-semibold leading-tight">
        {question.question}
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant={
              selectedAnswers.includes(availableOptions[index])
                ? "secondary"
                : "outline"
            }
            className={`h-auto py-6 px-4 justify-start text-left whitespace-normal ${
              showCorrectAnswer &&
              question.answer.includes(availableOptions[index])
                ? "bg-green-600 hover:bg-green-700"
                : showCorrectAnswer &&
                    selectedAnswers.includes(availableOptions[index]) &&
                    !question.answer.includes(availableOptions[index])
                  ? "bg-red-600 hover:bg-red-700"
                  : ""
            }`}
            onClick={() => onSelectAnswer(availableOptions[index])}
          >
            <span className="text-lg font-medium mr-4 shrink-0">
              {availableOptions[index]}
            </span>
            <span className="flex-grow">{option}</span>
            {(showCorrectAnswer &&
              question.answer.includes(availableOptions[index])) ||
              (selectedAnswers.includes(availableOptions[index]) && (
                <Check className="ml-2 shrink-0 text-white" size={20} />
              ))}
            {showCorrectAnswer &&
              selectedAnswers.includes(availableOptions[index]) &&
              !question.answer.includes(availableOptions[index]) && (
                <X className="ml-2 shrink-0 text-white" size={20} />
              )}
          </Button>
        ))}
      </div>
      {showCorrectAnswer && question.answerComments && (
        <div className="mt-4 p-4 bg-muted rounded text-sm">
          <div className="font-semibold mb-2">Answer Comments:</div>
          <ul className="list-disc pl-5 space-y-2">
            {question.answerComments.map((comment, idx) => (
              <li key={idx}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function Quiz({ idx, questions, title = "Quiz" }: QuizProps) {
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

      if (currentAnswers.includes(answer)) {
        newAnswers[currentQuestionIndex] = currentAnswers.filter(
          (a) => a !== answer,
        );
      } else if (questions[currentQuestionIndex].answer.length === 1) {
        newAnswers[currentQuestionIndex] = [answer];
      } else {
        newAnswers[currentQuestionIndex] = [...currentAnswers, answer];
      }

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
    const correctAnswers = questions.reduce(
      (acc: number, question: Question, index: number) => {
        const userAnswers = answers[index] || [];
        const correctAnswerSet = new Set(question.answer);
        const userAnswerSet = new Set(userAnswers);
        return (
          acc +
          (correctAnswerSet.size === userAnswerSet.size &&
          [...correctAnswerSet].every((answer) => userAnswerSet.has(answer))
            ? 1
            : 0)
        );
      },
      0,
    );
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

  const [quizParts, setQuizParts] = useLocalStorage<QuizPart[]>(
    "quizPart",
    QuizParts,
  );
  if (!quizParts) return null;

  // check if it open
  const isAllPassed = quizParts.find((part) => part.id === +idx)?.passed;
  if (!isAllPassed) return null;

  const handlePassNextPart = () => {
    setQuizParts(() => {
      return quizParts.map((part, index) => {
        if (index === +idx) {
          return {
            ...part,
            passed: true,
          };
        }
        return part;
      });
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-center text-foreground">
            {title}
          </h1>
          <QuestionExplainDialog question={currentQuestion} />
        </div>
        <div className="relative">
          {!isSubmitted.every(Boolean) && (
            <Progress value={progress} className="h-1 mb-8" />
          )}
          <div className="min-h-[400px]">
            {" "}
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
                      <div className="flex justify-center pt-4">
                        <Button
                          onClick={handleSubmitCurrent}
                          disabled={!answers[currentQuestionIndex]?.length}
                          className="w-full max-w-xs"
                        >
                          Submit
                        </Button>
                      </div>
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
