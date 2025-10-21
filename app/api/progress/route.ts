import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress, userQuizProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { LevelParts, QuizParts } from "@/app/(preview)/parts";
import { hasActivePurchase } from "@/lib/utils/payment";
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
    let levelProgress = await db
      .select()
      .from(userLevelProgress)
      .where(eq(userLevelProgress.userId, userId));

    // If no progress exists, initialize it for the user
    if (levelProgress.length === 0) {
      const initialProgress = [
        { id: `${userId}_1`, userId, levelId: 1, passed: false },
        { id: `${userId}_2`, userId, levelId: 2, passed: false },
        { id: `${userId}_3`, userId, levelId: 3, passed: false },
        { id: `${userId}_4`, userId, levelId: 4, passed: false },
        { id: `${userId}_5`, userId, levelId: 5, passed: false },
        { id: `${userId}_6`, userId, levelId: 6, passed: false },
        { id: `${userId}_7`, userId, levelId: 7, passed: false },
        { id: `${userId}_8`, userId, levelId: 8, passed: false },
      ];

      await db.insert(userLevelProgress).values(initialProgress);
      levelProgress = await db
        .select()
        .from(userLevelProgress)
        .where(eq(userLevelProgress.userId, userId));

      console.log(`Initialized progress for user: ${userId}`);
    }

    // Get quiz progress
    const quizProgress = await db
      .select()
      .from(userQuizProgress)
      .where(eq(userQuizProgress.userId, userId));

    // Check if user has made a purchase
    const hasPaid = await hasActivePurchase(userId);

    // PRICING MODEL SUMMARY:
    // FREE: Only Level 1, Part 1 is completely free
    // PAID: Everything else requires payment (Level 1 Part 2+, all Level 2+ content)
    //
    // PROGRESSION MODEL:
    // - Level unlocking requires sequential completion (Level 1 → Level 2 → Level 3...)
    // - Payment only affects CONTENT ACCESS within levels, not level unlocking
    //
    // Level accessibility logic:
    // - Level 1 is always accessible (contains the free content)
    // - Other levels unlock only when previous level is completed
    const levelParts = LevelParts.map((level) => {
      const userLevel = levelProgress.find((p) => p.levelId === level.id);
      const prevLevelPassed =
        level.id === 1
          ? true
          : levelProgress.find((p) => p.levelId === level.id - 1)?.passed ||
            false;

      const isAccessible = level.id === 1 || prevLevelPassed;

      return {
        ...level,
        passed: userLevel?.passed || false,
        accessible: isAccessible,
      };
    });

    // Group quiz progress by level
    const quizPartsByLevel: Record<number, any> = {};

    // Simple quiz parts logic for each level
    for (let levelId = 1; levelId <= 8; levelId++) {
      const defaultQuizParts = QuizParts(levelId);
      const levelQuizProgress = quizProgress.filter(
        (p) => p.levelId === levelId,
      );

      // Check if this level is accessible
      const levelAccessible =
        levelParts.find((l) => l.id === levelId)?.accessible || false;

      const updatedData = defaultQuizParts.data.map((part, index) => {
        const userPart = levelQuizProgress.find((p) => p.partId === part.id);

        // If level is not accessible, all parts are locked
        if (!levelAccessible) {
          return {
            ...part,
            passed: userPart?.passed || false,
            accessible: false,
            needsPayment: false,
          };
        }

        // Level is accessible - check part accessibility
        let isAccessible = false;
        let needsPayment = false;

        // FREE CONTENT LOGIC: Only Level 1, Part 1 is completely free
        if (levelId === 1 && part.id === 1) {
          // Level 1, Part 1 - completely free for everyone
          isAccessible = true;
          needsPayment = false;
        } else if (part.id === 1) {
          // First part of Level 2+ - requires payment to access
          isAccessible = true;
          needsPayment = !hasPaid;
        } else {
          // All other parts (Level 1 Part 2+, Level 2+ Part 2+) require:
          // 1. Previous parts to be completed
          // 2. Payment to access
          const prevPartsCompleted = defaultQuizParts.data
            .slice(0, index)
            .every((prevPart) =>
              levelQuizProgress.find(
                (p) => p.partId === prevPart.id && p.passed,
              ),
            );

          isAccessible = prevPartsCompleted;
          needsPayment = isAccessible && !hasPaid;
        }

        return {
          ...part,
          passed: userPart?.passed || false,
          accessible: isAccessible,
          needsPayment,
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
