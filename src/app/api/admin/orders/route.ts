import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const search = request.nextUrl.searchParams.get("search") || undefined;
    const status = request.nextUrl.searchParams.get("status") || undefined;
    const data = await orderController.listAdmin({ search, status });
    return successResponse("Orders fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch orders", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}