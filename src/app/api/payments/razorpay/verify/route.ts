import { NextRequest } from "next/server";

import { paymentController } from "@/controllers/payment.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { getSessionUser } from "@/lib/server-auth";
import { razorpayVerificationSchema } from "@/lib/validations/order.schema";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("payment", clientIp(request.headers));
    if (!limit.success) return rateLimitResponse(limit);
    const user = await getSessionUser();
    if (!user) return errorResponse("Unauthorized", {}, 401);
    const payload = razorpayVerificationSchema.parse(await request.json());
    const data = await paymentController.verifyRazorpayPayment(payload, user.id);
    return successResponse("Payment verified", data);
  } catch (error: any) {
    return errorResponse(error.message || "Payment verification failed", {}, 400);
  }
}
