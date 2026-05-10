import { NextRequest } from "next/server";

import { categoryController } from "@/controllers/category.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await categoryController.getAdminCategories();
    return successResponse("Categories fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Unauthorized", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await categoryController.createCategory(payload);
    return successResponse("Category created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create category", {}, 400);
  }
}