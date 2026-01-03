import { db } from "@/db";
import {
  userAchievement,
  achievementDefinition,
  questionAttempt,
  userGamification,
  userLevelProgress,
} from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import {
  ACHIEVEMENT_DEFINITIONS,
  Achievement,
} from "@/types/gamification";
import crypto from "crypto";

export async function getUserAchievementsWithDetails(
  userId: string,
): Promise<Achievement[]> {
  const earnedAchievements = await db
    .select({
      achievementId: userAchievement.achievementId,
      earnedAt: userAchievement.earnedAt,
      progress: userAchievement.progress,
    })
    .from(userAchievement)
    .where(eq(userAchievement.userId, userId));

  const earnedMap = new Map<
    string,
    { earnedAt?: Date; progress?: number }
  >();
  earnedAchievements.forEach((a) => {
    earnedMap.set(a.achievementId, {
      earnedAt: a.earnedAt,
      progress: a.progress ?? undefined,
    });
  });

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const earned = earnedMap.get(def.id);
    return {
      ...def,
      isUnlocked: !!earned,
      earnedAt: earned?.earnedAt,
      progress: earned?.progress,
    };
  });
}

export async function getEarnedAchievementIds(
  userId: string,
): Promise<string[]> {
  const achievements = await db
    .select({ achievementId: userAchievement.achievementId })
    .from(userAchievement)
    .where(
      and(
        eq(userAchievement.userId, userId),
        eq(userAchievement.isComplete, true),
      ),
    );

  return achievements.map((a) => a.achievementId);
}

export async function getAchievementProgress(
  userId: string,
  achievementId: string,
): Promise<{ current: number; target: number; percentage: number } | null> {
  const achievement = ACHIEVEMENT_DEFINITIONS.find(
    (a) => a.id === achievementId,
  );
  if (!achievement) return null;

  switch (achievementId) {
    case "first_question": {
      const count = await getQuestionCount(userId);
      return { current: count, target: 1, percentage: Math.min(count * 100, 100) };
    }
    case "ten_questions": {
      const count = await getQuestionCount(userId);
      return { current: count, target: 10, percentage: Math.min(count * 10, 100) };
    }
    case "hundred_questions": {
      const count = await getQuestionCount(userId);
      return { current: count, target: 100, percentage: Math.min(count, 100) };
    }
    case "five_hundred_questions": {
      const count = await getQuestionCount(userId);
      return { current: count, target: 500, percentage: Math.min(count / 5, 100) };
    }
    case "first_streak": {
      const streak = await getCurrentStreak(userId);
      return { current: streak, target: 3, percentage: Math.min(streak / 3 * 100, 100) };
    }
    case "week_warrior": {
      const streak = await getCurrentStreak(userId);
      return { current: streak, target: 7, percentage: Math.min(streak / 7 * 100, 100) };
    }
    case "month_master": {
      const streak = await getCurrentStreak(userId);
      return { current: streak, target: 30, percentage: Math.min(streak / 30 * 100, 100) };
    }
    default:
      return null;
  }
}

async function getQuestionCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(questionAttempt)
    .where(eq(questionAttempt.userId, userId))
    .then((rows) => rows[0]);
  return result?.count || 0;
}

async function getCurrentStreak(userId: string): Promise<number> {
  const stats = await db
    .select({ currentStreak: userGamification.currentStreak })
    .from(userGamification)
    .where(eq(userGamification.id, userId))
    .then((rows) => rows[0]);
  return stats?.currentStreak || 0;
}

export async function awardAchievement(
  userId: string,
  achievementId: string,
): Promise<boolean> {
  const achievement = ACHIEVEMENT_DEFINITIONS.find(
    (a) => a.id === achievementId,
  );
  if (!achievement) return false;

  const existing = await db
    .select()
    .from(userAchievement)
    .where(
      and(
        eq(userAchievement.userId, userId),
        eq(userAchievement.achievementId, achievementId),
      ),
    )
    .then((rows) => rows[0]);

  if (existing?.isComplete) {
    return false;
  }

  if (existing) {
    await db
      .update(userAchievement)
      .set({
        isComplete: true,
        earnedAt: new Date(),
        progress: 100,
      })
      .where(eq(userAchievement.id, existing.id));
  } else {
    await db.insert(userAchievement).values({
      id: `${userId}_${achievementId}`,
      userId,
      achievementId,
      isComplete: true,
      progress: 100,
    });
  }

  return true;
}

export async function checkAndAwardStreakAchievements(
  userId: string,
  newStreak: number,
): Promise<string[]> {
  const unlocked: string[] = [];
  const earned = await getEarnedAchievementIds(userId);

  const streakMilestones = [
    { id: "first_streak", threshold: 3 },
    { id: "week_warrior", threshold: 7 },
    { id: "month_master", threshold: 30 },
  ];

  for (const milestone of streakMilestones) {
    if (newStreak >= milestone.threshold && !earned.includes(milestone.id)) {
      const awarded = await awardAchievement(userId, milestone.id);
      if (awarded) {
        unlocked.push(milestone.id);
      }
    }
  }

  return unlocked;
}

export function getAchievementIcon(achievementId: string): string {
  const achievement = ACHIEVEMENT_DEFINITIONS.find(
    (a) => a.id === achievementId,
  );
  return achievement?.icon || "🏆";
}

export function getAchievementTierColor(
  tier: "bronze" | "silver" | "gold",
): string {
  switch (tier) {
    case "gold":
      return "text-yellow-500 border-yellow-500 bg-yellow-50";
    case "silver":
      return "text-gray-400 border-gray-400 bg-gray-50";
    case "bronze":
      return "text-amber-600 border-amber-600 bg-amber-50";
  }
}

export function getAchievementTierGradient(
  tier: "bronze" | "silver" | "gold",
): string {
  switch (tier) {
    case "gold":
      return "from-yellow-400 to-yellow-600";
    case "silver":
      return "from-gray-300 to-gray-500";
    case "bronze":
      return "from-amber-400 to-amber-600";
  }
}
