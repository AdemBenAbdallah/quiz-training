import { Certificate, CertificateMetadata } from "@/types/certificate";

// Import certificate configurations
import aifc01Metadata from "@/public/quiz/aifc01/metadata.json";
import ansc01Metadata from "@/public/quiz/ansc01/metadata.json";
import certificatesIndex from "@/public/quiz/certificates/index.json";
import clfc02Metadata from "@/public/quiz/clfc02/metadata.json";
import deac01Metadata from "@/public/quiz/deac01/metadata.json";
import dopc02Metadata from "@/public/quiz/dopc02/metadata.json";
import dvac02Metadata from "@/public/quiz/dvac02/metadata.json";
import mlac01Metadata from "@/public/quiz/mlac01/metadata.json";
import mlsc01Metadata from "@/public/quiz/mlsc01/metadata.json";
import scsc02Metadata from "@/public/quiz/scsc02/metadata.json";

// Certificate metadata mapping
const certificateMetadata: Record<string, CertificateMetadata> = {
  dvac02: dvac02Metadata as CertificateMetadata,
  ansc01: ansc01Metadata as CertificateMetadata,
  clfc02: clfc02Metadata as CertificateMetadata,
  mlsc01: mlsc01Metadata as CertificateMetadata,
  aifc01: aifc01Metadata as CertificateMetadata,
  dopc02: dopc02Metadata as CertificateMetadata,
  scsc02: scsc02Metadata as CertificateMetadata,
  deac01: deac01Metadata as CertificateMetadata,
  mlac01: mlac01Metadata as CertificateMetadata,
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
