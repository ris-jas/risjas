import { NextRequest } from "next/server";

import { categoryController } from "@/controllers/category.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await categoryController.updateCategory(params.id, payload);
    return successResponse("Category updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update category", {}, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await categoryController.deleteCategory(params.id);
    return successResponse("Category deleted", {});
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete category", {}, 400);
  }
}