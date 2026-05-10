import { paymentService } from "@/services/payment.service";

export const paymentController = {
  createRazorpayOrder(orderId: string) {
    return paymentService.createRazorpayOrder(orderId);
  },

  verifyRazorpayPayment(payload: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return paymentService.verifyRazorpayPayment(payload);
  }
};
