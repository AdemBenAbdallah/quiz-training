import { auth } from "@/lib/auth";
import { db } from "@/db";
import { questionAttempt } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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

    let conditions = [eq(questionAttempt.userId, userId)];
    if (certificateSlug) {
      conditions.push(eq(questionAttempt.certificateId, certificateSlug));
    }

    const results = await db
      .select({
        topic: questionAttempt.topic,
        total: sql<number>`count(*)`,
        correct: sql<number>`sum(case when ${questionAttempt.isCorrect} then 1 else 0 end)`,
      })
      .from(questionAttempt)
      .where(and(...conditions))
      .groupBy(questionAttempt.topic);

    const topics = results
      .filter((r) => r.topic)
      .map((r) => ({
        name: r.topic || "Unknown",
        total: Number(r.total) || 0,
        correct: Number(r.correct) || 0,
        accuracy:
          r.total && r.total > 0
            ? Math.round((Number(r.correct) / Number(r.total)) * 100)
            : 0,
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    const weakAreas = topics
      .filter((t) => t.total >= 5 && t.accuracy < 70)
      .map((t) => t.name);

    const strongAreas = topics
      .filter((t) => t.total >= 5 && t.accuracy >= 85)
      .map((t) => t.name);

    return NextResponse.json({
      topics,
      weakAreas,
      strongAreas,
      certificateSlug,
    });
  } catch (error) {
    console.error("Error fetching knowledge gaps:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
