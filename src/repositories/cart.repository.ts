import { prisma } from "@/lib/prisma";

export const cartRepository = {
  async getOrCreateCart(sessionId: string, userId?: string) {
    let cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          sessionId,
          userId
        },
        include: {
          items: {
            include: {
              product: {
                include: { images: true }
              }
            }
          }
        }
      });
    }

    return cart;
  },

  addItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        cartId,
        productId,
        quantity
      }
    });
  },

  updateItem(id: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id },
      data: { quantity }
    });
  },

  removeItem(id: string) {
    return prisma.cartItem.delete({ where: { id } });
  },

  getCartBySession(sessionId: string) {
    return prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true }
            }
          }
        }
      }
    });
  },

  clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
};
