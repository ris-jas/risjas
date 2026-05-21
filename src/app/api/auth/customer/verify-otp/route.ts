import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response";
import { normalizeEmail, normalizePhone, parseAndVerifySession, verifyOtpCode } from "@/lib/customer-auth-otp";
import { prisma } from "@/lib/prisma";
import { verifyOtpSchema } from "@/lib/validations/customer-auth.schema";

export async function POST(request: NextRequest) {
  try {
    const payload = verifyOtpSchema.parse(await request.json());
    const email = normalizeEmail(payload.email);
    const sessionPayload = parseAndVerifySession(payload.otpSession);

    if (sessionPayload.email !== email || sessionPayload.purpose !== payload.purpose) {
      return errorResponse("OTP session does not match request", {}, 400);
    }
    if (!verifyOtpCode(payload.code, sessionPayload.otpHash)) {
      return errorResponse("Invalid OTP", {}, 400);
    }

    if (payload.purpose === "SIGNUP") {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return errorResponse("Email already registered. Please login instead.", {}, 409);
      }

      const rawPhone = payload.phone || sessionPayload.phone;
      const rawName = payload.name || sessionPayload.name;
      if (!rawPhone || !rawName) {
        return errorResponse("Name and phone are required to complete signup", {}, 400);
      }

      const phone = normalizePhone(rawPhone);
      const name = rawName.trim();
      const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: randomPassword,
          role: UserRole.CUSTOMER
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true
        }
      });

      return successResponse("Email verified. Signup complete.", { user, isNewUser: true });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        role: true
      }
    });

    if (!user || !user.isActive || user.role !== UserRole.CUSTOMER) {
      return errorResponse("Account not found. Please sign up first.", {}, 404);
    }

    return successResponse("Email verified. Login complete.", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      isNewUser: false
    });
  } catch (error: any) {
    return errorResponse(error.message || "Failed to verify OTP", {}, 400);
  }
}
