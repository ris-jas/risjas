import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await adminController.listReviews();
    return successResponse("Reviews fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch reviews", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}