import { OrderStatus, PaymentStatus } from "@prisma/client";
import { ZodError } from "zod";

import { checkoutSchema, trackOrderSchema } from "@/lib/validations/order.schema";
import { orderService } from "@/services/order.service";

export const orderController = {
  async checkout(sessionId: string, payload: any, userId?: string) {
    try {
      const data = checkoutSchema.parse(payload);
      return await orderService.checkout(sessionId, data, userId);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  async track(payload: any) {
    try {
      const data = trackOrderSchema.parse(payload);
      return await orderService.trackOrder(data.orderId, data.phone);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  listAdmin(query?: { search?: string; status?: string }) {
    return orderService.listAdmin({
      search: query?.search,
      status: query?.status as OrderStatus | undefined
    });
  },

  getAdminOrder(id: string) {
    return orderService.detail(id);
  },

  updateStatus(id: string, status: string) {
    return orderService.updateStatus(id, status as OrderStatus);
  },

  updatePaymentStatus(id: string, paymentStatus: string) {
    return orderService.updatePaymentStatus(id, paymentStatus as PaymentStatus);
  }
};
