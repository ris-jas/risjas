import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{10,20}$/, "Phone number is invalid"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  addressLine: z.string().trim().min(5, "Address must be at least 5 characters").max(500),
  city: z.string().trim().min(2, "City name is too short").max(100),
  state: z.string().trim().min(2, "State name is too short").max(100),
  pincode: z.string().trim().regex(/^[A-Za-z0-9 -]{4,10}$/, "Pincode is invalid"),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  couponCode: z.string().trim().max(50).optional(),
  notes: z.string().trim().max(1000).optional()
}).strict();

export const trackOrderSchema = z.object({
  orderId: z.string().trim().min(3).max(100),
  phone: z.string().trim().regex(/^\+?[0-9 ()-]{10,20}$/)
}).strict();

export const razorpayVerificationSchema = z.object({
  orderId: z.string().trim().min(3).max(100),
  razorpayOrderId: z.string().trim().min(1).max(100),
  razorpayPaymentId: z.string().trim().min(1).max(100),
  razorpaySignature: z.string().trim().regex(/^[a-f0-9]{64}$/i)
}).strict();

export type CheckoutInput = z.infer<typeof checkoutSchema>;
