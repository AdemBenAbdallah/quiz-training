import Quiz from "@/components/quiz";
import { quizLevels } from "@/quiz";

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

const cleanChoice = (choice: string) =>
  choice
    .replace(/^([A-E]\.\s)/, "")
    .replace(/\.?(Most Voted|Most\sVoted)$/, "")
    .trim();

const QUESTIONS_PER_PART = 10;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: number; levelId: number }>;
}) {
  const { id, levelId } = await params;
  const level = levelId || 1;
  const part = id || 1;
  const startIdx = (part - 1) * QUESTIONS_PER_PART;
  const data = quizLevels[level - 1];
  const endIdx = Math.min(part * QUESTIONS_PER_PART, data.length);

  const quizQuestions = data.slice(startIdx, endIdx).map((q: any) => {
    const rawChoices = q.choices;
    if (rawChoices.length > 5) {
      console.warn(
        `Quiz question has ${rawChoices.length} choices; trimming to 5`,
      );
    }
    const limited = rawChoices.slice(0, 5);
    return {
      questionNumber: extractQuestionNumber(q.question_number),
      question: q.question,
      options: limited.map(cleanChoice),
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
