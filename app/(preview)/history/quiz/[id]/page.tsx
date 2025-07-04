import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function QuizPage({ params }: { params: { id: string } }) {
  const quizId = parseInt(params.id, 10);
  const quiz = await db.query.quizzes.findFirst({
    where: (quizzes, { eq }) => eq(quizzes.id, quizId),
    with: {
      questions: {
        with: {
          options: true,
        },
      },
    },
  });

  if (!quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quiz #{quiz.id}</h1>
      <div className="space-y-4">
        {quiz.questions.map((question) => (
          <div key={question.id} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{question.question}</h2>
            <ul className="list-disc list-inside mt-2">
              {question.options.map((option) => (
                <li key={option.id}>{option.option}</li>
              ))}
            </ul>
            <p className="mt-2 font-bold">Answer: {question.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
