import { db } from "@/lib/db";
import { questions, quizzes } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET(req: Request) {
  const allQuizzes = await db
    .select({
      id: quizzes.id,
      name: quizzes.name,
      createdAt: quizzes.createdAt,
      questionCount: count(questions.id)
    })
    .from(quizzes)
    .leftJoin(questions, eq(quizzes.id, questions.quizId))
    .groupBy(quizzes.id);

  return new Response(JSON.stringify(allQuizzes), {
    headers: { "Content-Type": "application/json" }
  });
}
