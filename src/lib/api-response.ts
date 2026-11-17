import { NextResponse } from "next/server";

const clientMessages = /^(Unauthorized|Please login|File is required|Order not found|Product not found|Cart not found|Email already registered|Account not found|Invalid OTP|OTP session|Invalid coupon|.*required|.*invalid|.*incorrect|.*do not match|.*not found)$/i;
const safeMessage = (message: string, status: number) => status === 401 ? "Unauthorized" : status === 404 ? "Resource not found" : status === 429 ? message : clientMessages.test(message) ? message : "Unable to process request";

export function successResponse(message: string, data: unknown = {}) {
  return NextResponse.json({ success: true, message, data });
}

export function errorResponse(message: string, errors: unknown = {}, status = 400) {
  if (status >= 500) console.error("[api-error]", message);
  return NextResponse.json({ success: false, message: safeMessage(message, status), errors: status >= 500 ? {} : errors }, { status });
}
