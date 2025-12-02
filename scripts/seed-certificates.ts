import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";

const seedCertificates = async () => {
  try {
    console.log("🌱 Seeding certificates...");

    const certificateData = [
      {
        slug: "aws-developer",
        name: "AWS Certified Developer Associate",
        description: "DVA-C02 certification exam preparation with 500+ practice questions",
        totalLevels: 8,
        isActive: true,
      },
      {
        slug: "demo",
        name: "Demo Certificate",
        description: "A demo certificate to test the multi-certificate system",
        totalLevels: 2,
        isActive: true,
      },
      // Future certificates can be added here
      // {
      //   slug: "azure-fundamentals",
      //   name: "Azure Fundamentals",
      //   description: "AZ-900 certification exam preparation",
      //   totalLevels: 5,
      //   isActive: false,
      // },
    ];

    let addedCount = 0;
    for (const cert of certificateData) {
      // Check if certificate already exists
      const existing = await db
        .select()
        .from(certificates)
        .where(eq(certificates.slug, cert.slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(certificates).values({
          id: crypto.randomUUID(),
          ...cert,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        addedCount++;
        console.log(`✅ Added certificate: ${cert.name}`);
      } else {
        console.log(`⏭️  Certificate already exists: ${cert.name}`);
      }
    }

    console.log(`✅ Seeding complete. Added ${addedCount} new certificates.`);
  } catch (error) {
    console.error("❌ Error seeding certificates:", error);
    throw error;
  }
};

// Run if called directly
if (import.meta.main) {
  seedCertificates()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedCertificates;