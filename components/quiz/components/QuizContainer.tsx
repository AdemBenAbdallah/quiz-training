"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/types/quiz";
import { useQuizState } from "../hooks/useQuizState";
import { useQuizNavigation } from "../hooks/useQuizNavigation";
import { useQuizProgression } from "../hooks/useQuizProgression";
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
  // State management
  const quizState = useQuizState(questions);
  const progression = useQuizProgression(levelId, idx);

  // Handle quiz completion and progression
  const handleQuizSubmit = () => {
    // const correctAnswers = quizState.submitQuiz();

    // // If perfect score, unlock next part/level
    // if (correctAnswers === questions.length) {
    progression.passToNextPart();
    // }
  };

  // Navigation with quiz submission
  const navigation = useQuizNavigation(
    questions,
    quizState.answers,
    handleQuizSubmit,
  );

  // Reset everything when quiz is reset
  const handleReset = () => {
    quizState.resetQuiz();
    navigation.reset();
  };

  if (!progression.isPartAccessible) {
    return null;
  }

  const currentQuestion = questions[navigation.currentQuestionIndex];
  const isCurrentQuestionSubmitted = quizState.isQuestionSubmitted(
    navigation.currentQuestionIndex,
  );
  const currentAnswers = quizState.getQuestionAnswers(
    navigation.currentQuestionIndex,
  );

  const handleSelectAnswer = (answer: any) => {
    quizState.selectAnswer(navigation.currentQuestionIndex, answer);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <QuizHeader title={title} />

        <button
          onClick={handleQuizSubmit}
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Submit test
        </button>
        <div className="relative">
          {!quizState.isQuizComplete && (
            <Progress value={navigation.progress} className="h-1 mb-8" />
          )}

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={
                  isCurrentQuestionSubmitted
                    ? `results-${navigation.currentQuestionIndex}`
                    : navigation.currentQuestionIndex
                }
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {!quizState.isQuizComplete ? (
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
                      navigation={navigation}
                      totalQuestions={questions.length}
                    />
                  </div>
                ) : (
                  <div className="space-y-8">
                    <QuizScore
                      correctAnswers={quizState.score ?? 0}
                      totalQuestions={questions.length}
                    />

                    <div className="space-y-12">
                      <QuizReview
                        questions={questions}
                        userAnswers={quizState.answers}
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
