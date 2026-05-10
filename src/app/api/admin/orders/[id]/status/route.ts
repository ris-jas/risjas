import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await orderController.updateStatus(params.id, payload.status);
    return successResponse("Order status updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update status", {}, 400);
  }
}