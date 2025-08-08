import React from 'react';

// Define the simplified Choice type that only supports A-E
export type Choice = "A" | "B" | "C" | "D" | "E";

// Define a simplified Question interface for testing
export interface Question {
  question: string;
  options: string[];
  answer: Choice[];
  questionNumber?: string;
  answerComments?: string[];
  multipleAnswers?: boolean;
}

// Define simple QuizProps for testing
interface QuizProps {
  idx: number;
  questions: Question[];
  title: string;
}

// Create a simplified Quiz component for testing
const QuizMock: React.FC<QuizProps> = ({ questions, title }) => {
  // Keep only the minimal UI needed for tests
  return (
    <div data-testid="quiz-mock">
      <h1>{title}</h1>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="question-container">
          <h2>{question.question}</h2>
          <div className="options">
            {question.options.map((option, oIndex) => {
              const label = ["A", "B", "C", "D", "E"][oIndex] as Choice;
              return (
                <button key={oIndex} className="option-button">
                  <span className="option-label">{label}</span>
                  <span className="option-text">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuizMock;
