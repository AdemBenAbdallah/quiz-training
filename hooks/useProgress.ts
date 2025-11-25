import { TLevelParts } from "@/app/(preview)/parts";
import useSWR, { mutate } from "swr";

interface QuizPartWithAccess {
  id: number;
  start: number;
  end: number;
  passed: boolean;
  accessible: boolean;
  needsPayment?: boolean;
}

interface EnhancedQuizParts {
  level: number;
  data: QuizPartWithAccess[];
  QUESTIONS_PER_PART: number;
}

interface ProgressData {
  levelParts: TLevelParts;
  quizPartsByLevel: Record<number, EnhancedQuizParts>;
}

const fetcher = async (url: string): Promise<ProgressData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

export const useProgress = () => {
  const { data, error, isLoading } = useSWR<ProgressData>(
    "/api/progress",
    fetcher,
  );

  const updateProgress = async (levelId: number, partId: number) => {
    const key = "/api/progress";

    // Optimistic update
    mutate(
      key,
      (current) => {
        if (!current) return current;

        const newData = { ...current };

        // Update quiz part
        const quizParts = { ...newData.quizPartsByLevel[levelId] };
        const updatedQuizData = quizParts.data.map(
          (part: {
            id: number;
            start: number;
            end: number;
            passed: boolean;
          }) => {
            if (part.id === partId) {
              return { ...part, passed: true };
            }
            return part;
          },
        );

        newData.quizPartsByLevel[levelId] = {
          ...quizParts,
          data: updatedQuizData,
        };

        // Check if last part to unlock next level
        const isLastPart = partId === quizParts.data.length;
        if (isLastPart && levelId < 8) {
          newData.levelParts = newData.levelParts.map(
            (level: { id: number; passed: boolean }) => {
              if (level.id === levelId + 1) {
                return { ...level, passed: true };
              }
              return level;
            },
          );
        }

        return newData;
      },
      false,
    );

    // Actual API call
    try {
      await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quiz_part",
          levelId,
          partId,
        }),
      });

      // Revalidate to ensure consistency
      mutate(key);
    } catch (error) {
      // Revert optimistic update on error
      mutate(key);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    updateProgress,
  };
};
