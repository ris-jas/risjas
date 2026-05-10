"use client";

import { useRouter } from "next/navigation";

export default function OrderStatusSelect({ id, value, type }: { id: string; value: string; type: "status" | "payment-status" }) {
  const router = useRouter();

  const options =
    type === "status"
      ? ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"]
      : ["PENDING", "PAID", "FAILED", "REFUNDED"];

  const onChange = async (nextValue: string) => {
    const payload = type === "status" ? { status: nextValue } : { paymentStatus: nextValue };
    await fetch(`/api/admin/orders/${id}/${type}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    router.refresh();
  };

  return (
    <select className="h-11 rounded-xl border border-zinc-400 bg-zinc-50 px-3 text-sm font-medium" defaultValue={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option.replaceAll("_", " ")}
        </option>
      ))}
    </select>
  );
}

