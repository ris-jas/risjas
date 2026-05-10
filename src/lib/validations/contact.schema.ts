import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(10).max(15),
  message: z.string().min(10)
});
