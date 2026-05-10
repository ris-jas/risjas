"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      imageUrl: formData.get("imageUrl"),
      isActive: formData.get("isActive") === "on"
    };

    const url = initialData ? `/api/admin/categories/${initialData.id}` : "/api/admin/categories";
    const method = initialData ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setLoading(false);
    router.refresh();
  };

  return (
    <form action={handleSubmit} className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-soft">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Name</label>
          <Input name="name" placeholder="Category name" defaultValue={initialData?.name} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Slug</label>
          <Input name="slug" placeholder="category-slug" defaultValue={initialData?.slug} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Image URL</label>
          <Input name="imageUrl" placeholder="https://..." defaultValue={initialData?.imageUrl} />
        </div>
        <div className="flex items-end gap-3">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} />
            Active
          </label>
          <Button type="submit" disabled={loading} className="rounded-xl px-4">
            {loading ? "Saving..." : initialData ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
}
