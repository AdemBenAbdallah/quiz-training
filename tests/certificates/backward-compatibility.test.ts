import { getCertificateMetadata } from "@/lib/certificates";
import { certificateLevels, quizLevels } from "@/public/quiz";
import { describe, expect, it } from "vitest";

describe("Backward Compatibility Tests", () => {
  it("should maintain legacy quizLevels structure", () => {
    expect(quizLevels).toBeDefined();
    expect(Array.isArray(quizLevels)).toBe(true);
    expect(quizLevels.length).toBe(8);

    // Check that each level has questions
    quizLevels.forEach((level, index) => {
      expect(Array.isArray(level)).toBe(true);
      expect(level.length).toBeGreaterThan(0);

      // Check question structure
      if (level.length > 0) {
        const question = level[0];
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("choices");
        expect(question).toHaveProperty("answers");
        expect(question).toHaveProperty("question_number");
      }
    });
  });

  it("should have certificate levels matching legacy structure", () => {
    expect(certificateLevels).toBeDefined();
    expect(certificateLevels["dvac02"]).toBeDefined();

    const awsLevels = certificateLevels["dvac02"];
    expect(Array.isArray(awsLevels)).toBe(true);
    expect(awsLevels.length).toBe(8);

    // Compare with legacy levels
    awsLevels.forEach((certLevel, index) => {
      const legacyLevel = quizLevels[index];
      expect(certLevel).toEqual(legacyLevel);
    });
  });

  it("should load AWS certificate metadata correctly", () => {
    const metadata = getCertificateMetadata("dvac02");
    expect(metadata).toBeDefined();
    expect(metadata?.slug).toBe("dvac02");
    expect(metadata?.totalLevels).toBe(8);
    expect(metadata?.questionsPerLevel).toBeDefined();
    expect(Array.isArray(metadata?.questionsPerLevel)).toBe(true);
    expect(metadata?.questionsPerLevel?.length).toBe(8);
  });

  it("should maintain question count consistency", () => {
    const metadata = getCertificateMetadata("dvac02");
    const awsLevels = certificateLevels["dvac02"];

    if (metadata && awsLevels) {
      metadata.questionsPerLevel.forEach((expectedCount, index) => {
        const actualCount = awsLevels[index]?.length || 0;
        expect(actualCount).toBe(expectedCount);
      });
    }
  });

  it("should preserve question structure in certificate levels", () => {
    const awsLevels = certificateLevels["dvac02"];

    awsLevels?.forEach((level) => {
      level.forEach((question) => {
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("choices");
        expect(question).toHaveProperty("answers");
        expect(question).toHaveProperty("question_number");
        expect(question).toHaveProperty("url");

        // Check choices structure
        expect(Array.isArray(question.choices)).toBe(true);
        expect(question.choices.length).toBeGreaterThan(0);

        // Check answers structure
        expect(Array.isArray(question.answers)).toBe(true);
        expect(question.answers.length).toBeGreaterThan(0);
      });
    });
  });
});
