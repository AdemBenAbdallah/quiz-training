import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

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
    const { type, levelId } = body;

    if (type === "level_complete") {
      // Mark level as passed
      const existingLevelProgress = await db
        .select()
        .from(userLevelProgress)
        .where(
          and(
            eq(userLevelProgress.userId, userId),
            eq(userLevelProgress.levelId, levelId),
          ),
        );

      if (existingLevelProgress.length > 0) {
        // Update existing record
        await db
          .update(userLevelProgress)
          .set({
            passed: true,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userLevelProgress.userId, userId),
              eq(userLevelProgress.levelId, levelId),
            ),
          );
      } else {
        // Create new record marking this level as passed
        await db.insert(userLevelProgress).values({
          id: `${userId}_${levelId}`,
          userId,
          levelId,
          passed: true,
        });
      }

      console.log(`Level ${levelId} completed for user: ${userId}`);
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