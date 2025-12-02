import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userLevelProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { hasActivePurchase } from "@/lib/utils/payment";
import { connection } from "next/server";

export async function GET(request: NextRequest) {
  await connection();

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

    // Check if user has made a purchase
    const hasPaid = await hasActivePurchase(userId);

    // Create level data with accessibility logic
    const levels = Array.from({ length: 8 }, (_, index) => {
      const levelId = index + 1;
      const userLevel = levelProgress.find((p) => p.levelId === levelId);
      
      // Level is accessible if:
      // 1. It's level 1 (always free)
      // 2. Previous level is passed
      // 3. User has paid (for levels 2+)
      const prevLevelPassed = levelId === 1 || 
        levelProgress.find((p) => p.levelId === levelId - 1)?.passed || false;
      
      const isAccessible = levelId === 1 || (prevLevelPassed && (levelId === 1 || hasPaid));

      return {
        id: levelId,
        passed: userLevel?.passed || false,
        accessible: isAccessible,
        needsPayment: levelId > 1 && !hasPaid && prevLevelPassed,
      };
    });

    return NextResponse.json({
      levels,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}