import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await orderController.updatePaymentStatus(params.id, payload.paymentStatus);
    return successResponse("Payment status updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update payment status", {}, 400);
  }
}