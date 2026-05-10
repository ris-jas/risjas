import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function CartSummary({ summary }: { summary: any }) {
  return (
    <div className="sticky top-28 rounded-[32px] bg-white p-6 shadow-soft">
      <h3 className="text-2xl text-navy">Order Summary</h3>
      <div className="mt-5 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between"><span>Subtotal</span><span>Rs. {summary.subtotal?.toFixed(0)}</span></div>
        <div className="flex justify-between"><span>Delivery</span><span>Rs. {summary.deliveryCharge?.toFixed(0)}</span></div>
        <div className="flex justify-between"><span>Discount</span><span>- Rs. {summary.discount?.toFixed(0)}</span></div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between text-2xl font-medium text-navy">
          <span>Total</span>
          <span>Rs. {summary.total?.toFixed(0)}</span>
        </div>
      </div>

      <Link href="/checkout" className="mt-6 block">
        <Button className="h-12 w-full hover:shadow-[0_0_0_8px_rgba(232,183,200,0.35)]">Proceed to Checkout</Button>
      </Link>
      <p className="mt-3 text-center text-xs text-slate-500">Secure encrypted checkout</p>
    </div>
  );
}
