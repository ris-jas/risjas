import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { clientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const limit = await rateLimit("contact", clientIp(request.headers));
    if (!limit.success) return rateLimitResponse(limit);
    const payload = await request.json();
    const data = await adminController.createContactQuery(payload);
    return successResponse("Query submitted successfully", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to submit query", {}, 400);
  }
}
