import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true)
});

export type CategoryInput = z.infer<typeof categorySchema>;
