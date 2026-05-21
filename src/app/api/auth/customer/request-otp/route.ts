import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { createOtpSession, dispatchOtpEmail, generateOtp, getOtpTtlMinutes, normalizeEmail, normalizePhone } from "@/lib/customer-auth-otp";
import { prisma } from "@/lib/prisma";
import { requestOtpSchema } from "@/lib/validations/customer-auth.schema";

export async function POST(request: NextRequest) {
  try {
    const payload = requestOtpSchema.parse(await request.json());
    const email = normalizeEmail(payload.email);
    const phone = payload.phone ? normalizePhone(payload.phone) : undefined;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (payload.purpose === "SIGNUP" && existing) {
      return errorResponse("Email already registered. Please login instead.", {}, 409);
    }
    if (payload.purpose === "LOGIN" && (!existing || !existing.isActive || existing.role !== UserRole.CUSTOMER)) {
      return errorResponse("Account not found. Please sign up first.", {}, 404);
    }

    const code = generateOtp();
    const otpSession = createOtpSession({
      email,
      purpose: payload.purpose,
      code,
      name: payload.name?.trim(),
      phone
    });

    await dispatchOtpEmail({ email, code, purpose: payload.purpose });

    return successResponse("OTP sent to your email", {
      otpSession,
      expiresInMinutes: getOtpTtlMinutes(),
      ...(process.env.NODE_ENV !== "production" ? { devOtp: code } : {})
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to send OTP", {}, 400);
  }
}
