import { Certificate, CertificateMetadata } from "@/types/certificate";

// Static certificate metadata - inlined to avoid Turbopack import issues
const certificateMetadata: Record<string, CertificateMetadata> = {
  dvac02: {
    slug: "dvac02",
    name: "AWS Certified Developer Associate",
    description: "DVA-C02 certification exam preparation",
    totalLevels: 8,
    questionsPerLevel: [71, 71, 71, 71, 71, 71, 71, 55],
    levels: {
      "1": 71,
      "2": 71,
      "3": 71,
      "4": 71,
      "5": 71,
      "6": 71,
      "7": 71,
      "8": 55,
    },
    heroTitle: "Master DVA-C02",
    heroDescription: "Prepare for the DVA-C02 certification exam",
    badgeColor: "bg-orange-500",
    lastUpdated: "2025-12-05",
  },
  ansc01: {
    slug: "ansc01",
    name: "AWS Certified Advanced Networking - Specialty",
    description: "ANS-C01 certification exam preparation",
    totalLevels: 5,
    questionsPerLevel: [65, 65, 65, 65, 10],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 10,
    },
    heroTitle: "Master AWS Advanced Networking",
    heroDescription:
      "Prepare for the AWS Certified Advanced Networking - Specialty exam with comprehensive practice questions",
    badgeColor: "bg-blue-500",
    lastUpdated: "2025-11-29T13:15:02.932266",
  },
  clfc02: {
    slug: "clf-c02",
    name: "CLF-C02",
    description: "CLF-C02 certification preparation",
    totalLevels: 8,
    questionsPerLevel: [65, 65, 65, 65, 65, 65, 65, 62],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 65,
      "6": 65,
      "7": 65,
      "8": 62,
    },
    heroTitle: "Master CLF-C02",
    heroDescription: "Prepare for the CLF-C02 certification exam",
    badgeColor: "bg-gray-500",
    lastUpdated: "2025-12-05T14:03:23.914346",
  },
  mlsc01: {
    slug: "mls-c01",
    name: "MLS-C01",
    description: "MLS-C01 certification preparation",
    totalLevels: 5,
    questionsPerLevel: [65, 65, 65, 65, 33],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 33,
    },
    heroTitle: "Master MLS-C01",
    heroDescription: "Prepare for the MLS-C01 certification exam",
    badgeColor: "bg-gray-500",
    lastUpdated: "2025-12-05T14:05:42.952206",
  },
  aifc01: {
    slug: "aif-c01",
    name: "AIF-C01",
    description: "AIF-C01 certification preparation",
    totalLevels: 5,
    questionsPerLevel: [65, 65, 65, 65, 46],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 46,
    },
    heroTitle: "Master AIF-C01",
    heroDescription: "Prepare for the AIF-C01 certification exam",
    badgeColor: "bg-gray-500",
    lastUpdated: "2025-12-05T14:06:48.117457",
  },
  dopc02: {
    slug: "dop-c02",
    name: "DOP-C02",
    description: "DOP-C02 certification preparation",
    totalLevels: 6,
    questionsPerLevel: [65, 65, 65, 65, 65, 42],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 65,
      "6": 42,
    },
    heroTitle: "Master DOP-C02",
    heroDescription: "Prepare for the DOP-C02 certification exam",
    badgeColor: "bg-gray-500",
    lastUpdated: "2025-12-05T14:07:21.885713",
  },
  scsc02: {
    slug: "scs-c02",
    name: "SCS-C02",
    description: "SCS-C02 certification preparation",
    totalLevels: 5,
    questionsPerLevel: [65, 65, 65, 65, 25],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 25,
    },
    heroTitle: "Master SCS-C02",
    heroDescription: "Prepare for the SCS-C02 certification exam",
    badgeColor: "bg-gray-500",
    lastUpdated: "2025-12-05T14:07:53.572230",
  },
  deac01: {
    slug: "deac01",
    name: "AWS Certified Data Engineer - Associate",
    description: "DEA-C01 certification exam preparation",
    totalLevels: 4,
    questionsPerLevel: [65, 65, 65, 49],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 49,
    },
    heroTitle: "Master DEA-C01",
    heroDescription: "Prepare for the DEA-C01 certification exam",
    badgeColor: "bg-cyan-500",
    lastUpdated: "2025-12-05",
  },
  mlac01: {
    slug: "mlac01",
    name: "AWS Certified Machine Learning Engineer - Associate",
    description: "MLA-C01 certification exam preparation",
    totalLevels: 3,
    questionsPerLevel: [50, 50, 33],
    levels: {
      "1": 50,
      "2": 50,
      "3": 33,
    },
    heroTitle: "Master MLA-C01",
    heroDescription: "Prepare for the MLA-C01 certification exam",
    badgeColor: "bg-pink-500",
    lastUpdated: "2025-12-05",
  },
  saac03: {
    slug: "saac03",
    name: "AWS Certified Solutions Architect - Associate",
    description: "SAA-C03 certification exam preparation",
    totalLevels: 13,
    questionsPerLevel: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 13],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 65,
      "6": 65,
      "7": 65,
      "8": 65,
      "9": 65,
      "10": 65,
      "11": 65,
      "12": 65,
      "13": 13,
    },
    heroTitle: "Master SAA-C03",
    heroDescription:
      "Prepare for the AWS Solutions Architect Associate certification exam",
    badgeColor: "bg-yellow-500",
    lastUpdated: "2025-12-06T16:49:09.212374",
  },
  sapc02: {
    slug: "sapc02",
    name: "AWS Certified Solutions Architect - Professional",
    description: "SAP-C02 certification exam preparation",
    totalLevels: 7,
    questionsPerLevel: [65, 65, 65, 65, 65, 65, 42],
    levels: {
      "1": 65,
      "2": 65,
      "3": 65,
      "4": 65,
      "5": 65,
      "6": 65,
      "7": 42,
    },
    heroTitle: "Master SAP-C02",
    heroDescription:
      "Prepare for the AWS Solutions Architect Professional certification exam",
    badgeColor: "bg-amber-500",
    lastUpdated: "2025-12-06T16:49:25.746865",
  },
};

