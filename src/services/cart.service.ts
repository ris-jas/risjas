import { cartRepository } from "@/repositories/cart.repository";
import { SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";

function cartTotals(items: any[]) {
  const subtotal = items.reduce((acc, item) => acc + Number(item.product.price) * item.quantity, 0);
  const mrpTotal = items.reduce((acc, item) => acc + Number(item.product.mrp) * item.quantity, 0);
  const deliveryCharge = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_CHARGE;
  return {
    subtotal,
    mrpTotal,
    discount: Math.max(0, mrpTotal - subtotal),
    deliveryCharge,
    total: subtotal + deliveryCharge
  };
}

export const cartService = {
  async getCart(sessionId: string, userId?: string) {
    const cart = await cartRepository.getOrCreateCart(sessionId, userId);
    return {
      ...cart,
      summary: cartTotals(cart.items)
    };
  },

  async addToCart(sessionId: string, productId: string, quantity: number, userId?: string) {
    const cart = await cartRepository.getOrCreateCart(sessionId, userId);
    await cartRepository.addItem(cart.id, productId, quantity);
    const latest = await cartRepository.getCartBySession(sessionId);
    return {
      ...latest,
      summary: cartTotals(latest?.items || [])
    };
  },

  async updateCartItem(sessionId: string, itemId: string, quantity: number) {
    await cartRepository.updateItem(itemId, quantity);
    const cart = await cartRepository.getCartBySession(sessionId);
    return {
      ...cart,
      summary: cartTotals(cart?.items || [])
    };
  },

  async removeCartItem(sessionId: string, itemId: string) {
    await cartRepository.removeItem(itemId);
    const cart = await cartRepository.getCartBySession(sessionId);
    return {
      ...cart,
      summary: cartTotals(cart?.items || [])
    };
  },

  clearCart(cartId: string) {
    return cartRepository.clearCart(cartId);
  }
};
