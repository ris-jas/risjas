import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import Reveal from "@/components/common/Reveal";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { Button } from "@/components/ui/button";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "Order Success | Risjas Purchase Confirmation and Tracking";
const description =
  "Your Risjas order is confirmed successfully. Review order details, access live tracking, and continue shopping while our team prepares fast and secure delivery.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/order-success",
  keywords: ["order confirmed", "purchase success", "track order", "post checkout"],
  noIndex: true
});

export default function OrderSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const pageSchema = createWebPageSchema({ title, description, path: "/order-success" });

  return (
    <>
      <SeoJsonLd id="order-success-schema" schema={pageSchema} />
      <div className="container-page section-space max-w-4xl">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-rose-soft text-rose-foreground"><CheckCircle2 className="h-10 w-10" /></div>
          <h1 className="mt-7 text-4xl font-bold leading-tight text-navy sm:text-5xl">Thank You For Your Order</h1>
          <p className="mt-3 text-base font-light text-slate-500">Your confirmation is being processed.</p>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl rounded-[30px] border border-slate-100 bg-white p-7 shadow-sm" delay={0.05}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Order ID</p>
            <p className="text-2xl font-bold text-navy">#{searchParams.orderId || "N/A"}</p>
          </div>
          <div className="mt-5 flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-lg font-semibold text-slate-800">Order placed successfully</p>
              <p className="text-sm font-light text-slate-500">Track status anytime from the tracking page.</p>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between text-lg font-semibold text-navy">
            <span>Total</span>
            <span>As per checkout summary</span>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/track-order"><Button className="h-12 min-w-40">Track Order</Button></Link>
          <Link href="/products"><Button variant="outline" className="h-12 min-w-44">Continue Shopping</Button></Link>
        </div>
      </div>
    </>
  );
}
