"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, AlertCircle } from "lucide-react";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations/order.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CheckoutForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "RAZORPAY",
      couponCode: ""
    }
  });

  const selectedPaymentMethod = watch("paymentMethod");

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const result = await response.json();

      if (response.status === 401) {
        setLoading(false);
        router.push("/profile?next=/checkout");
        return;
      }

      if (!result.success) {
        setError(result.message);
        setLoading(false);
        return;
      }

      const order = result.data;

      if (values.paymentMethod === "RAZORPAY") {
        if (typeof (window as any).Razorpay === "undefined") {
          setError("Payment gateway is still loading. Please wait a moment and try again.");
          setLoading(false);
          return;
        }

        const orderRes = await fetch("/api/payments/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id })
        });
        const orderResult = await orderRes.json();
        if (!orderResult.success) {
          setError(orderResult.message);
          setLoading(false);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderResult.data.amount,
          currency: orderResult.data.currency,
          name: "Risjas",
          description: `Order ${order.orderNumber}`,
          order_id: orderResult.data.id,
          handler: async function (paymentRes: any) {
            const verify = await fetch("/api/payments/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: order.id,
                razorpayOrderId: paymentRes.razorpay_order_id,
                razorpayPaymentId: paymentRes.razorpay_payment_id,
                razorpaySignature: paymentRes.razorpay_signature
              })
            });
            const verifyRes = await verify.json();
            if (verifyRes.success) {
              router.push(`/order-success?orderId=${order.orderNumber}`);
            } else {
              setError(verifyRes.message);
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
        return;
      }

      router.push(`/order-success?orderId=${order.orderNumber}`);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  });

  return (
    <form className="space-y-7 rounded-[32px] bg-white p-6 shadow-soft sm:p-8" onSubmit={onSubmit}>
      <section>
        <h2 className="text-2xl text-navy">Shipping Address</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Input placeholder="Full Name" {...register("customerName")} />
            {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
          </div>
          <div className="space-y-1">
            <Input placeholder="Phone Number" {...register("phone")} />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Input placeholder="Email (optional)" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Textarea placeholder="Address Line" {...register("addressLine")} />
            {errors.addressLine && <p className="text-xs text-red-500">{errors.addressLine.message}</p>}
          </div>
          <div className="space-y-1">
            <Input placeholder="City" {...register("city")} />
            {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
          </div>
          <div className="space-y-1">
            <Input placeholder="State" {...register("state")} />
            {errors.state && <p className="text-xs text-red-500">{errors.state.message}</p>}
          </div>
          <div className="space-y-1">
            <Input placeholder="Pincode" {...register("pincode")} />
            {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
          </div>
          <div className="space-y-1">
            <Input placeholder="Coupon Code (optional)" {...register("couponCode")} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-2xl text-navy">Payment Method</h3>
        <div className="mt-4 space-y-3">
          <label className={`block cursor-pointer rounded-2xl p-4 transition ${selectedPaymentMethod === "RAZORPAY" ? "bg-rose-soft shadow-[0_0_0_2px_rgba(232,183,200,0.7)]" : "bg-slate-50 hover:shadow-[0_0_0_2px_rgba(13,22,51,0.15)]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input type="radio" value="RAZORPAY" {...register("paymentMethod")} className="mt-1" />
                <div>
                  <p className="font-semibold text-navy">Razorpay Online Payment</p>
                  <p className="text-sm text-slate-500">Card, UPI, Netbanking</p>
                </div>
              </div>
              <CreditCard className="h-5 w-5 text-navy" />
            </div>
          </label>

          <label className={`block cursor-pointer rounded-2xl p-4 transition ${selectedPaymentMethod === "COD" ? "bg-rose-soft shadow-[0_0_0_2px_rgba(232,183,200,0.7)]" : "bg-slate-50 hover:shadow-[0_0_0_2_rgba(13,22,51,0.15)]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <input type="radio" value="COD" {...register("paymentMethod")} className="mt-1" />
                <div>
                  <p className="font-semibold text-navy">Cash on Delivery</p>
                  <p className="text-sm text-slate-500">Pay when order arrives</p>
                </div>
              </div>
              <Truck className="h-5 w-5 text-navy" />
            </div>
          </label>
        </div>
      </section>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <Button type="submit" className="h-12 w-full hover:shadow-[0_0_0_8px_rgba(232,183,200,0.35)]" disabled={loading}>
        {loading ? "Placing Order..." : "Place Order"}
      </Button>
      <p className="text-center text-xs text-slate-500">Secure checkout powered by Risjas</p>
    </form>
  );
}
