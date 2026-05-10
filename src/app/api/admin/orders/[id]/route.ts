import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const data = await orderController.getAdminOrder(params.id);
    if (!data) return errorResponse("Order not found", {}, 404);
    return successResponse("Order fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch order", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}