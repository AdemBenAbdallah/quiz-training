import "dotenv/config";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function migratePricingBundles() {
  try {
    console.log("🚀 Starting pricing bundle migration...");

    // Check if columns already exist
    const checkResult = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'user_payment'
      AND column_name IN ('bundle_type', 'certificate_count', 'purchased_certificates');
    `);

    const existingColumns = (checkResult.rows as any[]).map(row => row.column_name);
    console.log("📋 Existing columns:", existingColumns);

    // Add missing columns if they don't exist
    const columnsToAdd = [
      { name: "bundle_type", type: "text" },
      { name: "certificate_count", type: "integer" },
      { name: "purchased_certificates", type: "text" }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`➕ Adding column: ${column.name}`);

        await db.execute(sql`
          ALTER TABLE user_payment
          ADD COLUMN ${sql.identifier(column.name)} ${sql.raw(column.type)};
        `);

        console.log(`✅ Column ${column.name} added successfully`);
      } else {
        console.log(`⚠️  Column ${column.name} already exists, skipping`);
      }
    }

    // Update existing single-certificate payments to use bundle_type
    console.log("🔄 Updating existing payments...");

    const updateResult = await db.execute(sql`
      UPDATE user_payment
      SET
        bundle_type = 'individual',
        certificate_count = 1,
        purchased_certificates = json_build_array(certificate_id)::text
      WHERE bundle_type IS NULL
      AND certificate_id IS NOT NULL;
    `);

    console.log(`✅ Updated ${updateResult.rowCount || 0} existing payments`);

    // Handle cases where users have multiple individual payments (convert to complete bundle)
    console.log("🔄 Checking for multiple individual payments...");

    const multiplePaymentsResult = await db.execute(sql`
      WITH user_payment_counts AS (
        SELECT user_id, COUNT(*) as payment_count
        FROM user_payment
        WHERE status = 'completed'
        AND bundle_type = 'individual'
        GROUP BY user_id
        HAVING COUNT(*) > 1
      )
      UPDATE user_payment
      SET
        bundle_type = 'complete',
        certificate_count = 11,
        purchased_certificates = (
          SELECT json_agg(DISTINCT certificate_id)::text
          FROM user_payment up2
          WHERE up2.user_id = user_payment.user_id
          AND up2.status = 'completed'
        )
      WHERE user_id IN (SELECT user_id FROM user_payment_counts)
      AND bundle_type = 'individual';
    `);

    console.log(`✅ Converted ${multiplePaymentsResult.rowCount || 0} users to complete bundle`);

    // Add indexes for better performance
    console.log("📈 Adding database indexes...");

    const indexes = [
      { name: "idx_user_payment_bundle_type", columns: "bundle_type" },
      { name: "idx_user_payment_user_bundle", columns: "user_id, bundle_type" },
      { name: "idx_user_payment_certificate_search", columns: "purchased_certificates" }
    ];

    for (const index of indexes) {
      try {
        await db.execute(sql`
          CREATE INDEX IF NOT EXISTS ${sql.identifier(index.name)}
          ON user_payment (${sql.raw(index.columns)});
        `);
        console.log(`✅ Index ${index.name} created`);
      } catch (error: any) {
        console.log(`⚠️  Index ${index.name} might already exist:`, error.message);
      }
    }

    console.log("🎉 Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log("- Added bundle_type, certificate_count, purchased_certificates columns");
    console.log("- Updated existing payments to individual bundles");
    console.log("- Converted users with multiple payments to complete bundles");
    console.log("- Added performance indexes");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migratePricingBundles()
    .then(() => {
      console.log("✅ Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migration script failed:", error);
      process.exit(1);
    });
}

export { migratePricingBundles };
