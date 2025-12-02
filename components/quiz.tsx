"use client";

import { QuizContainer } from "./quiz/components/QuizContainer";
import { Question } from "@/types/quiz";

type QuizProps = {
  levelId: number;
  questions: Question[];
  title: string;
};

function Quiz({ levelId, questions, title = "Quiz" }: QuizProps) {
  return (
    <QuizContainer
      levelId={levelId}
      questions={questions}
      title={title}
    />
  );
}

export default Quiz;
