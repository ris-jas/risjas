"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import Reveal from "@/components/common/Reveal";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createWebPageSchema } from "@/lib/seo";

const title = "Risjas Checkout | Secure Payment and Fast Delivery";
const description =
  "Complete your Risjas order with secure payment options, verified checkout steps, and quick shipping support to deliver your products safely across India.";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const pageSchema = createWebPageSchema({ title, description, path: "/checkout" });

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then((data) => setCart(data.data));
  }, []);

  return (
    <div className="container-page section-space pt-10">
      <SeoJsonLd id="checkout-page-schema" schema={pageSchema} />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Reveal className="mb-8">
        <h1 className="text-4xl text-navy sm:text-5xl">Checkout</h1>
        <p className="mt-3 text-base text-slate-500">Secure payment, fast delivery, and a seamless boutique checkout.</p>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal><CheckoutForm /></Reveal>
        <Reveal delay={0.05}>{cart ? <OrderSummary cart={cart} /> : <div className="rounded-[28px] bg-white p-6 shadow-soft">Loading summary...</div>}</Reveal>
      </div>
    </div>
  );
}
