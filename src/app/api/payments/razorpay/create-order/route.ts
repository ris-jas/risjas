import { NextRequest } from "next/server";

import { paymentController } from "@/controllers/payment.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("payment", clientIp(request.headers));
    if (!limit.success) return rateLimitResponse(limit);
    const payload = await request.json();
    const data = await paymentController.createRazorpayOrder(payload.orderId);
    return successResponse("Razorpay order created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create Razorpay order", {}, 400);
  }
}
