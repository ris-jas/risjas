import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await adminController.validateCoupon(payload);
    return successResponse("Coupon valid", data);
  } catch (error: any) {
    return errorResponse(error.message || "Invalid coupon", {}, 400);
  }
}