// Static certificates index
const certificatesIndex = {
  certificates: [
    {
      id: "d4a30a6a-5584-4044-82ad-3a034ed9ba5c",
      slug: "dvac02",
      name: "AWS Certified Developer Associate",
      description: "DVA-C02 certification exam preparation",
      totalLevels: 8,
      isActive: true,
      isDefault: true,
      badgeColor: "bg-orange-500",
    },
    {
      id: "a0db9c04-0642-4c76-b244-d9b8ed078054",
      slug: "ansc01",
      name: "AWS Certified Advanced Networking - Specialty",
      description: "ANS-C01 certification exam preparation",
      totalLevels: 5,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-blue-500",
    },
    {
      id: "ba62351b-45b4-420d-9c8a-9079ac576f9d",
      slug: "clfc02",
      name: "AWS Certified Cloud Practitioner",
      description: "CLF-C02 certification exam preparation",
      totalLevels: 8,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-gray-500",
    },
    {
      id: "088b0166-251c-43a1-8408-335c9cae7221",
      slug: "mlsc01",
      name: "AWS Certified Machine Learning - Specialty",
      description: "MLS-C01 certification exam preparation",
      totalLevels: 5,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-purple-500",
    },
    {
      id: "45e794f0-f31d-4bf4-b28c-f47b1053f7b7",
      slug: "aifc01",
      name: "AWS Certified AI Practitioner",
      description: "AIF-C01 certification exam preparation",
      totalLevels: 5,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-green-500",
    },
    {
      id: "57296766-2eea-4a55-931f-1bab5d81e113",
      slug: "dopc02",
      name: "AWS Certified DevOps Engineer - Professional",
      description: "DOP-C02 certification exam preparation",
      totalLevels: 6,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-indigo-500",
    },
    {
      id: "c443db13-9b6f-4ffe-83e9-a071ca0484d2",
      slug: "scsc02",
      name: "AWS Certified Security - Specialty",
      description: "SCS-C02 certification exam preparation",
      totalLevels: 5,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-red-500",
    },
    {
      id: "ec103156-b657-4060-9893-c5ac5c58b45c",
      slug: "deac01",
      name: "AWS Certified Data Engineer - Associate",
      description: "DEA-C01 certification exam preparation",
      totalLevels: 4,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-cyan-500",
    },
    {
      id: "38a4d206-84cd-4834-a2c2-c20992acc3b7",
      slug: "mlac01",
      name: "AWS Certified Machine Learning Engineer - Associate",
      description: "MLA-C01 certification exam preparation",
      totalLevels: 3,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-pink-500",
    },
    {
      id: "5d203a46-af1a-4268-818b-2370b74a0fa6",
      slug: "saac03",
      name: "AWS Certified Solutions Architect - Associate",
      description: "SAA-C03 certification exam preparation",
      totalLevels: 13,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-yellow-500",
    },
    {
      id: "a4eee8a5-5c09-4ce4-9cda-03e5431327f8",
      slug: "sapc02",
      name: "AWS Certified Solutions Architect - Professional",
      description: "SAP-C02 certification exam preparation",
      totalLevels: 7,
      isActive: true,
      isDefault: false,
      badgeColor: "bg-amber-500",
    },
  ],
  defaultCertificate: "dvac02",
};

