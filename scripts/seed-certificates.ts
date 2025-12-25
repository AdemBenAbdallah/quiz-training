import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";

const certificateData = [
  {
    id: "d4a30a6a-5584-4044-82ad-3a034ed9ba5c",
    slug: "dvac02",
    name: "AWS Certified Developer Associate",
    description:
      "DVA-C02 certification exam preparation with 500+ practice questions",
    totalLevels: 8,
    isActive: true,
  },
  {
    id: "5d203a46-af1a-4268-818b-2370b74a0fa6",
    slug: "saac03",
    name: "AWS Certified Solutions Architect - Associate",
    description:
      "SAA-C03 certification exam preparation with comprehensive practice questions",
    totalLevels: 13,
    isActive: true,
  },
  {
    id: "a0db9c04-0642-4c76-b244-d9b8ed078054",
    slug: "ansc01",
    name: "AWS Certified Advanced Networking - Specialty",
    description: "ANS-C01 certification exam preparation",
    totalLevels: 5,
    isActive: true,
  },
  {
    id: "a4eee8a5-5c09-4ce4-9cda-03e5431327f8",
    slug: "sapc02",
    name: "AWS Certified Solutions Architect - Professional",
    description: "SAP-C02 certification exam preparation",
    totalLevels: 7,
    isActive: true,
  },
  {
    id: "ba62351b-45b4-420d-9c8a-9079ac576f9d",
    slug: "clfc02",
    name: "AWS Certified Cloud Practitioner",
    description: "CLF-C02 certification exam preparation",
    totalLevels: 8,
    isActive: true,
  },
  {
    id: "088b0166-251c-43a1-8408-335c9cae7221",
    slug: "mlsc01",
    name: "AWS Certified Machine Learning - Specialty",
    description: "MLS-C01 certification exam preparation",
    totalLevels: 5,
    isActive: true,
  },
  {
    id: "45e794f0-f31d-4bf4-b28c-f47b1053f7b7",
    slug: "aifc01",
    name: "AWS Certified AI Practitioner",
    description: "AIF-C01 certification exam preparation",
    totalLevels: 5,
    isActive: true,
  },
  {
    id: "57296766-2eea-4a55-931f-1bab5d81e113",
    slug: "dopc02",
    name: "AWS Certified DevOps Engineer - Professional",
    description: "DOP-C02 certification exam preparation",
    totalLevels: 6,
    isActive: true,
  },
  {
    id: "c443db13-9b6f-4ffe-83e9-a071ca0484d2",
    slug: "scsc02",
    name: "AWS Certified Security - Specialty",
    description: "SCS-C02 certification exam preparation",
    totalLevels: 5,
    isActive: true,
  },
  {
    id: "ec103156-b657-4060-9893-c5ac5c58b45c",
    slug: "deac01",
    name: "AWS Certified Data Engineer - Associate",
    description: "DEA-C01 certification exam preparation",
    totalLevels: 4,
    isActive: true,
  },
  {
    id: "38a4d206-84cd-4834-a2c2-c20992acc3b7",
    slug: "mlac01",
    name: "AWS Certified Machine Learning Engineer - Associate",
    description: "MLA-C01 certification exam preparation",
    totalLevels: 3,
    isActive: true,
  },
];

async function seedCertificates() {
  console.log("🌱 Starting certificate seeding...\n");

  try {
    const existingAll = await db.select().from(certificates);
    console.log(`Current certificates in DB: ${existingAll.length}\n`);

    let addedCount = 0;
    let skippedCount = 0;

    for (const cert of certificateData) {
      console.log(`Checking: ${cert.slug}...`);

      try {
        const existing = await db
          .select()
          .from(certificates)
          .where(eq(certificates.slug, cert.slug))
          .limit(1);

        if (existing.length === 0) {
          console.log(`  → Inserting ${cert.slug}...`);

          await db.insert(certificates).values({
            id: cert.id,
            slug: cert.slug,
            name: cert.name,
            description: cert.description,
            totalLevels: cert.totalLevels,
            isActive: cert.isActive,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          addedCount++;
          console.log(`  ✅ Added: ${cert.name}`);
        } else {
          skippedCount++;
          console.log(`  ⏭️  Already exists: ${cert.name}`);
        }
      } catch (err) {
        console.error(`  ❌ Error with ${cert.slug}:`, err);
      }
    }

    console.log(`\n📊 Seeding complete!`);
    console.log(`   Added: ${addedCount}`);
    console.log(`   Skipped: ${skippedCount}`);

    const finalCount = await db.select().from(certificates);
    console.log(`   Total in DB: ${finalCount.length}`);
  } catch (error) {
    console.error("❌ Fatal error:", error);
    throw error;
  }
}

// Run if called directly via bun
seedCertificates()
  .then(() => {
    console.log("\n✅ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
