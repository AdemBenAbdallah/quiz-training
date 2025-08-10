// app/api/service-info/schemas.ts
import { z } from "zod";

export const serviceInfoSchema = z.object({
  serviceName: z.string(),
  serviceDescription: z.string(),
  keyFeatures: z.array(z.string()),
  useCases: z.array(z.string()),
  relatedServices: z.array(z.string()),
});

export type ServiceInfoSchema = z.infer<typeof serviceInfoSchema>;
