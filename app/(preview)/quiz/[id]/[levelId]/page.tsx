import { QuizParts } from "@/app/(preview)/parts";
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

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: number; levelId: number }>;
}) {
  const { id, levelId } = await params;
  const level = levelId || 1;
  const part = id || 1;
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
      options: limited.map(cleanChoice),
      answer: q.answers,
      answerComments: q.answers,
      multipleAnswers: q.answers.length > 1,
    };
  });

  console.log(quizQuestions);
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
