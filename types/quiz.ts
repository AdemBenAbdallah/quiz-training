export const quizLevelNumber = 8;
export type Choice = "A" | "B" | "C" | "D" | "E";

export interface Question {
  question: string;
  options: string[];
  answer: Choice[];
  questionNumber?: string;
  answerComments?: string[];
  multipleAnswers?: boolean;
}
