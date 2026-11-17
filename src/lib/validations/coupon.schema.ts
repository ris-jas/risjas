import { DiscountType } from "@prisma/client";
import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().trim().min(3).max(50).transform((v) => v.toUpperCase()),
  discountType: z.nativeEnum(DiscountType),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().nonnegative().default(0),
  expiryDate: z.string().datetime(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true)
}).strict();

export const validateCouponSchema = z.object({
  code: z.string().min(3),
  amount: z.number().positive()
}).strict();

export type CouponInput = z.infer<typeof couponSchema>;
