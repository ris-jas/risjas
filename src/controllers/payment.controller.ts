import { paymentService } from "@/services/payment.service";

export const paymentController = {
  createRazorpayOrder(orderId: string, userId: string) {
    return paymentService.createRazorpayOrder(orderId, userId);
  },

  verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }, userId: string) {
    return paymentService.verifyRazorpayPayment(payload, userId);
  }
};
