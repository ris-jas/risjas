import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { cartController } from "@/controllers/cart.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { CART_COOKIE_KEY } from "@/lib/constants";
import { getSessionUser } from "@/lib/server-auth";

function ensureSessionId() {
  const cookieStore = cookies();
  const value = cookieStore.get(CART_COOKIE_KEY)?.value;
  if (value) return value;
  const sessionId = crypto.randomUUID();
  cookieStore.set(CART_COOKIE_KEY, sessionId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return sessionId;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    const sessionId = ensureSessionId();
    const data = await cartController.getCart(sessionId, user?.id);
    return successResponse("Cart fetched", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to fetch cart", {}, 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const user = await getSessionUser();
    const sessionId = ensureSessionId();
    const data = await cartController.addItem(sessionId, payload, user?.id);
    return successResponse("Item added to cart", data);
  } catch (error: any) {
    return errorResponse(error.message || "Failed to add cart item", {}, 400);
  }
}
