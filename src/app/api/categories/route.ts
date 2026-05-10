import { categoryController } from "@/controllers/category.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const data = await categoryController.getCategories();
    return successResponse("Categories fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch categories", {}, 500);
  }
}
