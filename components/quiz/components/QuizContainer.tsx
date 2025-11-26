"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Question, Choice } from "@/types/quiz";
import { TQuizParts, TLevelParts } from "@/app/(preview)/parts";
import { useProgress } from "@/hooks/useProgress";
import { handleAnswerSelection, calculateScore } from "@/lib/selection";
import { QuizHeader } from "./QuizHeader";
import { QuizNavigation } from "./QuizNavigation";
import { QuizActions } from "./QuizActions";
import QuestionCard from "@/components/QuestionCard";
import QuestionExplainDialog from "@/components/QuestionExplainDialog";
import QuizScore from "@/components/score";
import QuizReview from "@/components/quiz-overview";

interface QuizContainerProps {
  idx: number;
  levelId: number;
  questions: Question[];
  title: string;
}

export const QuizContainer = ({
  idx,
  levelId,
  questions,
  title = "Quiz",
}: QuizContainerProps) => {
  // Quiz state management
  const [answers, setAnswers] = useState<Choice[][]>(
    Array(questions.length).fill([]) as Choice[][],
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean[]>(
    Array(questions.length).fill(false),
  );
  const [score, setScore] = useState<number | null>(null);
  const isQuizComplete = isSubmitted.every(Boolean);

  // Navigation state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Progression state
  const { data, updateProgress } = useProgress();
  const quizParts = data?.quizPartsByLevel[levelId] || null;
  const levelParts = data?.levelParts || null;
  const currentPart = quizParts?.data.find((part) => part.id === +idx);
  const isPartAccessible = Boolean(currentPart?.accessible);
  const isLastPart = Boolean(
    quizParts && Number(idx) === quizParts.data.length,
  );

  // Update progress when question changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  // Quiz state actions
  const selectAnswer = (questionIndex: number, answer: Choice) => {
    if (!isSubmitted[questionIndex]) {
      const newAnswers = [...answers];
      const currentAnswers = newAnswers[questionIndex] || [];

      newAnswers[questionIndex] = handleAnswerSelection(
        currentAnswers,
        answer,
        questions[questionIndex],
      );

      setAnswers(newAnswers);
    }
  };



  const submitQuiz = () => {
    const correctAnswers = calculateScore(answers, questions);
    setScore(correctAnswers);
    setIsSubmitted(Array(questions.length).fill(true));
    return correctAnswers;
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill([]) as Choice[][]);
    setIsSubmitted(Array(questions.length).fill(false));
    setScore(null);
  };

  const isQuestionSubmitted = (questionIndex: number) => {
    return isSubmitted[questionIndex] ?? false;
  };

  const getQuestionAnswers = (questionIndex: number) => {
    return answers[questionIndex] || [];
  };

  // Navigation actions
  const canGoNext = Boolean(answers[currentQuestionIndex]?.length);
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      handleQuizSubmit();
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const resetNavigation = () => {
    setCurrentQuestionIndex(0);
    setProgress(0);
  };

  // Progression actions
  const passToNextPart = useCallback(async () => {
    if (!quizParts) return;

    try {
      await updateProgress(levelId, idx);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }, [quizParts, levelId, idx, updateProgress]);

  // Handle quiz completion and progression
  const handleQuizSubmit = async () => {
    const correctAnswers = submitQuiz();

    try {
      if (correctAnswers === questions.length) {
        passToNextPart();
      }
    } catch (error) {
      console.error("Error progressing to next part:", error);
    }
  };

  // Reset everything when quiz is reset
  const handleReset = () => {
    resetQuiz();
    resetNavigation();
  };

  if (!isPartAccessible) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isCurrentQuestionSubmitted = isQuestionSubmitted(currentQuestionIndex);
  const currentAnswers = getQuestionAnswers(currentQuestionIndex);

  const handleSelectAnswer = (answer: any) => {
    selectAnswer(currentQuestionIndex, answer);
  };

  const handleCopy = () => {
    const text = currentQuestion.question + currentQuestion.options.join(", ");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <QuizHeader title={title} handleCopyAction={handleCopy} />

        <div className="relative">
          {!isQuizComplete && (
            <Progress value={progress} className="h-1 mb-8" />
          )}

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isCurrentQuestionSubmitted
                    ? `results-${currentQuestionIndex}`
                    : currentQuestionIndex
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!isQuizComplete ? (
                  <div className="space-y-8">
                    <QuestionCard
                      question={currentQuestion}
                      selectedAnswers={currentAnswers}
                      onSelectAnswer={handleSelectAnswer}
                      isSubmitted={isCurrentQuestionSubmitted}
                      showCorrectAnswer={isCurrentQuestionSubmitted}
                    />

                    {!isCurrentQuestionSubmitted && (
                      <QuestionExplainDialog question={currentQuestion} />
                    )}

                    <QuizNavigation
                      navigation={{
                        currentQuestionIndex,
                        progress,
                        canGoNext,
                        canGoPrevious,
                        isLastQuestion,
                        goToNextQuestion,
                        goToPreviousQuestion,
                        goToQuestion,
                        reset: resetNavigation,
                      }}
                      totalQuestions={questions.length}
                    />
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={score ?? 0}
                      totalQuestions={questions.length}
                    />

                    <div className="space-y-12">
                      <QuizReview
                        questions={questions}
                        userAnswers={answers}
                      />
                    </div>

                    <QuizActions
                      onReset={handleReset}
                      levelId={levelId}
                      showActions={true}
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};
