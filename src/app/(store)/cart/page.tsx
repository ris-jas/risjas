"use client";

import { useEffect, useState } from "react";

import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Reveal from "@/components/common/Reveal";
import EmptyState from "@/components/common/EmptyState";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);

  useEffect(() => {
    fetch("/api/cart").then((r) => r.json()).then((data) => setCart(data.data));
  }, []);

  if (!cart) return <div className="container-page section-space">Loading cart...</div>;

  return (
    <div className="container-page section-space pt-10">
      <Reveal>
        <h1 className="text-4xl leading-tight text-navy sm:text-5xl">Your Cart</h1>
        <p className="mt-3 text-base text-slate-500">Review your curated picks and continue to checkout.</p>
      </Reveal>

      {!cart.items?.length ? (
        <div className="mt-8"><EmptyState title="Cart is empty" description="Add products to continue checkout." /></div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
          <Reveal className="space-y-6 rounded-[32px] bg-white p-6 shadow-soft">
            {cart.items.map((item: any) => <CartItem key={item.id} item={item} />)}
          </Reveal>
          <Reveal delay={0.05}><CartSummary summary={cart.summary} /></Reveal>
        </div>
      )}
    </div>
  );
}
