import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await adminController.listCoupons();
    return successResponse("Coupons fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch coupons", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await adminController.createCoupon(payload);
    return successResponse("Coupon created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create coupon", {}, 400);
  }
}