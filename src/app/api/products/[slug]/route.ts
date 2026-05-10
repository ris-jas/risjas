import { productController } from "@/controllers/product.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const data = await productController.getProductBySlug(params.slug);
    return successResponse("Product fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Product not found", {}, 404);
  }
}