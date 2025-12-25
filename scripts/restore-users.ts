import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import fs from "fs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function restoreUsers() {
  console.log("📥 Restoring users from backup...\n");

  try {
    // Read users from JSON file
    const usersData = JSON.parse(fs.readFileSync("./users-backup.json", "utf-8"));
    console.log(`✓ Loaded ${usersData.length} users from backup\n`);

    // Insert users
    for (const user of usersData) {
      await pool.query(
        `INSERT INTO "user" (id, name, email, email_verified, image, created_at, updated_at, last_reminder_sent_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          user.id,
          user.name,
          user.email,
          user.email_verified,
          user.image,
          user.created_at,
          user.updated_at,
          user.last_reminder_sent_at,
        ]
      );
    }

    console.log(`✓ Restored ${usersData.length} users\n`);
    console.log("✅ Users restored successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

restoreUsers();
