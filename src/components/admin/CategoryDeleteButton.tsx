"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryDeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    router.refresh();
  };

  return (
    <button
      type="button"
      className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition duration-300 hover:bg-red-100 disabled:opacity-60"
      onClick={onDelete}
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
