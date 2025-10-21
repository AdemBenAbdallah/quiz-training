import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
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

    // Check if user already has progress
    const existingProgress = await db
      .select()
      .from(userLevelProgress)
      .where(eq(userLevelProgress.userId, userId));

    if (existingProgress.length > 0) {
      return NextResponse.json({
        message: "User progress already exists",
        count: existingProgress.length
      });
    }

    // Initialize user level progress - Level 1 is accessible, others are locked
    const initialProgress = [
      {
        id: `${userId}_1`,
        userId,
        levelId: 1,
        passed: false,
      },
      {
        id: `${userId}_2`,
        userId,
        levelId: 2,
        passed: false,
      },
      {
        id: `${userId}_3`,
        userId,
        levelId: 3,
        passed: false,
      },
      {
        id: `${userId}_4`,
        userId,
        levelId: 4,
        passed: false,
      },
      {
        id: `${userId}_5`,
        userId,
        levelId: 5,
        passed: false,
      },
      {
        id: `${userId}_6`,
        userId,
        levelId: 6,
        passed: false,
      },
      {
        id: `${userId}_7`,
        userId,
        levelId: 7,
        passed: false,
      },
      {
        id: `${userId}_8`,
        userId,
        levelId: 8,
        passed: false,
      },
    ];

    await db.insert(userLevelProgress).values(initialProgress);

    return NextResponse.json({
      message: "User progress initialized successfully",
      count: initialProgress.length
    });
  } catch (error) {
    console.error("Error initializing user progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
