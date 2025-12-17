import { Button } from "@/components/ui/button";
import { isChoiceDisabled } from "@/lib/selection";
import { Choice, Question } from "@/types/quiz";
import { Check, X } from "lucide-react";

const QuestionCard: React.FC<{
  question: Question;
  selectedAnswers: Choice[];
  onSelectAnswer: (answer: Choice) => void;
  isSubmitted: boolean;
  showCorrectAnswer: boolean;
}> = ({ question, selectedAnswers, onSelectAnswer, showCorrectAnswer }) => {
  const answerLabels: Choice[] = ["A", "B", "C", "D", "E"];
  const availableOptions = answerLabels.slice(0, question.options.length);

  return (
    <div className="space-y-6">
      {question.questionNumber && (
        <div className="text-sm font-semibold text-muted-foreground mb-2">
          {question.questionNumber}
        </div>
      )}
      <div className="flex items-start gap-2 group">
        <h2 className="text-lg font-semibold leading-tight flex-grow">
          {question.question}
        </h2>
      </div>
      {question.answer.length > 1 && (
        <div
          className={`text-sm font-medium ${
            selectedAnswers.length === question.answer.length
              ? "text-green-600"
              : selectedAnswers.length > 0
                ? "text-blue-600"
                : "text-gray-600"
          }`}
        >
          Select {question.answer.length} answers ({selectedAnswers.length}/
          {question.answer.length} selected)
          {selectedAnswers.length === question.answer.length && (
            <span className="ml-2">✓ Complete</span>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswers.includes(availableOptions[index]);
          const isDisabled = isChoiceDisabled(
            selectedAnswers,
            availableOptions[index],
            question,
          );

          return (
            <div key={index} className="relative group">
              <Button
                disabled={isDisabled}
                variant={isSelected ? "default" : "outline"}
                className={`h-auto py-6 px-4 justify-start text-left whitespace-normal w-full transition-all duration-200 transform-none ${
                  showCorrectAnswer &&
                  question.answer.includes(availableOptions[index])
                    ? "bg-green-600 hover:bg-green-700"
                    : showCorrectAnswer &&
                        isSelected &&
                        !question.answer.includes(availableOptions[index])
                      ? "bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300"
                      : isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                          ? "bg-gray-700 hover:bg-gray-600 text-white border-gray-500"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                onClick={() => onSelectAnswer(availableOptions[index])}
              >
                <span className="text-lg font-medium mr-4 shrink-0">
                  {availableOptions[index]}
                </span>
                <span className="flex-grow">{option}</span>
                {(showCorrectAnswer &&
                  question.answer.includes(availableOptions[index])) ||
                  (isSelected && (
                    <Check className="ml-2 shrink-0 text-white" size={20} />
                  ))}
                {showCorrectAnswer &&
                  isSelected &&
                  !question.answer.includes(availableOptions[index]) && (
                    <X className="ml-2 shrink-0 text-white" size={20} />
                  )}
              </Button>
            </div>
          );
        })}
      </div>
      {showCorrectAnswer && question.answerComments && (
        <div className="mt-4 p-4 bg-muted rounded text-sm">
          <div className="font-semibold mb-2">Answer Comments:</div>
          <ul className="list-disc pl-5 space-y-2">
            {question.answerComments.map((comment, idx) => (
              <li key={idx}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
