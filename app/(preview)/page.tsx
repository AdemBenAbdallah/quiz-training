"use client";

import Quiz from "@/components/quiz";
import data from "@/data.json";

const extractCorrectAnswer = (answersArr: string[]): "A" | "B" | "C" | "D" => {
  if (!answersArr || !answersArr.length) return "A";
  const match = answersArr[0].match(/Selected Answer: ([A-D])/);
  return (match ? match[1] : "A") as "A" | "B" | "C" | "D";
};

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

const cleanChoice = (choice: string) =>
  choice
    .replace(/^([A-D]\.\s)/, "")
    .replace(/\.?(Most Voted|Most\sVoted)$/, "")
    .trim();

export default function HomePage() {
  const quizQuestions = data.map((q: any) => ({
    questionNumber: extractQuestionNumber(q.question_number),
    question: q.question,
    options: q.choices.map(cleanChoice),
    answer: extractCorrectAnswer(q.answers),
    answerComments: q.answers
  }));

  return <Quiz title="Quiz AWS DVA-C02" questions={quizQuestions} />;
}
