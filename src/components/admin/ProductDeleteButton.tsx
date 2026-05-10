"use client";

import { useState } from "react";

export default function ProductDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

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
    window.location.reload();
  };

  return (
    <button type="button" className="text-xs text-red-600" onClick={onDelete} disabled={loading}>
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}