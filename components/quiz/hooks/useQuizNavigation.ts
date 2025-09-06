import { useState, useEffect } from "react";
import { Question, Choice } from "@/types/quiz";

export interface QuizNavigationState {
  currentQuestionIndex: number;
  progress: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export interface QuizNavigationActions {
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToQuestion: (index: number) => void;
  reset: () => void;
}

export const useQuizNavigation = (
  questions: Question[],
  answers: Choice[][],
  onSubmit: () => void
): QuizNavigationState & QuizNavigationActions => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Update progress when question changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress((currentQuestionIndex / questions.length) * 100);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentQuestionIndex, questions.length]);

  const canGoNext = Boolean(answers[currentQuestionIndex]?.length);
  const canGoPrevious = currentQuestionIndex > 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      onSubmit();
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

  const reset = () => {
    setCurrentQuestionIndex(0);
    setProgress(0);
  };

  return {
    currentQuestionIndex,
    progress,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    reset,
  };
};
