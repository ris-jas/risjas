import crypto from "crypto";

import { OrderStatus, PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getRazorpayClient } from "@/lib/razorpay";
import { orderRepository } from "@/repositories/order.repository";

export const paymentService = {
  async createRazorpayOrder(orderId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    const razorpay = getRazorpayClient();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order.id
      }
    });

    await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        razorpayOrderId: razorpayOrder.id
      }
    });

    return razorpayOrder;
  },

  async verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const existingOrder = await prisma.order.findUnique({
      where: { id: payload.orderId },
      select: { id: true, paymentStatus: true, status: true }
    });
    if (!existingOrder) {
      throw new Error("Order not found");
    }

    if (existingOrder.paymentStatus === PaymentStatus.PAID) {
      return { verified: true, alreadyPaid: true };
    }

    const generated = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${payload.razorpayOrderId}|${payload.razorpayPaymentId}`)
      .digest("hex");

    if (generated !== payload.razorpaySignature) {
      await prisma.order.update({
        where: { id: payload.orderId },
        data: { paymentStatus: PaymentStatus.FAILED }
      });

      await prisma.payment.update({
        where: { orderId: payload.orderId },
        data: {
          status: PaymentStatus.FAILED,
          razorpayOrderId: payload.razorpayOrderId,
          razorpayPaymentId: payload.razorpayPaymentId,
          razorpaySignature: payload.razorpaySignature
        }
      });

      throw new Error("Payment signature verification failed");
    }

    await orderRepository.reserveStockForOrder(payload.orderId);

    await prisma.order.update({
      where: { id: payload.orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.CONFIRMED
      }
    });

    await prisma.payment.update({
      where: { orderId: payload.orderId },
      data: {
        status: PaymentStatus.PAID,
        razorpayOrderId: payload.razorpayOrderId,
        razorpayPaymentId: payload.razorpayPaymentId,
        razorpaySignature: payload.razorpaySignature,
        paidAt: new Date()
      }
    });

    return { verified: true };
  }
};
