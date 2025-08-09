// app/api/explain-question/schemas.ts
import { z } from "zod";

export const explainSchema = z.object({
  explanation: z.string(),
  choices: z.array(
    z.object({
      label: z.enum(["A", "B", "C", "D", "E"]),
      text: z.string(),
      explanation: z.string(),
    }),
  ),
  correctAnswer: z.string(),
  correctExplanation: z.string(),
  trick: z.string(),
});

export type ExplainSchema = z.infer<typeof explainSchema>;
