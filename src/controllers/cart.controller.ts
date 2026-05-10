import { cartService } from "@/services/cart.service";

export const cartController = {
  getCart(sessionId: string, userId?: string) {
    return cartService.getCart(sessionId, userId);
  },

  addItem(sessionId: string, payload: { productId: string; quantity: number }, userId?: string) {
    return cartService.addToCart(sessionId, payload.productId, payload.quantity || 1, userId);
  },

  updateItem(sessionId: string, itemId: string, quantity: number) {
    return cartService.updateCartItem(sessionId, itemId, quantity);
  },

  removeItem(sessionId: string, itemId: string) {
    return cartService.removeCartItem(sessionId, itemId);
  }
};
