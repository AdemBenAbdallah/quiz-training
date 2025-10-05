/**
 * Shared utilities for question explanation functionality
 * Used by both the API route and cache warming script to ensure consistency
 */

export interface QuizQuestion {
  question: string;
  choices: string[];
  answers: string[];
  url?: string;
  question_number?: string;
}

/**
 * Cleans question choices by removing prefixes and suffixes
 * Removes "A. ", "B. ", etc. prefixes and "Most Voted" suffix
 */
export function cleanOptions(options: string[]): string[] {
  return options.map((choice) => {
    // Remove leading A., B., C., D., E. patterns and extra text like "Most Voted"
    return choice
      .replace(/^[A-E]\.\s*/, "")
      .replace(/Most Voted$/, "")
      .trim();
  });
}

/**
 * Generates a consistent cache key for question explanations
 * Uses normalized question, options, and answers to create a unique base64 encoded key
 */
export function generateCacheKey(
  question: string,
  options: string[],
  answer: ("A" | "B" | "C" | "D" | "E")[],
): string {
  // Create a unique key based on the question content
  const normalizedQuestion = question.toLowerCase().trim();
  const normalizedOptions = options.map((opt) => opt.toLowerCase().trim());
  const normalizedAnswer = answer.join(",").toLowerCase().trim();

  // Create a hash of the question data
  return `explain:${Buffer.from(
    JSON.stringify({
      q: normalizedQuestion,
      o: normalizedOptions,
      a: normalizedAnswer,
    }),
  ).toString("base64")}`;
}

/**
 * Processes a quiz question for cache key generation
 * Combines cleaning and key generation in one step
 */
export function processQuestionForCache(question: QuizQuestion): {
  cacheKey: string;
  cleanedOptions: string[];
} {
  const cleanedOptions = cleanOptions(question.choices);
  const cacheKey = generateCacheKey(
    question.question,
    cleanedOptions,
    question.answers as ("A" | "B" | "C" | "D" | "E")[],
  );

  return { cacheKey, cleanedOptions };
}
