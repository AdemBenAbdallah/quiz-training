"use client";

import { Question } from "@/types/quiz";
import { QuizContainer } from "./quiz/components/QuizContainer";

type QuizProps = {
  levelId: number;
  questions: Question[];
  title: string;
  onBack?: () => void;
};

function Quiz({ levelId, questions, title = "Quiz", onBack }: QuizProps) {
  return (
    <QuizContainer
      levelId={levelId}
      questions={questions}
      title={title}
      onBack={onBack}
    />
  );
}

export default Quiz;
