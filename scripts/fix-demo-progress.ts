import { db } from "@/db/index";
import { schema } from "@/db/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const DEMO_USER_EMAIL = "demo@certquickly.com";

async function fixDemoProgress() {
  console.log("🔧 Fixing demo user progress...\n");

  try {
    // Find the demo user
    const [demoUser] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, DEMO_USER_EMAIL))
      .limit(1);

    if (!demoUser) {
      console.error("❌ Demo user not found!");
      return;
    }

    console.log(`✅ Found demo user: ${demoUser.email}`);
    console.log(`   User ID: ${demoUser.id}`);

    // Get all certificates
    const certificates = await db.select().from(schema.certificates);

    if (certificates.length === 0) {
      console.error("❌ No certificates found!");
      return;
    }

    console.log(`📋 Found ${certificates.length} certificates`);

    // Delete existing progress for demo user
    await db
      .delete(schema.userLevelProgress)
      .where(eq(schema.userLevelProgress.userId, demoUser.id));

    await db
      .delete(schema.userPayment)
      .where(eq(schema.userPayment.userId, demoUser.id));

    console.log("🗑️  Cleared existing progress and payments");

    // Create level progress for each certificate
    for (const cert of certificates) {
      for (let levelId = 1; levelId <= 8; levelId++) {
        await db.insert(schema.userLevelProgress).values({
          id: `${demoUser.id}_${cert.id}_${levelId}`,
          userId: demoUser.id,
          certificateId: cert.id,
          levelId,
          passed: levelId === 1, // Level 1 completed so level 2 becomes accessible
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    console.log(
      `✅ Created level progress for ${certificates.length} certificates`,
    );

    // Get certificate IDs for complete bundle
    const certificateIds = certificates.map((cert) => cert.id);

    // Create ONE complete bundle payment that grants access to all certificates
    await db.insert(schema.userPayment).values({
      id: crypto.randomUUID(),
      userId: demoUser.id,
      certificateId: null, // null means bundle covers all certificates
      paymentId: `demo-complete-bundle-${Date.now()}`,
      status: "completed",
      amount: 0,
      currency: "USD",
      bundleType: "complete",
      certificateCount: certificates.length,
      purchasedCertificates: JSON.stringify(certificateIds), // JSON array of all certificate IDs
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Created complete bundle payment`);
    console.log(`   - Bundle type: complete`);
    console.log(`   - Certificate count: ${certificates.length}`);
    console.log(`   - Certificate IDs: ${certificateIds.join(", ")}`);

    console.log("\n🎉 Demo user fixed!");
    console.log("\n📝 Login at http://localhost:3000/sign-in");
    console.log(`   Email: ${DEMO_USER_EMAIL}`);
    console.log("   Password: demo123456");
    console.log("\n🚀 All certificates are now accessible!");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

fixDemoProgress()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
