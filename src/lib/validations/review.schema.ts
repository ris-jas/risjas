import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5).max(3000)
}).strict();

export const reviewUpdateSchema = z.object({
  isApproved: z.boolean()
}).strict();
