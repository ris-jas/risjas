import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { orderController } from "@/controllers/order.controller";
import { errorResponse, successResponse } from "@/lib/api-response";
import { CART_COOKIE_KEY } from "@/lib/constants";
import { getSessionUser } from "@/lib/server-auth";

function sessionIdFromCookie() {
  const cookieStore = cookies();
  let sessionId = cookieStore.get(CART_COOKIE_KEY)?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(CART_COOKIE_KEY, sessionId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  }
  return sessionId;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const user = await getSessionUser();
    const data = await orderController.checkout(sessionIdFromCookie(), payload, user?.id);
    return successResponse("Order placed successfully", data);
  } catch (error: any) {
    return errorResponse(error.message || "Checkout failed", {}, 400);
  }
}
