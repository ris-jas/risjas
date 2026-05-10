"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CategoryForm({ initialData }: { initialData?: any }) {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
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

    router.refresh();
  };

  return (
    <form action={handleSubmit} className="grid gap-3 rounded-2xl border border-zinc-300 bg-zinc-100 p-5 sm:grid-cols-4">
      <Input name="name" placeholder="Category name" defaultValue={initialData?.name} required />
      <Input name="slug" placeholder="Slug" defaultValue={initialData?.slug} required />
      <Input name="imageUrl" placeholder="Image URL" defaultValue={initialData?.imageUrl} />
      <div className="flex items-center gap-3">
        <label className="text-sm"><input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} /> Active</label>
        <Button type="submit">{initialData ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
}

