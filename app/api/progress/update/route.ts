import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress, userQuizProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { QuizParts } from "@/app/(preview)/parts";

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
    const { type, levelId, partId } = body;

    if (type === "quiz_part") {
      // Mark current part as passed
      const existingQuizProgress = await db
        .select()
        .from(userQuizProgress)
        .where(
          and(
            eq(userQuizProgress.userId, userId),
            eq(userQuizProgress.levelId, levelId),
            eq(userQuizProgress.partId, partId),
          ),
        );

      if (existingQuizProgress.length > 0) {
        // Update existing record
        await db
          .update(userQuizProgress)
          .set({
            passed: true,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userQuizProgress.userId, userId),
              eq(userQuizProgress.levelId, levelId),
              eq(userQuizProgress.partId, partId),
            ),
          );
      } else {
        // Create new record marking this part as passed
        await db.insert(userQuizProgress).values({
          id: `${userId}_${levelId}_${partId}`,
          userId,
          levelId,
          partId,
          passed: true,
        });
      }

      // Check if this was the last part of the level
      const quizParts = QuizParts(levelId);
      const isLastPart = partId === quizParts.data.length;

      if (isLastPart && levelId < 8) {
        // Unlock next level by marking it as accessible
        const nextLevelId = levelId + 1;
        const existingLevelProgress = await db
          .select()
          .from(userLevelProgress)
          .where(
            and(
              eq(userLevelProgress.userId, userId),
              eq(userLevelProgress.levelId, nextLevelId),
            ),
          );

        if (existingLevelProgress.length > 0) {
          await db
            .update(userLevelProgress)
            .set({
              passed: true,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(userLevelProgress.userId, userId),
                eq(userLevelProgress.levelId, nextLevelId),
              ),
            );
        } else {
          await db.insert(userLevelProgress).values({
            id: `${userId}_${nextLevelId}`,
            userId,
            levelId: nextLevelId,
            passed: true,
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
