"use client";

import Image from "next/image";

export default function CartItem({ item }: { item: any }) {
  const updateQty = async (quantity: number) => {
    const response = await fetch(`/api/cart/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity })
    });
    const result = await response.json();
    if (!result?.success) {
      window.alert(result?.message || "Unable to update cart quantity");
      return;
    }
    window.dispatchEvent(new Event("risjas:cart-updated"));
    window.location.reload();
  };

  const remove = async () => {
    const response = await fetch(`/api/cart/items/${item.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!result?.success) {
      window.alert(result?.message || "Unable to remove cart item");
      return;
    }
    window.dispatchEvent(new Event("risjas:cart-updated"));
    window.location.reload();
  };

  return (
    <div className="grid gap-4 border-b border-slate-100 pb-6 sm:grid-cols-[148px_1fr_auto]">
      <div className="relative h-32 overflow-hidden rounded-3xl bg-slate-50/80 p-2">
        <Image src={item.product.images?.[0]?.imageUrl || "/products/cute-panda.png"} alt={item.product.name} fill className="rounded-2xl object-cover" />
      </div>

      <div>
        <h4 className="text-2xl text-navy">{item.product.name}</h4>
        <p className="mt-1 text-sm text-slate-500">{item.product.shortDescription || "Premium daily-use product"}</p>
        <div className="mt-4 inline-flex items-center rounded-full bg-slate-50 px-1">
          <button className="h-9 w-9 rounded-full text-lg text-navy transition hover:bg-rose-soft" onClick={() => updateQty(Math.max(1, item.quantity - 1))}>-</button>
          <span className="w-10 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
          <button className="h-9 w-9 rounded-full text-lg text-navy transition hover:bg-rose-soft" onClick={() => updateQty(item.quantity + 1)}>+</button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button onClick={remove} className="h-8 w-8 rounded-full text-xl text-slate-400 transition hover:bg-rose-soft hover:text-rose-foreground">×</button>
        <p className="text-2xl font-medium text-navy">Rs. {(Number(item.product.price) * item.quantity).toFixed(0)}</p>
      </div>
    </div>
  );
}
