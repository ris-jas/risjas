import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  addressLine: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State name is too short"),
  pincode: z.string().min(4, "Pincode is too short").max(10, "Pincode is too long"),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  couponCode: z.string().optional(),
  notes: z.string().optional()
});

export const trackOrderSchema = z.object({
  orderId: z.string().min(3),
  phone: z.string().min(10).max(15)
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;