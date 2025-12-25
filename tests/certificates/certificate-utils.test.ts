import {
  certificateExists,
  getAvailableCertificates,
  getCertificateBySlug,
  getCertificateMetadata,
  getDefaultCertificate,
} from "@/lib/certificates";
import { beforeEach, describe, expect, it } from "vitest";

describe("Certificate Utilities", () => {
  beforeEach(() => {
    // Reset any module state if needed
  });

  describe("getAvailableCertificates", () => {
    it("should return an array of certificates", () => {
      const certificates = getAvailableCertificates();
      expect(Array.isArray(certificates)).toBe(true);
      expect(certificates.length).toBeGreaterThan(0);
    });

    it("should return certificates with required fields", () => {
      const certificates = getAvailableCertificates();
      const cert = certificates[0];

      expect(cert).toHaveProperty("id");
      expect(cert).toHaveProperty("slug");
      expect(cert).toHaveProperty("name");
      expect(cert).toHaveProperty("totalLevels");
      expect(cert).toHaveProperty("isActive");
    });

    it("should include AWS Developer certificate", () => {
      const certificates = getAvailableCertificates();
      const awsCert = certificates.find((c) => c.slug === "dvac02");

      expect(awsCert).toBeDefined();
      expect(awsCert?.name).toBe("AWS Certified Developer Associate");
      expect(awsCert?.totalLevels).toBe(8);
    });
  });

  describe("getCertificateMetadata", () => {
    it("should return metadata for existing certificate", () => {
      const metadata = getCertificateMetadata("dvac02");

      expect(metadata).toBeDefined();
      expect(metadata?.slug).toBe("dvac02");
      expect(metadata?.name).toBe("AWS Certified Developer Associate");
      expect(metadata?.totalLevels).toBe(8);
      expect(metadata?.questionsPerLevel).toBeDefined();
      expect(metadata?.heroTitle).toBeDefined();
    });

    it("should return null for non-existent certificate", () => {
      const metadata = getCertificateMetadata("non-existent");
      expect(metadata).toBeNull();
    });
  });

  describe("getDefaultCertificate", () => {
    it("should return AWS Developer as default", () => {
      const defaultCert = getDefaultCertificate();

      expect(defaultCert).toBeDefined();
      expect(defaultCert?.slug).toBe("dvac02");
      expect(defaultCert?.name).toBe("AWS Certified Developer Associate");
    });
  });

  describe("certificateExists", () => {
    it("should return true for existing certificate", () => {
      expect(certificateExists("dvac02")).toBe(true);
    });

    it("should return false for non-existent certificate", () => {
      expect(certificateExists("non-existent")).toBe(false);
    });
  });

  describe("getCertificateBySlug", () => {
    it("should return certificate for existing slug", () => {
      const cert = getCertificateBySlug("dvac02");

      expect(cert).toBeDefined();
      expect(cert?.slug).toBe("dvac02");
      expect(cert?.name).toBe("AWS Certified Developer Associate");
    });

    it("should return null for non-existent slug", () => {
      const cert = getCertificateBySlug("non-existent");
      expect(cert).toBeNull();
    });
  });
});
