import { db } from "@/db/index";
import { schema } from "@/db/schema";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { eq } from "drizzle-orm";

const DEMO_USER = {
  email: "demo@certquickly.com",
  name: "Demo User",
  password: "demo123456",
};

async function seedDemoUser() {
  console.log("🌱 Setting up demo user...\n");

  try {
    // Check if demo user already exists
    const existingUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, DEMO_USER.email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(`✅ Demo user already exists: ${DEMO_USER.email}`);
      console.log(`   User ID: ${existingUser[0].id}`);
      return;
    }

    // Create the demo user
    const userId = crypto.randomUUID();

    await db.insert(schema.user).values({
      id: userId,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`✅ Created user: ${DEMO_USER.email}`);
    console.log(`   User ID: ${userId}`);

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);

    // Create email/password credentials in account table
    await db.insert(schema.account).values({
      id: crypto.randomUUID(),
      accountId: `email-${userId}`,
      providerId: "email",
      userId,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Created password credentials");

    // Create session
    await db.insert(schema.session).values({
      id: crypto.randomUUID(),
      userId,
      token: crypto.randomUUID(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("✅ Created session");

    // Get all certificates
    const allCerts = await db.select().from(schema.certificates);

    if (allCerts.length === 0) {
      console.log("⚠️  No certificates found in database");
      return;
    }

    // Create level progress for each certificate (all levels accessible)
    for (const cert of allCerts) {
      for (let levelId = 1; levelId <= 8; levelId++) {
        await db.insert(schema.userLevelProgress).values({
          id: `${userId}_${cert.id}_${levelId}`,
          userId,
          certificateId: cert.id,
          levelId,
          passed: levelId === 1, // Level 1 is "completed" so level 2 becomes accessible
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    console.log(
      `✅ Created level progress for ${allCerts.length} certificates`,
    );

    // Grant access to all certificates
    for (const cert of allCerts) {
      await db.insert(schema.userPayment).values({
        id: crypto.randomUUID(),
        userId,
        certificateId: cert.id,
        paymentId: `demo-${cert.slug}-${Date.now()}`,
        status: "completed",
        amount: 0,
        currency: "USD",
        bundleType: "demo",
        certificateCount: 1,
      });
    }

    console.log(`✅ Granted access to ${allCerts.length} certificates`);

    console.log("\n🎉 Demo user ready!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${DEMO_USER.email}`);
    console.log(`   Password: ${DEMO_USER.password}`);
    console.log("\n🚀 Run: bun run record:quiz\n");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  }
}

seedDemoUser()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
