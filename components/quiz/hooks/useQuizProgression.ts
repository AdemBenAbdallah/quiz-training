import { useCallback } from "react";
import { TQuizParts, TLevelParts } from "@/app/(preview)/parts";
import { useProgress } from "@/hooks/useProgress";

export interface QuizProgressionState {
  quizParts: TQuizParts | null;
  levelParts: TLevelParts | null;
  isPartAccessible: boolean;
  isLastPart: boolean;
}

export interface QuizProgressionActions {
  passToNextPart: () => void;
  resetProgression: () => void;
}

export const useQuizProgression = (
  levelId: number,
  partId: number,
): QuizProgressionState & QuizProgressionActions => {
  const { data, updateProgress } = useProgress();

  const quizParts = data?.quizPartsByLevel[levelId] || null;
  const levelParts = data?.levelParts || null;

  // Check if current part is accessible
  const currentPart = quizParts?.data.find((part) => part.id === +partId);
  const isPartAccessible = Boolean(currentPart?.accessible);

  // Check if this is the last part of the current level
  const isLastPart = Boolean(
    quizParts && Number(partId) === quizParts.data.length,
  );

  const passToNextPart = useCallback(async () => {
    if (!quizParts) return;

    try {
      await updateProgress(levelId, partId);
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  }, [quizParts, levelId, partId, updateProgress]);

  const resetProgression = useCallback(() => {
    // This would require a separate API endpoint for reset functionality
    console.log("Reset progression not implemented yet");
  }, []);

  return {
    quizParts,
    levelParts,
    isPartAccessible,
    isLastPart,
    passToNextPart,
    resetProgression,
  };
};
