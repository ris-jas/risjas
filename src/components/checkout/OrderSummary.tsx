"use client";

import Image from "next/image";

export default function OrderSummary({ cart }: { cart: any }) {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-soft">
      <h3 className="text-2xl text-navy">Order Summary</h3>
      <div className="mt-5 space-y-4 border-b border-slate-100 pb-5">
        {cart.items?.map((item: any) => (
          <div key={item.id} className="grid grid-cols-[70px_1fr_auto] gap-3">
            <div className="relative h-[70px] overflow-hidden rounded-2xl bg-slate-50/80 p-1.5">
              <Image src={item.product.images?.[0]?.imageUrl || "/products/cute-panda.png"} alt={item.product.name} fill className="rounded-xl object-cover" />
            </div>
            <div>
              <p className="font-semibold text-navy">{item.product.name}</p>
              <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
            </div>
            <p className="text-lg font-semibold text-navy">Rs. {(Number(item.product.price) * item.quantity).toFixed(0)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-600">
        <div className="flex justify-between"><span>Subtotal</span><span>Rs. {cart.summary?.subtotal?.toFixed(0)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>Rs. {cart.summary?.deliveryCharge?.toFixed(0)}</span></div>
        <div className="flex justify-between"><span>Tax</span><span>Calculated at checkout</span></div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex justify-between text-2xl font-medium text-navy"><span>Total</span><span>Rs. {cart.summary?.total?.toFixed(0)}</span></div>
      </div>
    </div>
  );
}
