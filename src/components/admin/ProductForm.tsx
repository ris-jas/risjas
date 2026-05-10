"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductForm({ categories, initialData }: { categories: any[]; initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(
    useMemo(() => (initialData?.images?.map((x: any) => x.imageUrl) || []).filter(Boolean), [initialData])
  );

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setStatus("");

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "risjas/products");
        const response = await fetch("/api/admin/uploads", {
          method: "POST",
          body: formData
        });
        const result = await response.json();
        if (!result.success) throw new Error(result.message || "Upload failed");
        uploaded.push(result.data.imageUrl);
      }
      setImageUrls((prev) => [...prev, ...uploaded]);
      setStatus("Images uploaded successfully");
    } catch (error: any) {
      setStatus(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrls.length) {
      setStatus("Upload at least one image");
      return;
    }

    setLoading(true);
    setStatus("");

    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      sku: formData.get("sku"),
      categoryId: formData.get("categoryId"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      highlights: String(formData.get("highlights") || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      specifications: Object.fromEntries(
        String(formData.get("specifications") || "")
          .split("\n")
          .map((line) => line.split(":"))
          .filter((p) => p.length === 2)
          .map((p) => [p[0].trim(), p[1].trim()])
      ),
      mrp: Number(formData.get("mrp")),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      isFeatured: formData.get("isFeatured") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isActive: formData.get("isActive") === "on",
      images: imageUrls.map((url, idx) => ({ imageUrl: url, publicId: `uploaded-${idx}` }))
    };

    const method = initialData ? "PATCH" : "POST";
    const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setStatus(result.message || "Failed to save product");
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form action={handleSubmit} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="name" placeholder="Product name" defaultValue={initialData?.name} required />
        <Input name="slug" placeholder="Slug" defaultValue={initialData?.slug} required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="sku" placeholder="SKU" defaultValue={initialData?.sku} required />
        <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="categoryId" defaultValue={initialData?.categoryId || ""} required>
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <Input name="shortDescription" placeholder="Short description" defaultValue={initialData?.shortDescription} required />
      <Textarea name="description" placeholder="Full description" defaultValue={initialData?.description} required />
      <Textarea name="highlights" placeholder="Highlights (one per line)" defaultValue={(initialData?.highlights || []).join("\n")} />
      <Textarea
        name="specifications"
        placeholder="Specifications key:value (one per line)"
        defaultValue={Object.entries(initialData?.specifications || {})
          .map(([k, v]) => `${k}:${v}`)
          .join("\n")}
      />

      <div className="rounded-lg border border-slate-200 p-3">
        <label className="mb-2 block text-sm font-medium">Product Images</label>
        <Input type="file" multiple accept="image/*" onChange={(e) => uploadFiles(e.target.files)} disabled={uploading} />
        <p className="mt-1 text-xs text-slate-500">Or paste URLs (comma separated) below</p>
        <Input
          placeholder="https://... , https://..."
          onBlur={(e) => {
            const values = e.target.value
              .split(",")
              .map((v) => v.trim())
              .filter(Boolean);
            if (values.length) setImageUrls((prev) => [...prev, ...values]);
            e.target.value = "";
          }}
        />
        {imageUrls.length ? (
          <div className="mt-2 space-y-1">
            {imageUrls.map((url) => (
              <div key={url} className="flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-xs">
                <span className="max-w-[85%] truncate">{url}</span>
                <button type="button" className="text-red-600" onClick={() => removeImage(url)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="mrp" type="number" placeholder="MRP" defaultValue={initialData?.mrp} required />
        <Input name="price" type="number" placeholder="Selling price" defaultValue={initialData?.price} required />
        <Input name="stock" type="number" placeholder="Stock" defaultValue={initialData?.stock} required />
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isBestSeller" defaultChecked={initialData?.isBestSeller} /> Best Seller</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} /> Active</label>
      </div>
      {status ? <p className={`text-sm ${status.toLowerCase().includes("failed") ? "text-red-600" : "text-slate-600"}`}>{status}</p> : null}
      <Button type="submit" disabled={loading || uploading}>{loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}</Button>
    </form>
  );
}