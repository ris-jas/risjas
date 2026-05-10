import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await adminController.dashboard();
    return successResponse("Dashboard fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Unauthorized", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}