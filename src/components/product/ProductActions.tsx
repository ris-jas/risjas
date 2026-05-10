"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ProductActionsProps = {
  productId: string;
  variant?: "default" | "cardHover";
  className?: string;
};

export default function ProductActions({ productId, variant = "default", className = "" }: ProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addToCart = async () => {
    setLoading(true);
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const result = await response.json();
    setLoading(false);

    if (!result?.success) {
      window.alert(result?.message || "Unable to add product to cart");
      return false;
    }

    window.dispatchEvent(new Event("risjas:cart-updated"));
    router.refresh();
    return true;
  };

  const buyNow = async () => {
    const added = await addToCart();
    if (!added) return;
    router.push("/checkout");
  };

  if (variant === "cardHover") {
    return (
      <button
        type="button"
        onClick={addToCart}
        disabled={loading}
        className={`absolute bottom-4 left-4 right-4 h-10 rounded-full bg-navy text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
      >
        {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Add to Cart"}
      </button>
    );
  }

  return (
    <div className={`mt-4 grid grid-cols-2 gap-2 ${className}`}>
      <Button type="button" variant="secondary" className="h-11 w-full rounded-full bg-slate-100" onClick={addToCart} disabled={loading}>
        {loading ? "Adding..." : "Add to Cart"}
      </Button>
      <Button type="button" className="h-11 w-full rounded-full hover:shadow-[0_0_0_8px_rgba(232,183,200,0.35)]" onClick={buyNow} disabled={loading}>
        Buy Now
      </Button>
    </div>
  );
}
