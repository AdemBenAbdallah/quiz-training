import useSWR from "swr";

interface GamificationData {
  gamification: {
    totalXp: number;
    currentStreak: number;
    longestStreak: number;
    level: number;
    levelProgress: number;
  };
  questionCount: number;
  achievements: {
    unlocked: number;
    total: number;
    list: any[];
  };
  dailyGoal: {
    questionsAnswered: number;
    xpEarned: number;
    goalType: "questions" | "xp";
    goalValue: number;
    isCompleted: boolean;
    progress: number;
  };
  streak: {
    current: number;
    longest: number;
    formatted: string;
    label: string;
    streakLost: boolean;
  };
}

const fetcher = async (url: string): Promise<GamificationData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch gamification data");
  return res.json();
};

export const useGamification = (certificateSlug?: string) => {
  const key = certificateSlug
    ? `/api/gamification/stats?certificate=${certificateSlug}`
    : "/api/gamification/stats";

  const { data, error, isLoading, mutate: mutateSWR } = useSWR<GamificationData>(key, fetcher);

  const gainXp = async (
    action: "correct_answer" | "incorrect_answer" | "level_complete" | "daily_goal" | "perfect_score" | "first_try",
    metadata?: {
      certificateSlug?: string;
      levelId?: number;
      questionCount?: number;
      score?: number;
    },
  ) => {
    try {
      const res = await fetch("/api/gamification/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          certificateSlug: metadata?.certificateSlug || certificateSlug,
          levelId: metadata?.levelId,
          questionCount: metadata?.questionCount,
          score: metadata?.score,
        }),
      });

      if (!res.ok) throw new Error("Failed to add XP");

      const result = await res.json();

      mutateSWR();

      return result;
    } catch (error) {
      console.error("Error adding XP:", error);
      throw error;
    }
  };

  return {
    data,
    error,
    isLoading,
    gainXp,
    refresh: mutateSWR,
  };
};
