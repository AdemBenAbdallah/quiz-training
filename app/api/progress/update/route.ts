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
    const body = await request.json();
    const { type, levelId, certificateSlug } = body;

    if (!certificateSlug) {
      return NextResponse.json(
        { error: "Certificate is required" },
        { status: 400 },
      );
    }

    if (type === "level_complete") {
      // Mark level as passed for specific certificate
      const existingLevelProgress = await db
        .select()
        .from(userLevelProgress)
        .where(
          and(
            eq(userLevelProgress.userId, userId),
            eq(userLevelProgress.certificateId, certificateSlug),
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
              eq(userLevelProgress.certificateId, certificateSlug),
              eq(userLevelProgress.levelId, levelId),
            ),
          );
      } else {
        // Create new record marking this level as passed
        await db.insert(userLevelProgress).values({
          id: `${userId}_${certificateSlug}_${levelId}`,
          userId,
          certificateId: certificateSlug,
          levelId,
          passed: true,
        });
      }

      logger.log(
        `Level ${levelId} completed for user: ${userId}, certificate: ${certificateSlug}`,
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    logger.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
