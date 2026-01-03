import {
  XP_REWARDS,
  LEVEL_THRESHOLDS,
  XpGainEvent,
  XpGainResult,
  ACHIEVEMENT_DEFINITIONS,
} from "@/types/gamification";
import { db } from "@/db";
import {
  userGamification,
  userAchievement,
  questionAttempt,
  dailyGoal,
} from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import crypto from "crypto";

export function calculateXpForAction(event: XpGainEvent): number {
  let xp = 0;

  switch (event.action) {
    case "correct_answer":
      xp = XP_REWARDS.CORRECT_ANSWER * (event.questionCount || 1);
      break;
    case "incorrect_answer":
      xp = XP_REWARDS.INCORRECT_ANSWER * (event.questionCount || 1);
      break;
    case "level_complete":
      const level = event.levelId || 1;
      xp = XP_REWARDS.LEVEL_COMPLETE_BASE + level * XP_REWARDS.LEVEL_COMPLETE_MULTIPLIER;
      if (event.score === 100) {
        xp += XP_REWARDS.PERFECT_LEVEL_BONUS;
      }
      break;
    case "perfect_score":
      xp = XP_REWARDS.PERFECT_LEVEL_BONUS;
      break;
    case "first_try":
      xp = XP_REWARDS.FIRST_TRY_BONUS;
      break;
    case "daily_goal":
      xp = XP_REWARDS.DAILY_GOAL_COMPLETE;
      break;
  }

  return xp;
}

export function calculateLevel(xp: number): {
  level: number;
  xpInCurrentLevel: number;
  xpRequiredForNextLevel: number;
  progress: number;
} {
  let level = 1;

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }

  const currentLevelXp = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXp = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] * 1.5;
  const xpInCurrentLevel = xp - currentLevelXp;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  const progress = xpRequiredForNextLevel > 0
    ? Math.min((xpInCurrentLevel / xpRequiredForNextLevel) * 100, 100)
    : 100;

  return {
    level,
    xpInCurrentLevel,
    xpRequiredForNextLevel,
    progress,
  };
}

export async function addXp(
  userId: string,
  event: XpGainEvent,
): Promise<XpGainResult> {
  const xpToAdd = calculateXpForAction(event);

  // Get current stats
  const currentStats = await db
    .select()
    .from(userGamification)
    .where(eq(userGamification.id, userId))
    .then((rows) => rows[0]);

  const currentXp = currentStats?.totalXp || 0;
  const newTotalXp = currentXp + xpToAdd;

  // Calculate level up
  const oldLevel = currentStats?.level || 1;
  const newLevelInfo = calculateLevel(newTotalXp);
  const levelUp = newLevelInfo.level > oldLevel;

  // Update gamification stats
  if (currentStats) {
    await db
      .update(userGamification)
      .set({
        totalXp: newTotalXp,
        level: newLevelInfo.level,
        updatedAt: new Date(),
      })
      .where(eq(userGamification.id, userId));
  } else {
    await db.insert(userGamification).values({
      id: userId,
      totalXp: newTotalXp,
      level: newLevelInfo.level,
    });
  }

  // Record daily goal progress
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const todayGoal = await db
    .select()
    .from(dailyGoal)
    .where(
      and(
        eq(dailyGoal.userId, userId),
        sql`${dailyGoal.date} = ${todayStr}`,
      ),
    )
    .then((rows) => rows[0]);

  if (todayGoal) {
    await db
      .update(dailyGoal)
      .set({
        xpEarned: todayGoal.xpEarned + xpToAdd,
        questionsAnswered:
          todayGoal.questionsAnswered + (event.questionCount || 0),
        isCompleted:
          !todayGoal.isCompleted &&
          (todayGoal.questionsAnswered + (event.questionCount || 0) >=
            todayGoal.goalValue),
      })
      .where(eq(dailyGoal.id, todayGoal.id));
  } else {
    await db.insert(dailyGoal).values({
      id: `${userId}_${todayStr}`,
      userId,
      date: todayStr,
      xpEarned: xpToAdd,
      questionsAnswered: event.questionCount || 0,
      goalType: "questions",
      goalValue: 20,
      isCompleted: (event.questionCount || 0) >= 20,
    });
  }

  return {
    xpEarned: xpToAdd,
    newTotalXp,
    levelUp,
    newLevel: levelUp ? newLevelInfo.level : undefined,
    levelProgress: newLevelInfo.progress,
  };
}

export async function getGamificationStats(
  userId: string,
): Promise<{
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  level: number;
  levelProgress: number;
} | null> {
  const stats = await db
    .select()
    .from(userGamification)
    .where(eq(userGamification.id, userId))
    .then((rows) => rows[0]);

  if (!stats) {
    return null;
  }

  const levelInfo = calculateLevel(stats.totalXp);

  return {
    totalXp: stats.totalXp,
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    level: stats.level,
    levelProgress: levelInfo.progress,
  };
}

export async function recordQuestionAttempt(
  userId: string,
  certificateSlug: string,
  questionId: string,
  levelId: number,
  isCorrect: boolean,
  topic?: string,
): Promise<void> {
  const attemptId = crypto.randomUUID();

  await db.insert(questionAttempt).values({
    id: attemptId,
    userId,
    certificateId: certificateSlug,
    questionId,
    levelId,
    isCorrect,
    topic,
  });
}

export async function getQuestionCount(
  userId: string,
): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(questionAttempt)
    .where(eq(questionAttempt.userId, userId))
    .then((rows) => rows[0]);

  return result?.count || 0;
}

export async function getUserAchievements(
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

export async function checkAndAwardAchievements(
  userId: string,
  event: XpGainEvent,
): Promise<string[]> {
  const unlockedAchievements: string[] = [];
  const earnedAchievementIds = await getUserAchievements(userId);
  const questionCount = await getQuestionCount(userId);
  const stats = await getGamificationStats(userId);

  const achievementsToCheck = [
    {
      id: "first_question",
      condition: () =>
        !earnedAchievementIds.includes("first_question") && questionCount >= 1,
    },
    {
      id: "ten_questions",
      condition: () =>
        !earnedAchievementIds.includes("ten_questions") && questionCount >= 10,
    },
    {
      id: "hundred_questions",
      condition: () =>
        !earnedAchievementIds.includes("hundred_questions") &&
        questionCount >= 100,
    },
    {
      id: "five_hundred_questions",
      condition: () =>
        !earnedAchievementIds.includes("five_hundred_questions") &&
        questionCount >= 500,
    },
    {
      id: "first_level",
      condition: () =>
        !earnedAchievementIds.includes("first_level") &&
        event.action === "level_complete",
    },
    {
      id: "perfect_score",
      condition: () =>
        !earnedAchievementIds.includes("perfect_score") &&
        event.action === "level_complete" &&
        event.score === 100,
    },
  ];

  for (const achievement of achievementsToCheck) {
    if (achievement.condition()) {
      await awardAchievement(userId, achievement.id);
      unlockedAchievements.push(achievement.id);
    }
  }

  return unlockedAchievements;
}

async function awardAchievement(
  userId: string,
  achievementId: string,
): Promise<void> {
  const achievement = ACHIEVEMENT_DEFINITIONS.find(
    (a) => a.id === achievementId,
  );
  if (!achievement) return;

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

  if (existing) {
    await db
      .update(userAchievement)
      .set({
        isComplete: true,
        earnedAt: new Date(),
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

  // Add XP reward for achievement
  await addXp(userId, {
    userId,
    action: "correct_answer",
  });
}
