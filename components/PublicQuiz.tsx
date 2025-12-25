"use client";

import PublicChatAssistant from "@/components/PublicChatAssistant";
import QuestionCard from "@/components/QuestionCard";
import QuestionExplainDialog from "@/components/QuestionExplainDialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import rawQuestions from "@/public/quiz/dvac02/level1.json";
import { Choice, Question } from "@/types/quiz";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
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
  handleStart: () => void;
};

const PublicQuiz = ({ handleStart }: PublicQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Choice[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isExplainDialogOpen, setIsExplainDialogOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [chatUsageCount, setChatUsageCount] = useState(0);
  const [showChatLimitNotification, setShowChatLimitNotification] =
    useState(false);
  const { session } = useUser();
  const quizContainerRef = useRef<HTMLDivElement>(null);

  // Security: Rate limiting for public chat (max 3 messages per session)
  const canUseChat = chatUsageCount < 3;

  const handleChatOpen = () => {
    if (canUseChat) {
      setIsChatDialogOpen(true);
      setChatUsageCount((prev) => prev + 1);
    } else {
      setShowChatLimitNotification(true);
      setTimeout(() => setShowChatLimitNotification(false), 5000);
    }
  };

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
    if (currentQuestionIndex >= 2) {
      handleStart();
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Practice Quiz</h1>
          <p className="text-muted-foreground">
            Try out a few questions to see how it works.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={() => setIsExplainDialogOpen(true)}
            title="Get explanation for this question"
            className="animate-border rounded-xl"
          >
            <HelpCircle className="h-5 w-5 text-white" />
          </Button>
          <Button
            size="icon"
            onClick={handleChatOpen}
            disabled={!canUseChat}
            title={
              canUseChat
                ? "Chat with AI assistant"
                : "Sign up for unlimited chat access"
            }
            className="animate-border rounded-xl"
          >
            <MessageCircle className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>

      <Progress value={progress} className="h-1 mb-8" />

      <div className="min-h-[400px]">
        <Suspense fallback={<div>Loading...</div>}>
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
                <QuestionExplainDialog
                  question={currentQuestion}
                  open={isExplainDialogOpen}
                  onOpenChange={setIsExplainDialogOpen}
                />

                <PublicChatAssistant
                  question={currentQuestion}
                  selectedAnswers={selectedAnswers}
                  open={isChatDialogOpen}
                  onOpenChange={setIsChatDialogOpen}
                />

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
        </Suspense>
      </div>
      {showChatLimitNotification && (
        <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="h-4 w-4 text-yellow-600" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-yellow-800">
              Chat limit reached
            </div>
            <div className="text-sm text-yellow-700">
              Sign up to unlock unlimited AI assistance and track your progress!
            </div>
          </div>
          <Button
            onClick={handleStart}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Sign up
          </Button>
        </div>
      )}
      <div className="text-center mt-8 text-sm text-gray-500">
        Sign up to access over 500+ questions and track your progress.
      </div>
    </main>
  );
};

export default PublicQuiz;
