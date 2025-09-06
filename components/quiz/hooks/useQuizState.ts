import { useState } from "react";
import { Question, Choice } from "@/types/quiz";
import { handleAnswerSelection, calculateScore } from "@/lib/selection";

export interface QuizState {
  answers: Choice[][];
  isSubmitted: boolean[];
  score: number | null;
  isQuizComplete: boolean;
}

export interface QuizStateActions {
  selectAnswer: (questionIndex: number, answer: Choice) => void;
  submitQuestion: (questionIndex: number) => void;
  submitQuiz: () => number;
  resetQuiz: () => void;
  isQuestionSubmitted: (questionIndex: number) => boolean;
  getQuestionAnswers: (questionIndex: number) => Choice[];
}

export const useQuizState = (
  questions: Question[],
): QuizState & QuizStateActions => {
  const [answers, setAnswers] = useState<Choice[][]>(
    Array(questions.length).fill([]) as Choice[][],
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean[]>(
    Array(questions.length).fill(false),
  );
  const [score, setScore] = useState<number | null>(null);

  const isQuizComplete = isSubmitted.every(Boolean);

  const selectAnswer = (questionIndex: number, answer: Choice) => {
    if (!isSubmitted[questionIndex]) {
      const newAnswers = [...answers];
      const currentAnswers = newAnswers[questionIndex] || [];

      newAnswers[questionIndex] = handleAnswerSelection(
        currentAnswers,
        answer,
        questions[questionIndex],
      );

      setAnswers(newAnswers);
    }
  };

  const submitQuestion = (questionIndex: number) => {
    const updated = [...isSubmitted];
    updated[questionIndex] = true;
    setIsSubmitted(updated);
  };

  const submitQuiz = () => {
    const correctAnswers = calculateScore(answers, questions);
    setScore(correctAnswers);
    setIsSubmitted(Array(questions.length).fill(true));
    return correctAnswers;
  };

  const resetQuiz = () => {
    setAnswers(Array(questions.length).fill([]) as Choice[][]);
    setIsSubmitted(Array(questions.length).fill(false));
    setScore(null);
  };

  const isQuestionSubmitted = (questionIndex: number) => {
    return isSubmitted[questionIndex] ?? false;
  };

  const getQuestionAnswers = (questionIndex: number) => {
    return answers[questionIndex] || [];
  };

  return {
    answers,
    isSubmitted,
    score,
    isQuizComplete,
    selectAnswer,
    submitQuestion,
    submitQuiz,
    resetQuiz,
    isQuestionSubmitted,
    getQuestionAnswers,
  };
};
