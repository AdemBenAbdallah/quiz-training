import { auth } from "@/lib/auth";
import { getGamificationStats, getQuestionCount, getUserAchievements } from "@/lib/gamification";
import { getUserAchievementsWithDetails } from "@/lib/gamification/achievements";
import { updateStreak, formatStreak } from "@/lib/gamification/streak";
import { db } from "@/db";
import { dailyGoal } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const certificateSlug = searchParams.get("certificate");

    const stats = await getGamificationStats(userId);
    const questionCount = await getQuestionCount(userId);
    const achievements = await getUserAchievementsWithDetails(userId);
    const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

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

    const dailyProgress = {
      questionsAnswered: todayGoal?.questionsAnswered || 0,
      xpEarned: todayGoal?.xpEarned || 0,
      goalType: (todayGoal?.goalType as "questions" | "xp") || "questions",
      goalValue: todayGoal?.goalValue || 20,
      isCompleted: todayGoal?.isCompleted || false,
      progress: todayGoal
        ? Math.min(
            ((todayGoal.questionsAnswered || 0) / (todayGoal.goalValue || 20)) *
              100,
            100,
          )
        : 0,
    };

    const streakResult = await updateStreak(userId);

    return NextResponse.json({
      gamification: stats || {
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        levelProgress: 0,
      },
      questionCount,
      achievements: {
        unlocked: unlockedCount,
        total: achievements.length,
        list: achievements,
      },
      dailyGoal: dailyProgress,
      streak: {
        current: streakResult.currentStreak,
        longest: streakResult.longestStreak,
        formatted: formatStreak(streakResult.currentStreak),
        label:
          streakResult.currentStreak >= 30
            ? "Legendary"
            : streakResult.currentStreak >= 14
              ? "Epic"
              : streakResult.currentStreak >= 7
                ? "Week Warrior"
                : streakResult.currentStreak >= 3
                  ? "On Fire"
                  : "Getting Started",
        streakLost: streakResult.streakLost,
      },
      certificateSlug,
    });
  } catch (error) {
    console.error("Error fetching gamification stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
