// app/api/service-info/schemas.ts
import { z } from "zod";

export const serviceInfoSchema = z.object({
  serviceName: z.string(),
  serviceDescription: z.string(),
  overallServiceSmallDescription: z.string(), // New field for overall service small description
  keyFeatures: z.array(z.string()),
  useCases: z.array(z.string()),
  optionsWithSmallDescriptions: z.array(
    // New field for options with small descriptions
    z.object({
      optionLabel: z.string(),
      optionText: z.string(),
      optionDescription: z.string(),
    }),
  ),
});

export type ServiceInfoSchema = z.infer<typeof serviceInfoSchema>;
