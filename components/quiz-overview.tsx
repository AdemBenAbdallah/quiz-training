import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "@/lib/schemas";
import { Choice } from "./quiz";

interface QuizReviewProps {
  questions: Question[];
  userAnswers: Choice[][];
}

export default function QuizReview({
  questions,
  userAnswers,
}: QuizReviewProps) {
  const answerLabels: Choice[] = ["A", "B", "C", "D", "E"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Quiz Review</CardTitle>
      </CardHeader>
      <CardContent>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-8 last:mb-0">
            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => {
                const currentLabel = answerLabels[optionIndex];
                const isCorrect = question.answer.includes(currentLabel);
                const isSelected =
                  userAnswers[questionIndex]?.includes(currentLabel);
                const isIncorrectSelection = isSelected && !isCorrect;

                return (
                  <div
                    key={optionIndex}
                    className={`flex items-center p-4 rounded-lg ${
                      isCorrect
                        ? "bg-green-100 dark:bg-green-700/50"
                        : isIncorrectSelection
                          ? "bg-red-100 dark:bg-red-700/50"
                          : "border border-border"
                    }`}
                  >
                    <span className="text-lg font-medium mr-4 w-6">
                      {currentLabel}
                    </span>
                    <span className="flex-grow">{option}</span>
                    {isCorrect && (
                      <Check
                        className="ml-2 text-green-600 dark:text-green-400"
                        size={20}
                      />
                    )}
                    {isIncorrectSelection && (
                      <X
                        className="ml-2 text-red-600 dark:text-red-400"
                        size={20}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
