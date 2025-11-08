"use client";

import { useState, useRef, useEffect } from "react";
import { Question, Choice } from "@/types/quiz";
import rawQuestions from "@/quiz/level1.json";
import QuestionCard from "@/components/QuestionCard";
import QuestionExplainDialog from "@/components/QuestionExplainDialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hook/useUser";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Progress } from "./ui/progress";

const transformQuestionData = (data: any[]): Question[] => {
  return data.map((raw, index) => {
    const options = raw.choices.map((choice: string) =>
      choice.replace(/^[A-Z]\.\s/, ""),
    );
    return {
      question: raw.question,
      options: options,
      answer: raw.answers,
      questionNumber: `Question #${index + 1}`,
      answerComments: raw.answer_comments || [],
      multipleAnswers: raw.answers.length > 1,
    };
  });
};

const questions: Question[] = transformQuestionData(rawQuestions.slice(0, 3));

type PublicQuizProps = {
  setOpenSignUp: (open: boolean) => void;
};

const PublicQuiz = ({ setOpenSignUp }: PublicQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Choice[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { session } = useUser();
  const quizContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quizContainerRef.current) {
      quizContainerRef.current.scrollTop = 0;
    }
  }, [currentQuestionIndex]);

  const handleSelectAnswer = (answer: Choice) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answer)) {
        return prev.filter((a) => a !== answer);
      }
      // For single choice questions, replace the selection
      if (currentQuestion.answer.length === 1) {
        return [answer];
      }
      return [...prev, answer];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex >= 2 && !session?.session) {
      setOpenSignUp(true);
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswers([]);
      setIsSubmitted(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <main
      ref={quizContainerRef}
      className="container mx-auto px-4 py-12 max-w-4xl overflow-y-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Practice Quiz</h1>
        <p className="text-muted-foreground">
          Try out a few questions to see how it works.
        </p>
      </div>

      <Progress value={progress} className="h-1 mb-8" />

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-8">
              <QuestionCard
                question={currentQuestion}
                selectedAnswers={selectedAnswers}
                onSelectAnswer={handleSelectAnswer}
                isSubmitted={isSubmitted}
                showCorrectAnswer={isSubmitted}
              />
              <div className="flex justify-center">
                <QuestionExplainDialog question={currentQuestion} />
              </div>

              <div className="flex justify-between items-center pt-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="ghost"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                <span className="text-sm font-medium">
                  {currentQuestionIndex + 1} / {questions.length}
                </span>

                <Button onClick={handleNext} variant="ghost">
                  {currentQuestionIndex >= 2 && !session?.session
                    ? "Sign up to Continue"
                    : "Next"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-center mt-8 text-sm text-gray-500">
        Sign up to access over 500+ questions and track your progress.
      </div>
    </main>
  );
};

export default PublicQuiz;
