"use client";

import { QuizContainer } from "./quiz/components/QuizContainer";
import { Question } from "@/types/quiz";

type QuizProps = {
  idx: number;
  levelId: number;
  questions: Question[];
  title: string;
};

function Quiz({ idx, levelId, questions, title = "Quiz" }: QuizProps) {
  return (
    <QuizContainer
      idx={idx}
      levelId={levelId}
      questions={questions}
      title={title}
    />
  );
}

export default Quiz;
