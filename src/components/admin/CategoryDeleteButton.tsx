"use client";

import { useState } from "react";

export default function CategoryDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;
    setLoading(true);
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setLoading(false);
    if (!response.ok) {
      alert("Failed to delete category");
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