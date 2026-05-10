import { NextRequest } from "next/server";

import { productController } from "@/controllers/product.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { requireAdmin } from "@/lib/server-auth";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const data = await productController.getAdminProductById(params.id);
    return successResponse("Product fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Product not found", {}, 404);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const payload = await request.json();
    const data = await productController.updateProduct(params.id, payload);
    return successResponse("Product updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update product", {}, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    await productController.deleteProduct(params.id);
    return successResponse("Product deleted", {});
  } catch (error: any) {
    return errorResponse(error.message || "Failed to delete product", {}, 400);
  }
}