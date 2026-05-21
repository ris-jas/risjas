import { z } from "zod";

export const customerLoginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const baseSignupFields = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  phone: z.string().trim().min(10, "Mobile number must be at least 10 digits").max(15, "Mobile number is too long"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required")
});

const withPasswordMatch = <T extends z.ZodTypeAny>(schema: T) =>
  schema
  .superRefine((value, ctx) => {
    const data = value as { password: string; confirmPassword: string };
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match"
      });
    }
  });

export const customerSignupSchema = withPasswordMatch(baseSignupFields);

export const customerSignupWithOtpSchema = withPasswordMatch(baseSignupFields.extend({
  otpCode: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  otpSession: z.string().min(10, "Invalid OTP session")
}));
