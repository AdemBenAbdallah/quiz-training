import { describe, it, expect } from "vitest";
import { questionSchema } from "../lib/schemas";

describe("Five-option flow validation (A–E)", () => {
  it("validates a question with five options (A–E) and at least one answer", () => {
    const quizQuestion = {
      question: "Sample question?",
      options: ["opt1", "opt2", "opt3", "opt4", "opt5"],
      answer: ["A"],
    };

    const result = questionSchema.safeParse(quizQuestion);
    expect(result.success).toBe(true);
  });

  it("rejects questions with more than five options", () => {
    const quizQuestion = {
      question: "Sample question?",
      options: ["opt1", "opt2", "opt3", "opt4", "opt5", "opt6"],
      answer: ["A"],
    };

    const result = questionSchema.safeParse(quizQuestion);
    expect(result.success).toBe(false);
  });

  it("accepts as few as two options (minimum)", () => {
    const quizQuestion = {
      question: "Two option question?",
      options: ["opt1", "opt2"],
      answer: ["A", "B"],
    };

    const result = questionSchema.safeParse(quizQuestion);
    expect(result.success).toBe(true);
  });
});
