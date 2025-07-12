import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const explainSchema = z.object({
  explanation: z.string(),
  choices: z.array(
    z.object({
      label: z.string(),
      text: z.string(),
      explanation: z.string()
    })
  ),
  correctAnswer: z.string(),
  correctExplanation: z.string(),
  trick: z.string()
});

function stripCodeBlock(text: string): string {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, options, answer } = body;
    if (!question || !options || !answer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const answerLabels = ["A", "B", "C", "D"];
    const prompt = `You are a helpful assistant for beginners. Given the following multiple-choice question, explain the question, each choice, and why the correct answer is correct in a beginner-friendly way. Also, provide a short actionable trick or tip for answering this type of question in the future.\n\nQuestion: ${question}\nChoices:\n${(
      options as string[]
    )
      .map((opt: string, i: number) => `${answerLabels[i]}. ${opt}`)
      .join(
        "\n"
      )}\nCorrect Answer: ${answer}\n\nRespond in this JSON format:\n{ explanation: string, choices: Array<{ label: string, text: string, explanation: string }>, correctAnswer: string, correctExplanation: string, trick: string }`;
    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      prompt
    });

    const cleanText = stripCodeBlock(result.text);
    const parsed = JSON.parse(cleanText);

    const validated = explainSchema.safeParse(parsed);
    if (!validated.success) {
      return NextResponse.json(
        { error: "AI response did not match expected format" },
        { status: 500 }
      );
    }
    return NextResponse.json(parsed);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
