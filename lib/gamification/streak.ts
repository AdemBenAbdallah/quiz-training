import { db } from "@/db";
import { userGamification } from "@/db/schema";
import { eq } from "drizzle-orm";
import { StreakUpdateResult } from "@/types/gamification";

export async function updateStreak(userId: string): Promise<StreakUpdateResult> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await db
    .select()
    .from(userGamification)
    .where(eq(userGamification.id, userId))
    .then((rows) => rows[0]);

  if (!stats) {
    await db.insert(userGamification).values({
      id: userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: new Date(),
    });

    return {
      currentStreak: 1,
      longestStreak: 1,
      streakIncreased: true,
      streakMaintained: false,
      streakLost: false,
      daysSinceLastActivity: 0,
    };
  }

  const lastActivity = stats.lastActivityDate;
  const currentStreak = stats.currentStreak || 0;
  const longestStreak = stats.longestStreak || 0;

  if (!lastActivity) {
    await db
      .update(userGamification)
      .set({
        currentStreak: 1,
        lastActivityDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userGamification.id, userId));

    return {
      currentStreak: 1,
      longestStreak: Math.max(1, longestStreak),
      streakIncreased: true,
      streakMaintained: false,
      streakLost: false,
      daysSinceLastActivity: 0,
    };
  }

  const lastActivityDate = new Date(lastActivity);
  lastActivityDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - lastActivityDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return {
      currentStreak,
      longestStreak,
      streakIncreased: false,
      streakMaintained: true,
      streakLost: false,
      daysSinceLastActivity: 0,
    };
  }

  if (diffDays === 1) {
    const newStreak = currentStreak + 1;
    const newLongestStreak = Math.max(newStreak, longestStreak);

    await db
      .update(userGamification)
      .set({
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userGamification.id, userId));

    return {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      streakIncreased: true,
      streakMaintained: false,
      streakLost: false,
      daysSinceLastActivity: 1,
    };
  }

  const newStreak = 1;
  await db
    .update(userGamification)
    .set({
      currentStreak: newStreak,
      lastActivityDate: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(userGamification.id, userId));

  return {
    currentStreak: newStreak,
    longestStreak,
    streakIncreased: false,
    streakMaintained: false,
    streakLost: true,
    daysSinceLastActivity: diffDays,
  };
}

export function formatStreak(streak: number): string {
  if (streak === 0) return "0 days";
  if (streak === 1) return "1 day";
  return `${streak} days`;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🔥👑";
  if (streak >= 14) return "🔥💎";
  if (streak >= 7) return "🔥⚔️";
  if (streak >= 3) return "🔥";
  if (streak >= 1) return "✨";
  return "💔";
}

export function getStreakLabel(streak: number): string {
  if (streak >= 30) return "Legendary";
  if (streak >= 14) return "Epic";
  if (streak >= 7) return "Week Warrior";
  if (streak >= 3) return "On Fire";
  if (streak >= 1) return "Getting Started";
  return "Start your streak!";
}
