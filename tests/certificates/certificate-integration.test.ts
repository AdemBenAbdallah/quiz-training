import { describe, it, expect } from "vitest";
import { 
  getAvailableCertificates, 
  getCertificateMetadata, 
  getDefaultCertificate,
  certificateExists,
  getCertificateBySlug 
} from "@/lib/certificates";

describe("Certificate Integration Tests", () => {
  it("should load AWS Developer certificate data", () => {
    const certificates = getAvailableCertificates();
    expect(certificates.length).toBeGreaterThan(0);
    
    const awsCert = certificates.find(c => c.slug === 'aws-developer');
    expect(awsCert).toBeDefined();
    expect(awsCert?.name).toBe('AWS Certified Developer Associate');
  });

  it("should load certificate metadata", () => {
    const metadata = getCertificateMetadata('aws-developer');
    expect(metadata).toBeDefined();
    expect(metadata?.slug).toBe('aws-developer');
    expect(metadata?.totalLevels).toBe(8);
    expect(metadata?.questionsPerLevel).toBeDefined();
    expect(Array.isArray(metadata?.questionsPerLevel)).toBe(true);
  });

  it("should have default certificate", () => {
    const defaultCert = getDefaultCertificate();
    expect(defaultCert).toBeDefined();
    expect(defaultCert?.slug).toBe('aws-developer');
  });

  it("should validate certificate existence", () => {
    expect(certificateExists('aws-developer')).toBe(true);
    expect(certificateExists('non-existent')).toBe(false);
  });

  it("should retrieve certificate by slug", () => {
    const cert = getCertificateBySlug('aws-developer');
    expect(cert).toBeDefined();
    expect(cert?.name).toBe('AWS Certified Developer Associate');
    
    const nonExistent = getCertificateBySlug('non-existent');
    expect(nonExistent).toBeNull();
  });
});