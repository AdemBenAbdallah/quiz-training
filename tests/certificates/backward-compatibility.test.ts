import { getCertificateMetadata } from "@/lib/certificates";
import { certificateLevels } from "@/public/quiz";
import { describe, expect, it } from "vitest";

describe("Certificate Structure Tests", () => {
  it("should have all 11 certificates", () => {
    expect(Object.keys(certificateLevels).length).toBe(11);
  });

  it("should have dvac02 (AWS Developer) certificate", () => {
    expect(certificateLevels["dvac02"]).toBeDefined();
    expect(Array.isArray(certificateLevels["dvac02"])).toBe(true);
    expect(certificateLevels["dvac02"].length).toBe(8);
  });

  it("should have all certificates with valid level structure", () => {
    const certs = Object.keys(certificateLevels);
    
    certs.forEach((certSlug) => {
      const levels = certificateLevels[certSlug as keyof typeof certificateLevels];
      expect(Array.isArray(levels)).toBe(true);
      expect(levels.length).toBeGreaterThan(0);
      
      levels.forEach((level) => {
        expect(Array.isArray(level)).toBe(true);
        expect(level.length).toBeGreaterThan(0);
      });
    });
  });

  it("should load certificate metadata correctly", () => {
    const metadata = getCertificateMetadata("dvac02");
    expect(metadata).toBeDefined();
    expect(metadata?.slug).toBe("dvac02");
    expect(metadata?.totalLevels).toBe(8);
    expect(metadata?.questionsPerLevel).toBeDefined();
    expect(Array.isArray(metadata?.questionsPerLevel)).toBe(true);
    expect(metadata?.questionsPerLevel?.length).toBe(8);
  });

  it("should maintain question structure in all certificate levels", () => {
    Object.keys(certificateLevels).forEach((certSlug) => {
      const levels = certificateLevels[certSlug as keyof typeof certificateLevels];
      
      levels.forEach((level) => {
        level.forEach((question: any) => {
          expect(question).toHaveProperty("question");
          expect(question).toHaveProperty("choices");
          expect(question).toHaveProperty("answers");
          expect(question).toHaveProperty("question_number");
          expect(question).toHaveProperty("url");
          
          expect(Array.isArray(question.choices)).toBe(true);
          expect(question.choices.length).toBeGreaterThan(0);
          
          expect(Array.isArray(question.answers)).toBe(true);
          expect(question.answers.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it("should have question count consistency with metadata", () => {
    const dvac02Levels = certificateLevels["dvac02"];
    const metadata = getCertificateMetadata("dvac02");
    
    if (metadata && dvac02Levels) {
      metadata.questionsPerLevel.forEach((expectedCount, index) => {
        const actualCount = dvac02Levels[index]?.length || 0;
        expect(actualCount).toBe(expectedCount);
      });
    }
  });
});
