"use client";

import useLocalStorage from "@/hook/useLocalStorage";
import { Lock } from "lucide-react";
import NextLink from "next/link";
import {
  TQuizParts,
  QuizParts,
  QuizPartsKey,
  TLevelParts,
  LevelParts,
} from "../../parts";
import { useParams, redirect } from "next/navigation";
import QuizCard from "@/components/QuizCard";

export default function LevelPage() {
  const { id } = useParams<{ id: string }>();
  const levelId = id ? parseInt(id) : 0;
  const quiz = QuizParts(levelId);

  const [levelParts] = useLocalStorage<TLevelParts>("levelParts", LevelParts);
  const currentLevel = levelParts?.find((item) => item.id === levelId);

  const [quizParts, _] = useLocalStorage<TQuizParts>(
    QuizPartsKey(levelId),
    quiz,
  );

  if (currentLevel && currentLevel.passed === false) {
    redirect("/levels");
    return null;
  }

  if (!quizParts) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-6 md:px-0">
      <h1 className={`text-3xl font-bold mb-8 text-center`}>Level {levelId}</h1>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl`}
      >
        {quizParts.data.map((item, idx) => (
          <QuizCard
            key={idx}
            idx={idx}
            levelId={levelId}
            item={item}
            isLast={idx === quizParts.data.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
