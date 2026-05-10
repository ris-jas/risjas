import { SHIPPING_CHARGE, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { cartRepository } from "@/repositories/cart.repository";
import { productRepository } from "@/repositories/product.repository";

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
    const product = await productRepository.findById(productId);

    if (!product || !product.isActive) {
      throw new Error("Product is unavailable");
    }

    const existingItem = cart.items.find((item) => item.productId === productId);
    const currentQty = Number(existingItem?.quantity || 0);
    const addQty = Math.max(1, Number(quantity || 1));
    const nextQty = currentQty + addQty;

    if (nextQty > Number(product.stock)) {
      throw new Error(`Only ${product.stock} units available in stock`);
    }

    await cartRepository.addItem(cart.id, productId, addQty);
    const latest = await cartRepository.getCartBySession(sessionId);
    return {
      ...latest,
      summary: cartTotals(latest?.items || [])
    };
  },

  async updateCartItem(sessionId: string, itemId: string, quantity: number) {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }

    const cart = await cartRepository.getCartBySession(sessionId);
    const targetItem = cart?.items.find((item) => item.id === itemId);
    if (!targetItem) {
      throw new Error("Cart item not found");
    }

    if (quantity > Number(targetItem.product.stock)) {
      throw new Error(`Only ${targetItem.product.stock} units available in stock`);
    }

    await cartRepository.updateItem(itemId, quantity);
    const latest = await cartRepository.getCartBySession(sessionId);
    return {
      ...latest,
      summary: cartTotals(latest?.items || [])
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
