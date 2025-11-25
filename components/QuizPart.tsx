"use client";

import { QuizParts } from "@/app/(preview)/parts";
import Quiz from "@/components/quiz";
import { cleanOptions } from "@/lib/explain-utils";
import { quizLevels } from "@/public/quiz";

interface QuizPartProps {
  levelId: number;
  partId: number;
}

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

export default function QuizPart({ levelId, partId }: QuizPartProps) {
  const level = levelId || 1;
  const part = partId || 1;

  const data = quizLevels[level - 1];
  const { QUESTIONS_PER_PART, data: quizParts } = QuizParts(level);

  const startIdx = quizParts[part - 1]?.start || 0;
  const endIdx = quizParts[part - 1]?.end || 0;

  const quizQuestions = data.slice(startIdx, endIdx).map((q: any) => {
    const rawChoices = q.choices;
    const limited = rawChoices.slice(0, 5);
    return {
      questionNumber: extractQuestionNumber(q.question_number),
      question: q.question,
      options: cleanOptions(limited),
      answer: q.answers,
      answerComments: q.answers,
      multipleAnswers: q.answers.length > 1,
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <Quiz
        idx={part}
        levelId={levelId}
        title={`Quiz Part ${part}`}
        questions={quizQuestions}
      />
    </div>
  );
}
