import { errorResponse, successResponse } from "@/lib/api-response";
import { getSessionUser } from "@/lib/server-auth";
import { orderController } from "@/controllers/order.controller";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return errorResponse("Please login to view your orders", {}, 401);

    const data = await orderController.listMine(user.id, user.email);
    return successResponse("Orders fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Unable to fetch orders", {}, 500);
  }
}
