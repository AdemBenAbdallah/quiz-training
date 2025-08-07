import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe(
      "Two to six possible answers to the question. One or more should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .array(z.enum(["A", "B", "C", "D", "E", "F"]))
    .min(1)
    .describe(
      "The correct answers as an array, where A is the first option, B is the second, and so on.",
    ),
});

export type Question = z.infer<typeof questionSchema>;

export const questionNumber = 10;

export const questionsSchema = z.array(questionSchema).length(questionNumber);
