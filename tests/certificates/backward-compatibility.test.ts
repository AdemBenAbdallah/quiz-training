import { describe, it, expect } from "vitest";
import { quizLevels, certificateLevels } from "@/public/quiz";
import { getCertificateMetadata } from "@/lib/certificates";

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
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('choices');
        expect(question).toHaveProperty('answers');
        expect(question).toHaveProperty('question_number');
      }
    });
  });

  it("should have certificate levels matching legacy structure", () => {
    expect(certificateLevels).toBeDefined();
    expect(certificateLevels["aws-developer"]).toBeDefined();
    
    const awsLevels = certificateLevels["aws-developer"];
    expect(Array.isArray(awsLevels)).toBe(true);
    expect(awsLevels.length).toBe(8);
    
    // Compare with legacy levels
    awsLevels.forEach((certLevel, index) => {
      const legacyLevel = quizLevels[index];
      expect(certLevel).toEqual(legacyLevel);
    });
  });

  it("should load AWS certificate metadata correctly", () => {
    const metadata = getCertificateMetadata('aws-developer');
    expect(metadata).toBeDefined();
    expect(metadata?.slug).toBe('aws-developer');
    expect(metadata?.totalLevels).toBe(8);
    expect(metadata?.questionsPerLevel).toBeDefined();
    expect(Array.isArray(metadata?.questionsPerLevel)).toBe(true);
    expect(metadata?.questionsPerLevel?.length).toBe(8);
  });

  it("should maintain question count consistency", () => {
    const metadata = getCertificateMetadata('aws-developer');
    const awsLevels = certificateLevels["aws-developer"];
    
    if (metadata && awsLevels) {
      metadata.questionsPerLevel.forEach((expectedCount, index) => {
        const actualCount = awsLevels[index]?.length || 0;
        expect(actualCount).toBe(expectedCount);
      });
    }
  });

  it("should preserve question structure in certificate levels", () => {
    const awsLevels = certificateLevels["aws-developer"];
    
    awsLevels?.forEach((level) => {
      level.forEach((question) => {
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('choices');
        expect(question).toHaveProperty('answers');
        expect(question).toHaveProperty('question_number');
        expect(question).toHaveProperty('url');
        
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