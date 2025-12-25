"use client";

import { Question } from "@/types/quiz";
import { QuizContainer } from "./quiz/components/QuizContainer";

type QuizProps = {
  certificateSlug: string;
  levelId: number;
  questions: Question[];
  title: string;
  onBack?: () => void;
};

function Quiz({
  certificateSlug,
  levelId,
  questions,
  title = "Quiz",
  onBack,
}: QuizProps) {
  return (
    <QuizContainer
      certificateSlug={certificateSlug}
      levelId={levelId}
      questions={questions}
      title={title}
      onBack={onBack}
    />
  );
}

export default Quiz;
