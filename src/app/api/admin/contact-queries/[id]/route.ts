import { NextRequest } from "next/server";

import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await adminController.updateContactQuery(params.id, payload);
    return successResponse("Contact query updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update contact query", {}, 400);
  }
}