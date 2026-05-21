import { z } from "zod";

export const customerOtpPurposeSchema = z.enum(["LOGIN", "SIGNUP"]);

export const requestOtpSchema = z
  .object({
    purpose: customerOtpPurposeSchema,
    email: z.string().email(),
    name: z.string().trim().min(2).optional(),
    phone: z.string().trim().min(10).max(15).optional()
  })
  .superRefine((value, ctx) => {
    if (value.purpose === "SIGNUP") {
      if (!value.name) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["name"], message: "Name is required for signup" });
      }
      if (!value.phone) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "Phone is required for signup" });
      }
    }
  });

export const verifyOtpSchema = z.object({
  purpose: customerOtpPurposeSchema,
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
  otpSession: z.string().min(10),
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().min(10).max(15).optional()
});
