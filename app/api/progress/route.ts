import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress, userQuizProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { LevelParts, QuizParts } from "@/app/(preview)/parts";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get level progress
    const levelProgress = await db
      .select()
      .from(userLevelProgress)
      .where(eq(userLevelProgress.userId, userId));

    // Get quiz progress
    const quizProgress = await db
      .select()
      .from(userQuizProgress)
      .where(eq(userQuizProgress.userId, userId));

    // Transform to match localStorage structure
    const levelParts = LevelParts.map((level) => {
      const userLevel = levelProgress.find((p) => p.levelId === level.id);
      return {
        ...level,
        passed: userLevel?.passed || level.id === 1, // Level 1 is always accessible
      };
    });

    // Group quiz progress by level
    const quizPartsByLevel: Record<number, any> = {};

    // Initialize all levels with default quiz parts
    for (let levelId = 1; levelId <= 8; levelId++) {
      const defaultQuizParts = QuizParts(levelId);
      const levelQuizProgress = quizProgress.filter(
        (p) => p.levelId === levelId,
      );

      const updatedData = defaultQuizParts.data.map((part, index) => {
        const userPart = levelQuizProgress.find((p) => p.partId === part.id);

        // A part is accessible if:
        // 1. It's the first part of the level, OR
        // 2. All previous parts have been passed
        const isAccessible =
          part.id === 1 ||
          defaultQuizParts.data
            .slice(0, index)
            .every((prevPart) =>
              levelQuizProgress.find(
                (p) => p.partId === prevPart.id && p.passed,
              ),
            );

        return {
          ...part,
          passed: userPart?.passed || false,
          accessible: isAccessible,
        };
      });

      quizPartsByLevel[levelId] = {
        ...defaultQuizParts,
        data: updatedData,
      };
    }

    return NextResponse.json({
      levelParts,
      quizPartsByLevel,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
