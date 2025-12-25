import { db } from "@/db";
import { user, userLevelProgress } from "@/db/schema";
import logger from "@/lib/logger";
import { and, eq, isNull, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get total users
    const totalUsers = await db.select().from(user);

    // Get inactive users (haven't started quiz after 2 days)
    const inactiveUsers = await db
      .select()
      .from(user)
      .leftJoin(userLevelProgress, eq(user.id, userLevelProgress.userId))
      .where(and(lte(user.createdAt, twoDaysAgo), isNull(userLevelProgress.id)));

    // Get users who haven't received reminders in the last 7 days
    const eligibleForReminder = await db
      .select()
      .from(user)
      .leftJoin(userLevelProgress, eq(user.id, userLevelProgress.userId))
      .where(
        and(
          lte(user.createdAt, twoDaysAgo),
          isNull(userLevelProgress.id),
          // Only send reminders to users who haven't received one in the last 7 days
          or(
            isNull(user.lastReminderSentAt),
            lte(user.lastReminderSentAt, sevenDaysAgo),
          ),
        ),
      );

    return NextResponse.json({
      totalUsers: totalUsers.length,
      inactiveUsers: inactiveUsers.length,
      eligibleForReminder: eligibleForReminder.length,
      lastUpdated: now.toISOString(),
    });
  } catch (error) {
    logger.error("Error fetching workflow stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
