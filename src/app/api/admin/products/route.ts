import { NextRequest } from "next/server";

import { productController } from "@/controllers/product.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET() {
  try {
    await requireAdmin();
    const data = await productController.getAdminProducts();
    return successResponse("Products fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Unauthorized", {}, error.message === "Unauthorized" ? 401 : 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await productController.createProduct(payload);
    return successResponse("Product created", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to create product", {}, 400);
  }
}