// scripts/fix-migration.ts

import { db } from "@/db";
import { certificates } from "@/db/schema";

async function fixMigration() {
  console.log("🔧 Starting migration fix...");

  try {
    // First, add the column as nullable using raw SQL
    await db.execute(`
      ALTER TABLE "user_level_progress" ADD COLUMN "certificate_id" text;
    `);

    console.log("✅ Added certificate_id column as nullable");

    // Get the first certificate ID to use as default
    const certs = await db.select().from(certificates);

    if (certs.length === 0) {
      throw new Error("No certificates found in database");
    }

    const defaultCertId = certs[0].id;
    console.log(`📝 Using certificate ID: ${defaultCertId}`);

    // Update existing records with the default certificate using raw SQL
    await db.execute(`
      UPDATE "user_level_progress"
      SET "certificate_id" = '${defaultCertId}'
      WHERE "certificate_id" IS NULL;
    `);

    console.log("✅ Updated existing records with default certificate_id");

    // Now make the column NOT NULL
    await db.execute(`
      ALTER TABLE "user_level_progress" ALTER COLUMN "certificate_id" SET NOT NULL;
    `);

    console.log("✅ Made certificate_id column NOT NULL");

    // Add the foreign key constraint
    await db.execute(`
      ALTER TABLE "user_level_progress"
      ADD CONSTRAINT "user_level_progress_certificate_id_certificates_id_fk"
      FOREIGN KEY ("certificate_id") REFERENCES "public"."certificates"("id")
      ON DELETE cascade ON UPDATE no action;
    `);

    console.log("✅ Added foreign key constraint");
    console.log("🎉 Migration fix completed successfully!");
  } catch (error) {
    console.error("❌ Migration fix failed:", error);
    process.exit(1);
  }
}

// Run the fix
fixMigration().then(() => {
  console.log("Script completed");
  process.exit(0);
});