// Load certificates index (synchronous - now returns static data)
export function loadCertificatesIndex() {
  return certificatesIndex;
}

// Load certificate metadata (synchronous - now returns static data)
export function loadCertificateMetadata(
  slug: string,
): CertificateMetadata | null {
  return certificateMetadata[slug] || null;
}

// Dynamic import function for quiz levels (still async for large data)
export async function loadCertificateLevel(
  certificateSlug: string,
  level: number,
): Promise<any[]> {
  try {
    const levelData = await import(
      `@/public/quiz/${certificateSlug}/level${level}.json`
    );
    return levelData.default;
  } catch (error) {
    console.error(
      `Failed to load level ${level} for certificate ${certificateSlug}:`,
      error,
    );
    return [];
  }
}

// Get all available certificates (synchronous)
export function getAvailableCertificates(): Certificate[] {
  const data = loadCertificatesIndex();
  const result = data.certificates.map((cert: any) => ({
    id: cert.id,
    slug: cert.slug,
    name: cert.name,
    description: cert.description,
    totalLevels: cert.totalLevels,
    isActive: cert.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  return result;
}

// Get certificate metadata (synchronous)
export function getCertificateMetadata(
  slug: string,
): CertificateMetadata | null {
  return loadCertificateMetadata(slug);
}

// Get default certificate (synchronous)
export function getDefaultCertificate(): Certificate | null {
  const data = loadCertificatesIndex();
  const defaultSlug = data.defaultCertificate;
  const cert = data.certificates.find((c: any) => c.slug === defaultSlug);

  if (!cert) return null;

  return {
    id: cert.id,
    slug: cert.slug,
    name: cert.name,
    description: cert.description,
    totalLevels: cert.totalLevels,
    isActive: cert.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Check if certificate exists (synchronous)
export function certificateExists(slug: string): boolean {
  const data = loadCertificatesIndex();
  return data.certificates.some((cert: any) => cert.slug === slug);
}

// Get certificate by slug (synchronous)
export function getCertificateBySlug(slug: string): Certificate | null {
  const data = loadCertificatesIndex();
  const cert = data.certificates.find((c: any) => c.slug === slug);

  if (!cert) return null;

  return {
    id: cert.id,
    slug: cert.slug,
    name: cert.name,
    description: cert.description,
    totalLevels: cert.totalLevels,
    isActive: cert.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
