import Quiz from "@/components/quiz";
import data from "@/data.json";

const extractCorrectAnswer = (answersArr: string[]): "A" | "B" | "C" | "D" => {
  if (!answersArr || !answersArr.length) return "A";
  const match = answersArr[0].match(/Selected Answer: ([A-D])/);
  return (match ? match[1] : "A") as "A" | "B" | "C" | "D";
};

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
  params
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
    answer: extractCorrectAnswer(q.answers),
    answerComments: q.answers
  }));

  return (
    <div className="flex flex-col gap-4">
      <Quiz idx={part} title={`Quiz Part ${part}`} questions={quizQuestions} />
    </div>
  );
}
