import { NextRequest } from "next/server";

import { paymentController } from "@/controllers/payment.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await paymentController.verifyRazorpayPayment(payload);
    return successResponse("Payment verified", data);
  } catch (error: any) {
    return errorResponse(error.message || "Payment verification failed", {}, 400);
  }
}
