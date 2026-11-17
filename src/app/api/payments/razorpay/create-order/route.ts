import { NextRequest } from "next/server";

import { paymentController } from "@/controllers/payment.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSessionUser } from "@/lib/server-auth";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("payment", clientIp(request.headers));
    if (!limit.success) return rateLimitResponse(limit);
    const user = await getSessionUser();
    if (!user) return errorResponse("Unauthorized", {}, 401);
    const payload = z.object({ orderId: z.string().trim().min(3).max(100) }).strict().parse(await request.json());
    const data = await paymentController.createRazorpayOrder(payload.orderId, user.id);
    return successResponse("Razorpay order created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create Razorpay order", {}, 400);
  }
}
