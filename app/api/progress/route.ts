import { db } from "@/db";
import { certificates, userLevelProgress } from "@/db/schema";
import { auth } from "@/lib/auth";
import { hasActivePurchase } from "@/lib/server/payment";
import { createInitialProgress } from "@/lib/utils/progress";
import { and, eq } from "drizzle-orm";
import { connection, NextRequest, NextResponse } from "next/server";

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
    const { searchParams } = new URL(request.url);
    const certificateSlug = searchParams.get("certificate");

    if (!certificateSlug) {
      return NextResponse.json(
        { error: "Certificate is required" },
        { status: 400 },
      );
    }

    // First, get the certificate by slug to get the actual ID
    let certificateId: string;
    try {
      const certificate = await db
        .select()
        .from(certificates)
        .where(eq(certificates.slug, certificateSlug))
        .limit(1);

      if (certificate.length === 0) {
        return NextResponse.json(
          { error: "Certificate not found" },
          { status: 404 },
        );
      }

      certificateId = certificate[0].id;
    } catch (certError) {
      console.error("Error fetching certificate:", certError);
      return NextResponse.json(
        { error: "Database error fetching certificate" },
        { status: 500 },
      );
    }

    // Get level progress for specific certificate
    let levelProgress = await db
      .select()
      .from(userLevelProgress)
      .where(
        and(
          eq(userLevelProgress.userId, userId),
          eq(userLevelProgress.certificateId, certificateId),
        ),
      );

    // If no progress exists, initialize it for the user for this certificate
    if (levelProgress.length === 0) {
      const initialProgress = createInitialProgress(userId, certificateId);

      await db.insert(userLevelProgress).values(initialProgress);
      levelProgress = await db
        .select()
        .from(userLevelProgress)
        .where(
          and(
            eq(userLevelProgress.userId, userId),
            eq(userLevelProgress.certificateId, certificateId),
          ),
        );

      console.log(
        `Initialized progress for user: ${userId}, certificate: ${certificateSlug}`,
      );
    }

    // Check if user has made a purchase for this certificate
    let hasPaid = false;
    try {
      hasPaid = await hasActivePurchase(userId, certificateId);
    } catch (paymentError) {
      console.error("Error checking payment status:", paymentError);
      // Continue without payment check - user can still access free content
      hasPaid = false;
    }

    // Create level data with accessibility logic
    const levels = Array.from({ length: 8 }, (_, index) => {
      const levelId = index + 1;
      const userLevel = levelProgress.find((p) => p.levelId === levelId);

      // Level is accessible if:
      // 1. It's level 1 (always free)
      // 2. Previous level is passed
      // 3. User has paid (for levels 2+)
      const prevLevelPassed =
        levelId === 1 ||
        levelProgress.find((p) => p.levelId === levelId - 1)?.passed ||
        false;

      const isAccessible =
        levelId === 1 || (prevLevelPassed && (levelId === 1 || hasPaid));

      return {
        id: levelId,
        passed: userLevel?.passed || false,
        accessible: isAccessible,
        needsPayment: levelId > 1 && !hasPaid && prevLevelPassed,
      };
    });

    return NextResponse.json({
      levels,
      certificateId,
      hasPayment: hasPaid,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
