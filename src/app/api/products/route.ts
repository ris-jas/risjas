import { NextRequest } from "next/server";

import { productController } from "@/controllers/product.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const filters = {
      search: url.searchParams.get("search") || undefined,
      category: url.searchParams.get("category") || undefined,
      minPrice: url.searchParams.get("minPrice") || undefined,
      maxPrice: url.searchParams.get("maxPrice") || undefined,
      sort: url.searchParams.get("sort") || undefined,
      featured: url.searchParams.get("featured") || undefined,
      bestSeller: url.searchParams.get("bestSeller") || undefined
    };

    const data = await productController.getProducts(filters);
    return successResponse("Products fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch products", {}, 500);
  }
}
