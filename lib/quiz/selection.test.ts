import { describe, it, expect } from "vitest";
import {
  type Choice,
  type Question,
  handleAnswerSelection,
  canSelectMoreAnswers,
  isAnswerCorrect,
  calculateScore,
  isChoiceDisabled,
} from "./selection";

// Mock test data
const singleAnswerQuestion: Question = {
  question: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  answer: ["C"],
  questionNumber: "Question 1",
};

const multipleAnswerQuestion: Question = {
  question: "Which of the following are programming languages? (Choose 2)",
  options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
  answer: ["A", "C"],
  questionNumber: "Question 2",
};

const tripleAnswerQuestion: Question = {
  question: "Select the correct AWS services (Choose 3)",
  options: ["EC2", "S3", "Lambda", "GitHub", "RDS"],
  answer: ["A", "B", "C"],
  questionNumber: "Question 3",
};

describe("handleAnswerSelection", () => {
  describe("Single answer questions", () => {
    it("should select first answer when none selected", () => {
      const result = handleAnswerSelection([], "A", singleAnswerQuestion);
      expect(result).toEqual(["A"]);
    });

    it("should replace current selection with new answer", () => {
      const result = handleAnswerSelection(["A"], "B", singleAnswerQuestion);
      expect(result).toEqual(["B"]);
    });

    it("should deselect answer when clicking same answer twice", () => {
      const result = handleAnswerSelection(["A"], "A", singleAnswerQuestion);
      expect(result).toEqual([]);
    });
  });

  describe("Multiple answer questions", () => {
    it("should add first answer when none selected", () => {
      const result = handleAnswerSelection([], "A", multipleAnswerQuestion);
      expect(result).toEqual(["A"]);
    });

    it("should add second answer when one already selected", () => {
      const result = handleAnswerSelection(["A"], "C", multipleAnswerQuestion);
      expect(result).toEqual(["A", "C"]);
    });

    it("should not add third answer when limit is 2", () => {
      const result = handleAnswerSelection(
        ["A", "C"],
        "B",
        multipleAnswerQuestion,
      );
      expect(result).toEqual(["A", "C"]);
    });

    it("should deselect answer when clicking already selected answer", () => {
      const result = handleAnswerSelection(
        ["A", "C"],
        "A",
        multipleAnswerQuestion,
      );
      expect(result).toEqual(["C"]);
    });

    it("should allow adding new answer after deselecting one", () => {
      const currentAnswers: Choice[] = ["A", "C"];
      const afterDeselect = handleAnswerSelection(
        currentAnswers,
        "A",
        multipleAnswerQuestion,
      );
      const afterReselect = handleAnswerSelection(
        afterDeselect,
        "B",
        multipleAnswerQuestion,
      );
      expect(afterReselect).toEqual(["C", "B"]);
    });
  });

  describe("Triple answer questions", () => {
    it("should handle three answer selection correctly", () => {
      let answers: Choice[] = [];
      answers = handleAnswerSelection(answers, "A", tripleAnswerQuestion);
      answers = handleAnswerSelection(answers, "B", tripleAnswerQuestion);
      answers = handleAnswerSelection(answers, "C", tripleAnswerQuestion);

      expect(answers).toEqual(["A", "B", "C"]);
    });

    it("should not allow fourth answer when limit is 3", () => {
      const currentAnswers: Choice[] = ["A", "B", "C"];
      const result = handleAnswerSelection(
        currentAnswers,
        "D",
        tripleAnswerQuestion,
      );
      expect(result).toEqual(["A", "B", "C"]);
    });
  });
});

