import { adminController } from "@/controllers/admin.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await adminController.listContactQueries();
    return successResponse("Contact queries fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch contact queries", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}