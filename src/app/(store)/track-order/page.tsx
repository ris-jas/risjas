"use client";

import { useMemo, useState } from "react";
import { Bike, Home, MapPin, Package, PackageCheck, Truck } from "lucide-react";

import Reveal from "@/components/common/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ORDER_FLOW = [
  { key: "PENDING", label: "Pending", icon: Package },
  { key: "CONFIRMED", label: "Confirmed", icon: PackageCheck },
  { key: "PACKED", label: "Packed", icon: Package },
  { key: "SHIPPED", label: "Shipped", icon: Truck },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Bike },
  { key: "DELIVERED", label: "Delivered", icon: Home }
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const response = await fetch("/api/orders/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, phone }) });
    const data = await response.json();
    if (!data.success) {
      setResult(null);
      setError(data.message);
      return;
    }
    setResult(data.data);
  };

  const activeIndex = useMemo(() => {
    if (!result?.status) return -1;
    return ORDER_FLOW.findIndex((step) => step.key === result.status);
  }, [result]);

  return (
    <div className="container-page section-space">
      <Reveal className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-navy sm:text-5xl">Track Your Order</h1>
        <p className="mt-3 text-base font-light text-slate-500">Enter order ID and phone number for live updates.</p>
      </Reveal>

      <Reveal className="mx-auto mt-8 max-w-4xl rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_180px]">
          <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
          <Button type="submit">Track Now</Button>
        </form>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </Reveal>

      {result ? (
        <div className="mx-auto mt-8 grid max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
          <Reveal className="rounded-[30px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-2xl font-bold text-navy">Order Status</h3>
              <span className="rounded-full bg-rose-soft px-3 py-1 text-sm font-semibold text-rose-foreground">{result.status.replaceAll("_", " ")}</span>
            </div>

            <div className="space-y-5">
              {ORDER_FLOW.map((step, index) => {
                const Icon = step.icon;
                const reached = activeIndex >= index;
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${reached ? "border-navy bg-navy text-white" : "border-slate-200 bg-slate-100 text-slate-400"}`}><Icon className="h-4 w-4" /></div>
                    <div>
                      <p className={`text-base font-semibold ${reached ? "text-slate-800" : "text-slate-400"}`}>{step.label}</p>
                      <p className="text-xs font-light text-slate-400">Updated in real-time</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal className="space-y-4" delay={0.05}>
            <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-base font-semibold text-navy"><MapPin className="h-4 w-4" /> Delivery Address</h4>
              <p className="mt-3 text-sm text-slate-600">{result.customerName}</p>
              <p className="text-sm text-slate-600">{result.addressLine}</p>
              <p className="text-sm text-slate-600">{result.city}, {result.state} {result.pincode}</p>
              <p className="text-sm text-slate-600">{result.phone}</p>
            </div>

            <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-sm">
              <h4 className="text-base font-semibold text-navy">Order Summary</h4>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                {result.items?.map((item: any) => (
                  <div key={item.id} className="flex justify-between"><span>{item.productName} x {item.quantity}</span><span>Rs. {Number(item.total).toFixed(0)}</span></div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 font-semibold text-navy"><span>Total</span><span>Rs. {Number(result.total).toFixed(0)}</span></div>
              <p className="mt-2 text-xs text-slate-500">Payment: {result.paymentStatus}</p>
            </div>

            <a className="block rounded-full bg-navy px-4 py-3 text-center text-sm font-semibold text-white transition hover:shadow-[0_0_0_6px_rgba(231,167,185,0.2)]" href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919999999999"}`} target="_blank">Need Help? WhatsApp Us</a>
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
