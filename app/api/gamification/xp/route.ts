import { auth } from "@/lib/auth";
import {
  addXp,
  calculateXpForAction,
  checkAndAwardAchievements,
} from "@/lib/gamification";
import { checkAndAwardStreakAchievements } from "@/lib/gamification/achievements";
import { updateStreak } from "@/lib/gamification/streak";
import { getUserAchievementsWithDetails } from "@/lib/gamification/achievements";
import { XpGainEvent } from "@/types/gamification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    const event: XpGainEvent = {
      userId,
      action: body.action,
      certificateSlug: body.certificateSlug,
      levelId: body.levelId,
      questionCount: body.questionCount,
      score: body.score,
    };

    const xpEarned = calculateXpForAction(event);
    const result = await addXp(userId, event);
    const streakResult = await updateStreak(userId);

    const unlockedAchievements = await checkAndAwardAchievements(userId, event);
    const streakAchievements = await checkAndAwardStreakAchievements(
      userId,
      streakResult.currentStreak,
    );

    const allNewAchievements = [...unlockedAchievements, ...streakAchievements];
    let newAchievementsDetails: any[] = [];

    if (allNewAchievements.length > 0) {
      const allAchievements = await getUserAchievementsWithDetails(userId);
      newAchievementsDetails = allAchievements.filter(
        (a) => allNewAchievements.includes(a.id) && a.isUnlocked,
      );
    }

    return NextResponse.json({
      success: true,
      xpEarned,
      newTotalXp: result.newTotalXp,
      levelUp: result.levelUp,
      newLevel: result.newLevel,
      levelProgress: result.levelProgress,
      streak: {
        current: streakResult.currentStreak,
        longest: streakResult.longestStreak,
        increased: streakResult.streakIncreased,
        maintained: streakResult.streakMaintained,
      },
      achievements: {
        new: allNewAchievements,
        details: newAchievementsDetails,
      },
    });
  } catch (error) {
    console.error("Error adding XP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
