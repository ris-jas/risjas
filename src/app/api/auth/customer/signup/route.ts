import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { normalizeEmail, normalizePhone, parseAndVerifySession, verifyOtpCode } from "@/lib/customer-auth-otp";
import { prisma } from "@/lib/prisma";
import { customerSignupWithOtpSchema } from "@/lib/validations/customer-credentials.schema";

export async function POST(request: NextRequest) {
  try {
    const payload = customerSignupWithOtpSchema.parse(await request.json());
    const email = normalizeEmail(payload.email);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return errorResponse("Email already registered. Please login.", {}, 409);
    }

    const sessionPayload = parseAndVerifySession(payload.otpSession);
    if (sessionPayload.purpose !== "SIGNUP" || sessionPayload.email !== email) {
      return errorResponse("OTP session does not match this email", {}, 400);
    }

    if (!verifyOtpCode(payload.otpCode, sessionPayload.otpHash)) {
      return errorResponse("Invalid OTP", {}, 400);
    }

    const user = await prisma.user.create({
      data: {
        name: payload.name.trim(),
        phone: normalizePhone(payload.phone),
        email,
        password: await bcrypt.hash(payload.password, 10),
        role: UserRole.CUSTOMER,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });

    return successResponse("Account created successfully", { user });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create account", {}, 400);
  }
}
