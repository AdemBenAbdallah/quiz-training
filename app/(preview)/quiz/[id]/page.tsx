import Quiz from "@/components/quiz";
import data from "@/data.json";

const extractQuestionNumber = (questionNumberStr: string): string => {
  const match = questionNumberStr.match(/Question #:\s*(\d+)/);
  return match ? `Question: ${match[1]}` : "";
};

const cleanChoice = (choice: string) =>
  choice
    .replace(/^([A-D]\.\s)/, "")
    .replace(/\.?(Most Voted|Most\sVoted)$/, "")
    .trim();

const QUESTIONS_PER_PART = 10;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const part = id || 1;
  const startIdx = (part - 1) * QUESTIONS_PER_PART;
  const endIdx = Math.min(part * QUESTIONS_PER_PART, data.length);

  const quizQuestions = data.slice(startIdx, endIdx).map((q: any) => ({
    questionNumber: extractQuestionNumber(q.question_number),
    question: q.question,
    options: q.choices.map(cleanChoice),
    answer: q.answers,
    answerComments: q.answers,
    multipleAnswers: q.answers.length > 1,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Quiz idx={part} title={`Quiz Part ${part}`} questions={quizQuestions} />
    </div>
  );
}
