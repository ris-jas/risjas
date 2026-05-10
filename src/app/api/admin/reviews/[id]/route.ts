import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await adminController.updateReview(params.id, payload);
    return successResponse("Review updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update review", {}, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await adminController.deleteReview(params.id);
    return successResponse("Review deleted", {});
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete review", {}, 400);
  }
}