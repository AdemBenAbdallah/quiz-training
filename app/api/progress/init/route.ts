import { db } from "@/db";
import { userLevelProgress } from "@/db/schema";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { and, eq } from "drizzle-orm";
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
    const { searchParams } = new URL(request.url);
    const certificateSlug = searchParams.get("certificate");

    if (!certificateSlug) {
      return NextResponse.json(
        { error: "Certificate is required" },
        { status: 400 },
      );
    }

    // Check if user already has progress for this certificate
    const existingProgress = await db
      .select()
      .from(userLevelProgress)
      .where(
        and(
          eq(userLevelProgress.userId, userId),
          eq(userLevelProgress.certificateId, certificateSlug),
        ),
      );

    if (existingProgress.length > 0) {
      return NextResponse.json({
        message: "User progress already exists",
        count: existingProgress.length,
      });
    }

    // Initialize user level progress for specific certificate
    const initialProgress = [
      {
        id: `${userId}_${certificateSlug}_1`,
        userId,
        certificateId: certificateSlug,
        levelId: 1,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_2`,
        userId,
        certificateId: certificateSlug,
        levelId: 2,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_3`,
        userId,
        certificateId: certificateSlug,
        levelId: 3,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_4`,
        userId,
        certificateId: certificateSlug,
        levelId: 4,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_5`,
        userId,
        certificateId: certificateSlug,
        levelId: 5,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_6`,
        userId,
        certificateId: certificateSlug,
        levelId: 6,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_7`,
        userId,
        certificateId: certificateSlug,
        levelId: 7,
        passed: false,
      },
      {
        id: `${userId}_${certificateSlug}_8`,
        userId,
        certificateId: certificateSlug,
        levelId: 8,
        passed: false,
      },
    ];

    await db.insert(userLevelProgress).values(initialProgress);

    return NextResponse.json({
      message: "User progress initialized successfully",
      count: initialProgress.length,
      certificate: certificateSlug,
    });
  } catch (error) {
    logger.error("Error initializing user progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