describe("canSelectMoreAnswers", () => {
  it("should return true for single answer question with no selection", () => {
    const result = canSelectMoreAnswers([], singleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for single answer question with selection", () => {
    const result = canSelectMoreAnswers(["A"], singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return true for multiple answer question with one selection", () => {
    const result = canSelectMoreAnswers(["A"], multipleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for multiple answer question at limit", () => {
    const result = canSelectMoreAnswers(["A", "C"], multipleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return true for triple answer question with two selections", () => {
    const result = canSelectMoreAnswers(["A", "B"], tripleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for triple answer question at limit", () => {
    const result = canSelectMoreAnswers(["A", "B", "C"], tripleAnswerQuestion);
    expect(result).toBe(false);
  });
});

describe("isAnswerCorrect", () => {
  it("should return true for correct single answer", () => {
    const result = isAnswerCorrect(["C"], singleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for incorrect single answer", () => {
    const result = isAnswerCorrect(["A"], singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for no answer on single answer question", () => {
    const result = isAnswerCorrect([], singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return true for correct multiple answers in order", () => {
    const result = isAnswerCorrect(["A", "C"], multipleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return true for correct multiple answers out of order", () => {
    const result = isAnswerCorrect(["C", "A"], multipleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for incomplete multiple answers", () => {
    const result = isAnswerCorrect(["A"], multipleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for too many answers", () => {
    const result = isAnswerCorrect(["A", "B", "C"], multipleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for wrong multiple answers", () => {
    const result = isAnswerCorrect(["B", "D"], multipleAnswerQuestion);
    expect(result).toBe(false);
  });
});

describe("calculateScore", () => {
  const questions = [
    singleAnswerQuestion,
    multipleAnswerQuestion,
    tripleAnswerQuestion,
  ];

  it("should return 0 for all wrong answers", () => {
    const allAnswers = [["A"], ["B"], ["D", "E"]];
    const score = calculateScore(allAnswers, questions);
    expect(score).toBe(0);
  });

  it("should return full score for all correct answers", () => {
    const allAnswers = [["C"], ["A", "C"], ["A", "B", "C"]];
    const score = calculateScore(allAnswers, questions);
    expect(score).toBe(3);
  });

  it("should return partial score for mixed answers", () => {
    const allAnswers = [["C"], ["A"], ["A", "B", "C"]];
    const score = calculateScore(allAnswers, questions);
    expect(score).toBe(2); // First and third correct, second incomplete
  });

  it("should handle empty answers array", () => {
    const allAnswers = [[], [], []];
    const score = calculateScore(allAnswers, questions);
    expect(score).toBe(0);
  });

  it("should handle missing answers for some questions", () => {
    const allAnswers = [["C"]]; // Only first question answered
    const score = calculateScore(allAnswers, questions);
    expect(score).toBe(1);
  });
});

describe("isChoiceDisabled", () => {
  it("should return false for single answer question with no selection", () => {
    const result = isChoiceDisabled([], "A", singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for single answer question with current choice selected", () => {
    const result = isChoiceDisabled(["A"], "A", singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for single answer question with different choice selected", () => {
    const result = isChoiceDisabled(["A"], "B", singleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for multiple answer question under limit", () => {
    const result = isChoiceDisabled(["A"], "B", multipleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return false for multiple answer question at limit with selected choice", () => {
    const result = isChoiceDisabled(["A", "C"], "A", multipleAnswerQuestion);
    expect(result).toBe(false);
  });

  it("should return true for multiple answer question at limit with unselected choice", () => {
    const result = isChoiceDisabled(["A", "C"], "B", multipleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return true for triple answer question at limit with unselected choice", () => {
    const result = isChoiceDisabled(["A", "B", "C"], "D", tripleAnswerQuestion);
    expect(result).toBe(true);
  });

  it("should return false for triple answer question at limit with selected choice", () => {
    const result = isChoiceDisabled(["A", "B", "C"], "B", tripleAnswerQuestion);
    expect(result).toBe(false);
  });
});

describe("Edge cases and integration", () => {
  it("should handle rapid selection and deselection", () => {
    let answers: Choice[] = [];

    // Rapid selections
    answers = handleAnswerSelection(answers, "A", multipleAnswerQuestion);
    answers = handleAnswerSelection(answers, "B", multipleAnswerQuestion);
    answers = handleAnswerSelection(answers, "A", multipleAnswerQuestion); // Deselect A
    answers = handleAnswerSelection(answers, "C", multipleAnswerQuestion); // Select C

    expect(answers).toEqual(["B", "C"]);
    expect(canSelectMoreAnswers(answers, multipleAnswerQuestion)).toBe(false);
    expect(isChoiceDisabled(answers, "A", multipleAnswerQuestion)).toBe(true);
    expect(isChoiceDisabled(answers, "B", multipleAnswerQuestion)).toBe(false);
  });

  it("should maintain consistency between functions", () => {
    const answers: Choice[] = ["A", "C"];

    // canSelectMoreAnswers and isChoiceDisabled should be consistent
    const canSelectMore = canSelectMoreAnswers(answers, multipleAnswerQuestion);
    const isNewChoiceDisabled = isChoiceDisabled(
      answers,
      "B",
      multipleAnswerQuestion,
    );
    const isSelectedChoiceDisabled = isChoiceDisabled(
      answers,
      "A",
      multipleAnswerQuestion,
    );

    expect(canSelectMore).toBe(false);
    expect(isNewChoiceDisabled).toBe(true);
    expect(isSelectedChoiceDisabled).toBe(false);
  });

  it("should work with all choice types", () => {
    const allChoices: Choice[] = ["A", "B", "C", "D", "E"];

    allChoices.forEach((choice) => {
      const result = handleAnswerSelection([], choice, singleAnswerQuestion);
      expect(result).toEqual([choice]);
    });
  });
});
