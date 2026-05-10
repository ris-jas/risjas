"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const load = () => fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.data || []));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.get("code"),
        discountType: form.get("discountType"),
        discountValue: Number(form.get("discountValue")),
        minOrderAmount: Number(form.get("minOrderAmount")),
        expiryDate: new Date(String(form.get("expiryDate"))).toISOString(),
        usageLimit: Number(form.get("usageLimit")) || undefined,
        isActive: true
      })
    });
    (e.target as HTMLFormElement).reset();
    load();
  };

  return (
    <div className="space-y-5">
      <h1 className="text-[58px] text-6xl font-bold">Coupons</h1>

      <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-zinc-300 bg-zinc-100 p-5 sm:grid-cols-3">
        <Input name="code" placeholder="Code" required />
        <select name="discountType" className="h-11 rounded-xl border border-zinc-300 bg-zinc-50 px-3 text-sm"><option value="FIXED">Fixed</option><option value="PERCENTAGE">Percentage</option></select>
        <Input name="discountValue" type="number" placeholder="Discount Value" required />
        <Input name="minOrderAmount" type="number" placeholder="Min order amount" required />
        <Input name="expiryDate" type="date" required />
        <Input name="usageLimit" type="number" placeholder="Usage limit" />
        <Button type="submit" className="sm:col-span-3 sm:w-fit">Create Coupon</Button>
      </form>

      <div className="grid gap-4 xl:grid-cols-2">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="rounded-2xl border border-zinc-300 bg-zinc-100 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1 text-lg font-semibold">{coupon.code}</span>
              <span className={`rounded-full px-3 py-1 text-sm ${coupon.isActive ? "bg-zinc-200 text-zinc-800" : "bg-zinc-100 text-zinc-500"}`}>{coupon.isActive ? "Active" : "Inactive"}</span>
            </div>
            <p className="mt-3 text-5xl font-semibold">
              {coupon.discountType === "PERCENTAGE" ? `${Number(coupon.discountValue)}%` : `Rs. ${Number(coupon.discountValue).toFixed(0)}`}
              <span className="ml-2 text-xl text-zinc-600">{coupon.discountType === "PERCENTAGE" ? "OFF" : "Fixed Discount"}</span>
            </p>
            <p className="mt-2 text-zinc-600">Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
            <p className="text-zinc-600">Min purchase: Rs. {Number(coupon.minOrderAmount).toFixed(0)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

