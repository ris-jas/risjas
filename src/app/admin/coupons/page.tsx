"use client";

import { useEffect, useMemo, useState } from "react";
import { PercentCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = () => fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.data || []));

  useEffect(() => {
    load();
  }, []);

  const activeCoupons = useMemo(() => coupons.filter((coupon) => coupon.isActive).length, [coupons]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
    await load();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex items-center gap-2">
          <PercentCircle className="h-6 w-6 text-navy" />
          <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Coupons</h1>
        </div>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">Create dynamic offers and control discount campaigns.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Total: {coupons.length}</span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Active: {activeCoupons}</span>
        </div>
      </section>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <Input name="code" placeholder="Coupon code" required />
          <select
            name="discountType"
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-red-100"
          >
            <option value="FIXED">Fixed</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
          <Input name="discountValue" type="number" placeholder="Discount value" required />
          <Input name="minOrderAmount" type="number" placeholder="Min order amount" required />
          <Input name="expiryDate" type="date" required />
          <Input name="usageLimit" type="number" placeholder="Usage limit (optional)" />
        </div>
        <Button type="submit" disabled={loading} className="mt-4 rounded-xl px-5">
          {loading ? "Creating..." : "Create Coupon"}
        </Button>
      </form>

      <div className="grid gap-4 xl:grid-cols-2">
        {coupons.map((coupon) => (
          <article
            key={coupon.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-float"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-base font-semibold text-navy">{coupon.code}</span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  coupon.isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {coupon.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold text-navy">
              {coupon.discountType === "PERCENTAGE" ? `${Number(coupon.discountValue)}%` : `Rs. ${Number(coupon.discountValue).toFixed(0)}`}
            </p>
            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>Valid till: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
              <p>Min purchase: Rs. {Number(coupon.minOrderAmount).toFixed(0)}</p>
              <p>Used: {coupon.usedCount || 0}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
