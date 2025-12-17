import useSWR, { mutate } from "swr";

interface Level {
  id: number;
  passed: boolean;
  accessible: boolean;
  needsPayment?: boolean;
}

interface ProgressData {
  levels: Level[];
}

const fetcher = async (url: string): Promise<ProgressData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch progress");
  return res.json();
};

export const useProgress = (certificateSlug?: string) => {
  const key = certificateSlug
    ? `/api/progress?certificate=${certificateSlug}`
    : "/api/progress";

  const { data, error, isLoading } = useSWR<ProgressData>(key, fetcher);

  const updateProgress = async (levelId: number, certSlug?: string) => {
    const updateKey = certSlug || certificateSlug;
    if (!updateKey) {
      throw new Error("Certificate slug is required");
    }

    // Optimistic update
    mutate(
      updateKey,
      (current) => {
        if (!current) return current;

        const newData = { ...current };

        // Update level as passed
        newData.levels = newData.levels.map((level: any) => {
          if (level.id === levelId) {
            return { ...level, passed: true };
          }
          return level;
        });

        // Unlock next level if this level was passed
        const nextLevelId = levelId + 1;
        if (nextLevelId <= 8) {
          newData.levels = newData.levels.map((level: any) => {
            if (level.id === nextLevelId) {
              return { ...level, accessible: true };
            }
            return level;
          });
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
          type: "level_complete",
          levelId,
          certificateSlug: updateKey,
        }),
      });

      // Revalidate to ensure consistency
      mutate(updateKey);
    } catch (error) {
      // Revert optimistic update on error
      mutate(updateKey);
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
