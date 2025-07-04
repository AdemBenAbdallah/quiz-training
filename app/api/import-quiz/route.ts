import { db } from "@/lib/db";
import { options, questions, quizzes } from "@/lib/db/schema";
import { questionNumber, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const quizIdRaw = formData.get("quizId");
  const quizId = quizIdRaw ? Number(quizIdRaw) : null;

  if (!file) {
    return new NextResponse("No file uploaded", { status: 400 });
  }

  const content = await file.text();

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content: `You are a teacher. Your job is to take a document, and create a multiple choice test (with ${questionNumber} questions) based on the content of the document. Each option should be roughly equal in length.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test based on this document."
          },
          {
            type: "text",
            text: content
          }
        ]
      }
    ],
    schema: questionsSchema,
    onFinish: async ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }

      let targetQuizId = quizId;
      if (!targetQuizId) {
        // fallback: create a new quiz if quizId not provided
        const [newQuiz] = await db
          .insert(quizzes)
          .values({ name: file.name.replace(/\.[^/.]+$/, "") })
          .returning();
        targetQuizId = newQuiz.id;
      }

      for (const question of res.data) {
        const [newQuestion] = await db
          .insert(questions)
          .values({
            quizId: targetQuizId,
            question: question.question,
            answer: question.answer
          })
          .returning();

        for (const option of question.options) {
          await db.insert(options).values({
            questionId: newQuestion.id,
            option
          });
        }
      }
    }
  });

  return result.toTextStreamResponse();
}
