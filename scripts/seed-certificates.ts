import { db } from "@/db";
import { certificates } from "@/db/schema";

const seedCertificates = async () => {
  try {
    console.log("🌱 Seeding certificates...");

    // Check if certificates already exist
    const existingCerts = await db.select().from(certificates);
    if (existingCerts.length > 0) {
      console.log("✅ Certificates already exist, skipping seed");
      return;
    }

    const certificateData = [
      {
        id: crypto.randomUUID(),
        slug: "aws-developer",
        name: "AWS Certified Developer Associate",
        description: "DVA-C02 certification exam preparation with 500+ practice questions",
        totalLevels: 8,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Future certificates can be added here
      // {
      //   id: crypto.randomUUID(),
      //   slug: "azure-fundamentals",
      //   name: "Azure Fundamentals",
      //   description: "AZ-900 certification exam preparation",
      //   totalLevels: 5,
      //   isActive: false,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ];

    await db.insert(certificates).values(certificateData);
    console.log(`✅ Seeded ${certificateData.length} certificates`);
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