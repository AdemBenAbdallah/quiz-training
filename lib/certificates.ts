import { Certificate, CertificateMetadata } from "@/types/certificate";

// Import certificate configurations
import ansc01Metadata from "@/public/quiz/ansc01/metadata.json";
import awsDeveloperMetadata from "@/public/quiz/aws-developer/metadata.json";
import certificatesIndex from "@/public/quiz/certificates/index.json";
import demoMetadata from "@/public/quiz/demo/metadata.json";

// Certificate metadata mapping
const certificateMetadata: Record<string, CertificateMetadata> = {
  "aws-developer": awsDeveloperMetadata as CertificateMetadata,
    "demo": demoMetadata as CertificateMetadata,
    "ansc01": ansc01Metadata as CertificateMetadata,
};

// Dynamic import function for quiz levels
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

// Get all available certificates
export function getAvailableCertificates(): Certificate[] {
  return certificatesIndex.certificates.map((cert: any) => ({
    id: cert.id,
    slug: cert.slug,
    name: cert.name,
    description: cert.description,
    totalLevels: cert.totalLevels,
    isActive: cert.isActive,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

// Get certificate metadata
export function getCertificateMetadata(
  slug: string,
): CertificateMetadata | null {
  return certificateMetadata[slug] || null;
}

// Get default certificate
export function getDefaultCertificate(): Certificate | null {
  const defaultSlug = certificatesIndex.defaultCertificate;
  const cert = certificatesIndex.certificates.find(
    (c: any) => c.slug === defaultSlug,
  );

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

// Check if certificate exists
export function certificateExists(slug: string): boolean {
  return certificatesIndex.certificates.some((cert: any) => cert.slug === slug);
}

// Get certificate by slug
export function getCertificateBySlug(slug: string): Certificate | null {
  const cert = certificatesIndex.certificates.find((c: any) => c.slug === slug);

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
