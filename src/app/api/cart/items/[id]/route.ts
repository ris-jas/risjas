import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { cartController } from "@/controllers/cart.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { CART_COOKIE_KEY } from "@/lib/constants";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get(CART_COOKIE_KEY)?.value;
    if (!sessionId) return errorResponse("Cart not found", {}, 404);

    const payload = await request.json();
    const data = await cartController.updateItem(sessionId, params.id, Number(payload.quantity));
    return successResponse("Cart item updated", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to update cart", {}, 400);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = cookies().get(CART_COOKIE_KEY)?.value;
    if (!sessionId) return errorResponse("Cart not found", {}, 404);

    const data = await cartController.removeItem(sessionId, params.id);
    return successResponse("Cart item removed", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to remove cart item", {}, 400);
  }
}