import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

import { cartService } from "@/services/cart.service";
import { couponService } from "@/services/coupon.service";
import { orderRepository } from "@/repositories/order.repository";
import { generateOrderNumber } from "@/lib/utils";

export const orderService = {
  async checkout(sessionId: string, payload: any, userId?: string) {
    const cart = await cartService.getCart(sessionId, userId);

    if (!cart?.items?.length) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      if (!item.product.isActive) throw new Error(`${item.product.name} is unavailable`);
      if (item.quantity > item.product.stock) throw new Error(`${item.product.name} is out of stock`);
    }

    let couponId: string | undefined;
    let couponDiscount = 0;

    if (payload.couponCode) {
      const { coupon, discount } = await couponService.validate(payload.couponCode, cart.summary.subtotal);
      couponId = coupon.id;
      couponDiscount = discount;
    }

    const finalTotal = Math.max(0, cart.summary.total - couponDiscount);
    const orderNumber = generateOrderNumber();

    const order = await orderRepository.create({
      orderNumber,
      customerName: payload.customerName,
      phone: payload.phone,
      email: payload.email || null,
      addressLine: payload.addressLine,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
      status: payload.paymentMethod === PaymentMethod.COD ? OrderStatus.PENDING : OrderStatus.PENDING,
      paymentMethod: payload.paymentMethod,
      paymentStatus: PaymentStatus.PENDING,
      subtotal: cart.summary.subtotal,
      shippingCharge: cart.summary.deliveryCharge,
      discount: couponDiscount,
      total: finalTotal,
      user: userId ? { connect: { id: userId } } : undefined,
      coupon: couponId ? { connect: { id: couponId } } : undefined,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productSku: item.product.sku,
          price: item.product.price,
          quantity: item.quantity,
          total: Number(item.product.price) * item.quantity
        }))
      },
      payment: {
        create: {
          provider: payload.paymentMethod === PaymentMethod.COD ? "COD" : "RAZORPAY",
          method: payload.paymentMethod,
          status: PaymentStatus.PENDING,
          amount: finalTotal
        }
      }
    });

    if (payload.paymentMethod === PaymentMethod.COD) {
      await orderRepository.reserveStockForOrder(order.id);
    }

    await cartService.clearCart(cart.id);

    return order;
  },

  trackOrder(orderNumber: string, phone: string) {
    return orderRepository.findByOrderNumber(orderNumber, phone);
  },

  listAdmin(query?: { search?: string; status?: OrderStatus }) {
    return orderRepository.listAdmin(query);
  },

  detail(id: string) {
    return orderRepository.findById(id);
  },

  updateStatus(id: string, status: OrderStatus) {
    return orderRepository.updateStatus(id, status);
  },

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return orderRepository.updatePaymentStatus(id, paymentStatus);
  },

  stats() {
    return orderRepository.stats();
  }
};
