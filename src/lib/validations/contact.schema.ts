import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().regex(/^\+?[0-9 ()-]{10,20}$/),
  message: z.string().trim().min(10).max(5000)
}).strict();

export const contactUpdateSchema = z.object({
  isResolved: z.boolean()
}).strict();
