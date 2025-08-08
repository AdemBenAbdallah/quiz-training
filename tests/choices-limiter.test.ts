// ai-sdk-preview-pdf-support/tests/choices-limiter.test.ts
import { describe, it, expect, vi } from "vitest";

// Create a simple mock of data processing for testing
// This simulates the data processing in quiz/[id]/page.tsx
function processQuizQuestion(rawQuestion: any) {
  const rawChoices = rawQuestion.choices;
  // This is the important functionality we're testing - limit to 5 choices
  if (rawChoices.length > 5) {
    console.warn(
      `Quiz question has ${rawChoices.length} choices; trimming to 5`
    );
  }
  const limited = rawChoices.slice(0, 5);

  return {
    questionNumber: rawQuestion.question_number,
    question: rawQuestion.question,
    options: limited,
    answer: rawQuestion.answers,
    answerComments: rawQuestion.answers,
    multipleAnswers: rawQuestion.answers.length > 1,
  };
}

describe("Choices limiter in data ingestion", () => {
  it("keeps all choices when there are 5 or fewer options", () => {
    const mockQuestion = {
      question_number: "Question #: 123",
      question: "What is the capital of France?",
      choices: ["London", "Paris", "Berlin", "Madrid", "Rome"],
      answers: ["B"]
    };

    const result = processQuizQuestion(mockQuestion);

    expect(result.options.length).toBe(5);
    expect(result.options).toEqual(mockQuestion.choices);
  });

  it("limits choices to 5 when there are more than 5 options", () => {
    // Mock console.warn to verify it's called
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const mockQuestion = {
      question_number: "Question #: 456",
      question: "Select all prime numbers:",
      choices: ["1", "2", "3", "4", "5", "6", "7", "11", "13"],
      answers: ["B", "C", "E", "G", "H"]
    };

    const result = processQuizQuestion(mockQuestion);

    // Verify only first 5 options were kept
    expect(result.options.length).toBe(5);
    expect(result.options).toEqual(mockQuestion.choices.slice(0, 5));

    // Verify warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "Quiz question has 9 choices; trimming to 5"
    );

    consoleWarnSpy.mockRestore();
  });

  it("handles empty choices array", () => {
    const mockQuestion = {
      question_number: "Question #: 789",
      question: "Empty question",
      choices: [],
      answers: []
    };

    const result = processQuizQuestion(mockQuestion);

    expect(result.options.length).toBe(0);
    expect(result.options).toEqual([]);
  });
});
