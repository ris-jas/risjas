import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  addressLine: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4).max(10),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(3),
  phone: z.string().min(10).max(15)
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;