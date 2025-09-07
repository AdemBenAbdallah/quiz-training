import { useCallback } from "react";
import {
  TQuizParts,
  QuizParts,
  QuizPartsKey,
  TLevelParts,
  LevelParts,
  LevelPartsKey,
} from "@/app/(preview)/parts";
import useLocalStorage, { encryptData } from "@/hook/useLocalStorage";

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
  const [quizParts, setQuizParts] = useLocalStorage<TQuizParts>(
    QuizPartsKey(levelId),
    QuizParts(levelId),
  );

  const [levelParts, setLevelParts] = useLocalStorage<TLevelParts>(
    LevelPartsKey,
    LevelParts,
  );

  // Check if current part is accessible
  const isPartAccessible = Boolean(
    quizParts?.data.find((part) => part.id === +partId)?.passed,
  );

  // Check if this is the last part of the current level
  const isLastPart = Boolean(
    quizParts && Number(partId) === quizParts.data.length,
  );

  const passToNextPart = useCallback(() => {
    if (!quizParts) return;

    if (isLastPart) {
      // Unlock next level
      setLevelParts((prevLevelParts) => {
        if (!prevLevelParts) return prevLevelParts;

        return prevLevelParts.map((level) => {
          if (Number(level.id) === Number(levelId) + 1) {
            return { ...level, passed: true };
          }
          return level;
        });
      });

      // Initialize next level's quiz parts with first part unlocked
      const newLevelId = Number(levelId) + 1;
      const newQuizParts = QuizParts(newLevelId);

      try {
        localStorage.setItem(
          QuizPartsKey(newLevelId),
          encryptData(JSON.stringify(newQuizParts)),
        );
      } catch (error) {
        console.warn(
          `Error setting localStorage key "${QuizPartsKey(newLevelId)}":`,
          error,
        );
      }
    } else {
      // Unlock next part in current level
      setQuizParts((prevQuizParts) => {
        if (!prevQuizParts) return prevQuizParts;

        const newData = prevQuizParts.data.map((part) => {
          if (Number(part.id) === Number(partId) + 1) {
            return { ...part, passed: true };
          }
          return part;
        });

        return { ...prevQuizParts, data: newData };
      });
    }
  }, [
    quizParts,
    levelParts,
    levelId,
    partId,
    isLastPart,
    setQuizParts,
    setLevelParts,
  ]);

  const resetProgression = useCallback(() => {
    // Reset current level quiz parts
    setQuizParts(QuizParts(levelId));

    // Reset level parts to initial state
    setLevelParts(LevelParts);
  }, [levelId, setQuizParts, setLevelParts]);

  return {
    quizParts,
    levelParts,
    isPartAccessible,
    isLastPart,
    passToNextPart,
    resetProgression,
  };
};
