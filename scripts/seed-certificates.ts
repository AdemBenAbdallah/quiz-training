import { db } from "@/db";
import { certificates } from "@/db/schema";
import { eq } from "drizzle-orm";

const seedCertificates = async () => {
  try {
    console.log("🌱 Seeding certificates...");

    const certificateData = [
      {
        slug: "dvac02",
        name: "AWS Certified Developer Associate",
        description:
          "DVA-C02 certification exam preparation with 500+ practice questions",
        totalLevels: 8,
        isActive: true,
      },
      {
        slug: "saac03",
        name: "AWS Certified Solutions Architect - Associate",
        description:
          "SAA-C03 certification exam preparation with comprehensive practice questions",
        totalLevels: 13,
        isActive: true,
      },
      {
        slug: "ansc01",
        name: "AWS Certified Advanced Networking - Specialty",
        description: "ANS-C01 certification exam preparation",
        totalLevels: 5,
        isActive: true,
      },
      {
        slug: "sapc02",
        name: "AWS Certified Solutions Architect - Professional",
        description: "SAP-C02 certification exam preparation",
        totalLevels: 7,
        isActive: true,
      },
      {
        slug: "clfc02",
        name: "AWS Certified Cloud Practitioner",
        description: "CLF-C02 certification exam preparation",
        totalLevels: 8,
        isActive: true,
      },
      {
        slug: "mlsc01",
        name: "AWS Certified Machine Learning - Specialty",
        description: "MLS-C01 certification exam preparation",
        totalLevels: 5,
        isActive: true,
      },
      {
        slug: "aifc01",
        name: "AWS Certified AI Practitioner",
        description: "AIF-C01 certification exam preparation",
        totalLevels: 5,
        isActive: true,
      },
      {
        slug: "dopc02",
        name: "AWS Certified DevOps Engineer - Professional",
        description: "DOP-C02 certification exam preparation",
        totalLevels: 6,
        isActive: true,
      },
      {
        slug: "scsc02",
        name: "AWS Certified Security - Specialty",
        description: "SCS-C02 certification exam preparation",
        totalLevels: 5,
        isActive: true,
      },
      {
        slug: "deac01",
        name: "AWS Certified Data Engineer - Associate",
        description: "DEA-C01 certification exam preparation",
        totalLevels: 4,
        isActive: true,
      },
      {
        slug: "mlac01",
        name: "AWS Certified Machine Learning Engineer - Associate",
        description: "MLA-C01 certification exam preparation",
        totalLevels: 3,
        isActive: true,
      },
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
