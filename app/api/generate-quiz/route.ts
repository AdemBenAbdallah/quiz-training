import { db } from "@/lib/db";
import { options, questions, quizzes } from "@/lib/db/schema";
import { questionNumber, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files, name, quizId } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: `You are a teacher. Your job is to take a document, and create a multiple choice test (with ${questionNumber} questions) based on the content of the document. Each option should be roughly equal in length.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionsSchema,
    onFinish: async ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }

      let currentQuizId = quizId;

      if (!currentQuizId) {
        const [newQuiz] = await db.insert(quizzes).values({ name }).returning();
        currentQuizId = newQuiz.id;
      }

      for (const question of res.data) {
        const [newQuestion] = await db
          .insert(questions)
          .values({
            quizId: currentQuizId,
            question: question.question,
            answer: question.answer,
          })
          .returning();

        for (const option of question.options) {
          await db.insert(options).values({
            questionId: newQuestion.id,
            option,
          });
        }
      }
    },
  });

  return result.toTextStreamResponse();
}
