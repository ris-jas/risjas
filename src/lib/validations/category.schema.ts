import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true)
}).strict();

export type CategoryInput = z.infer<typeof categorySchema>;
