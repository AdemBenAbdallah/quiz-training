import Quiz from "@/components/quiz";
import { db } from "@/lib/db";
import { options, questions } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuizPage({ params }: PageProps) {
  const { id } = await params;
  const quizId = Number(id);
  const quiz = await db.query.quizzes.findFirst({
    where: (quiz, { eq }) => eq(quiz.id, quizId)
  });

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  const quizQuestionsRaw = await db
    .select()
    .from(questions)
    .where(eq(questions.quizId, quizId));

  // Fetch all options for these questions
  const questionIds = quizQuestionsRaw.map((q) => q.id);
  const allOptions = await db
    .select()
    .from(options)
    .where(inArray(options.questionId, questionIds));

  // Map options to their questions
  const quizQuestions = quizQuestionsRaw.map((q) => ({
    question: q.question,
    answer: q.answer as "A" | "B" | "C" | "D", // cast or validate as needed
    options: allOptions
      .filter((opt) => opt.questionId === q.id)
      .map((opt) => opt.option)
  }));

  return (
    <div className="flex flex-col gap-4">
      <Quiz title={quiz.name} questions={quizQuestions} />
    </div>
  );
}
