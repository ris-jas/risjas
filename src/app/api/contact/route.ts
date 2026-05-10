import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const data = await adminController.createContactQuery(payload);
    return successResponse("Query submitted successfully", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to submit query", {}, 400);
  }
}
