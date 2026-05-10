import { NextRequest } from "next/server";

import { paymentController } from "@/controllers/payment.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await paymentController.createRazorpayOrder(payload.orderId);
    return successResponse("Razorpay order created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create Razorpay order", {}, 400);
  }
}
