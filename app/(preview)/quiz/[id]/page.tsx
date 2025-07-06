import Quiz from "@/components/quiz";
import data from "@/data.json";
import { useMemo } from "react";

// Helper to extract the correct answer letter from the answers array
const extractCorrectAnswer = (answersArr: string[]): string => {
  if (!answersArr || !answersArr.length) return "";
  const match = answersArr[0].match(/Selected Answer: ([A-D])/);
  return match ? match[1] : "";
};

const cleanChoice = (choice: string) =>
  choice
    .replace(/^([A-D]\.\s)/, "") // Remove "A. "
    .replace(/\.?Most Voted$/, "") // Remove "Most Voted" at the end, with or without a dot
    .trim();

export default function QuizPage() {
  // Transform data.json to Quiz format
  const quizQuestions = useMemo(
    () =>
      data.map((q: any) => ({
        question: q.question,
        options: q.choices.map(cleanChoice),
        answer: extractCorrectAnswer(q.answers) as "A" | "B" | "C" | "D"
      })),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Quiz title="Quiz from data.json" questions={quizQuestions} />
    </div>
  );
}
