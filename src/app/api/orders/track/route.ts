import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await orderController.track(payload);
    if (!data) return errorResponse("Order not found", {}, 404);
    return successResponse("Order fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Unable to track order", {}, 400);
  }
}
