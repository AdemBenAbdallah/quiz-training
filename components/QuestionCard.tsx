import { Choice, Question } from "@/types/quiz";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isChoiceDisabled } from "@/lib/selection";

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
      <h2 className="text-lg font-semibold leading-tight">
        {question.question}
      </h2>
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
            <Button
              key={index}
              disabled={isDisabled}
              variant={isSelected ? "secondary" : "outline"}
              className={`h-auto py-6 px-4 justify-start text-left whitespace-normal ${
                showCorrectAnswer &&
                question.answer.includes(availableOptions[index])
                  ? "bg-green-600 hover:bg-green-700"
                  : showCorrectAnswer &&
                      isSelected &&
                      !question.answer.includes(availableOptions[index])
                    ? "bg-red-600 hover:bg-red-700"
                    : isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : ""
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
