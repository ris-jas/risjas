import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await adminController.updateBanner(params.id, payload);
    return successResponse("Banner updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update banner", {}, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await adminController.deleteBanner(params.id);
    return successResponse("Banner deleted", {});
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete banner", {}, 400);
  }
}