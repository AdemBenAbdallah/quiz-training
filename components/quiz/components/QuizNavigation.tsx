"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { QuizNavigationState, QuizNavigationActions } from "../hooks/useQuizNavigation";

interface QuizNavigationProps {
  navigation: QuizNavigationState & QuizNavigationActions;
  totalQuestions: number;
}

export const QuizNavigation = ({ navigation, totalQuestions }: QuizNavigationProps) => {
  const {
    currentQuestionIndex,
    canGoNext,
    canGoPrevious,
    isLastQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
  } = navigation;

  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        onClick={goToPreviousQuestion}
        disabled={!canGoPrevious}
        variant="ghost"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>

      <span className="text-sm font-medium">
        {currentQuestionIndex + 1} / {totalQuestions}
      </span>

      <Button
        onClick={goToNextQuestion}
        disabled={!canGoNext}
        variant="ghost"
      >
        {isLastQuestion ? "Finish" : "Next"}{" "}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
