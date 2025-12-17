import {
  certificateExists,
  getAvailableCertificates,
  getCertificateBySlug,
  getCertificateMetadata,
  getDefaultCertificate,
} from "@/lib/certificates";
import { describe, expect, it } from "vitest";

describe("Certificate Integration Tests", () => {
  it("should load AWS Developer certificate data", () => {
    const certificates = getAvailableCertificates();
    expect(certificates.length).toBeGreaterThan(0);

    const awsCert = certificates.find((c) => c.slug === "dvac02");
    expect(awsCert).toBeDefined();
    expect(awsCert?.name).toBe("AWS Certified Developer Associate");
  });

  it("should load certificate metadata", () => {
    const metadata = getCertificateMetadata("dvac02");
    expect(metadata).toBeDefined();
    expect(metadata?.slug).toBe("dvac02");
    expect(metadata?.totalLevels).toBe(8);
    expect(metadata?.questionsPerLevel).toBeDefined();
    expect(Array.isArray(metadata?.questionsPerLevel)).toBe(true);
    expect(metadata?.questionsPerLevel?.length).toBe(8);
  });

  it("should have default certificate", () => {
    const defaultCert = getDefaultCertificate();
    expect(defaultCert).toBeDefined();
    expect(defaultCert?.slug).toBe("dvac02");
  });

  it("should validate certificate existence", () => {
    expect(certificateExists("dvac02")).toBe(true);
    expect(certificateExists("non-existent")).toBe(false);
  });

  it("should retrieve certificate by slug", () => {
    const cert = getCertificateBySlug("dvac02");
    expect(cert).toBeDefined();
    expect(cert?.name).toBe("AWS Certified Developer Associate");

    const nonExistent = getCertificateBySlug("non-existent");
    expect(nonExistent).toBeNull();
  });
});
