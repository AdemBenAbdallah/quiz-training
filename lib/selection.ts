import { Choice, Question } from "@/types/quiz";

/**
 * Handles answer selection logic for quiz questions
 * @param currentAnswers - Currently selected answers
 * @param answer - The answer choice being selected/deselected
 * @param question - The question object containing correct answers
 * @returns New array of selected answers
 */
export function handleAnswerSelection(
  currentAnswers: Choice[],
  answer: Choice,
  question: Question,
): Choice[] {
  const maxAnswers = question.answer.length;

  if (currentAnswers.includes(answer)) {
    // Remove the answer if it's already selected (toggle off)
    return currentAnswers.filter((a) => a !== answer);
  } else if (maxAnswers === 1) {
    // Single answer question - replace current selection
    return [answer];
  } else if (currentAnswers.length < maxAnswers) {
    // Multiple answer question - add only if we haven't reached the limit
    return [...currentAnswers, answer];
  }
  // If we've reached the max number of answers, do nothing (don't add more)
  return currentAnswers;
}

/**
 * Checks if a user can select more answers for a given question
 * @param currentAnswers - Currently selected answers
 * @param question - The question object containing correct answers
 * @returns True if more answers can be selected
 */
export function canSelectMoreAnswers(
  currentAnswers: Choice[],
  question: Question,
): boolean {
  return currentAnswers.length < question.answer.length;
}

/**
 * Checks if the user's answers are correct for a given question
 * @param userAnswers - User's selected answers
 * @param question - The question object containing correct answers
 * @returns True if all answers match exactly
 */
export function isAnswerCorrect(
  userAnswers: Choice[],
  question: Question,
): boolean {
  const correctAnswerSet = new Set(question.answer);
  const userAnswerSet = new Set(userAnswers);

  return (
    correctAnswerSet.size === userAnswerSet.size &&
    [...correctAnswerSet].every((answer) => userAnswerSet.has(answer))
  );
}

/**
 * Calculates the quiz score based on correct answers
 * @param allAnswers - Array of user answers for each question
 * @param questions - Array of question objects
 * @returns Number of correct answers
 */
export function calculateScore(
  allAnswers: Choice[][],
  questions: Question[],
): number {
  return questions.reduce((score, question, index) => {
    const userAnswers = allAnswers[index] || [];
    return score + (isAnswerCorrect(userAnswers, question) ? 1 : 0);
  }, 0);
}

/**
 * Determines if a choice button should be disabled
 * @param currentAnswers - Currently selected answers
 * @param choice - The choice being evaluated
 * @param question - The question object
 * @returns True if the button should be disabled
 */
export function isChoiceDisabled(
  currentAnswers: Choice[],
  choice: Choice,
  question: Question,
): boolean {
  const isSelected = currentAnswers.includes(choice);

  // For single answer questions, never disable buttons (allow switching)
  if (question.answer.length === 1) {
    return false;
  }

  // For multiple answer questions, disable if at limit and choice not selected
  const isAtLimit =
    currentAnswers.length >= question.answer.length && !isSelected;
  return isAtLimit;
}
