"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    setLoading(true);
    const response = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      alert("Failed to delete product");
      return;
    }
    router.refresh();
  };

  return (
    <button
      type="button"
      className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
      onClick={onDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
