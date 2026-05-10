import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { getSessionUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const user = await getSessionUser();
    const data = await adminController.createReview(payload, user?.id);
    return successResponse("Review submitted. Pending approval.", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to submit review", {}, 400);
  }
}
