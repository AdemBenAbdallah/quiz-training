import BackButton from "@/components/BackButton";
import { db } from "@/lib/db";
import { quizzes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";

export default async function HistoryPage() {
  const allQuizzes = await db.query.quizzes.findMany({
    orderBy: [desc(quizzes.createdAt)],
    with: {
      questions: {
        with: {
          options: true
        }
      }
    }
  });

  return (
    <div className="container mx-auto p-4">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Quiz History</h1>
        <BackButton href="/" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allQuizzes.map((quiz) => (
          <Link key={quiz.id} href={`/history/quiz/${quiz.id}`}>
            <div className="block p-4 border rounded-lg hover:bg-gray-100">
              <h2 className="text-xl font-semibold">Quiz #{quiz.id}</h2>
              <p className="text-sm text-gray-500">
                {quiz.createdAt && new Date(quiz.createdAt).toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
