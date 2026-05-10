"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ADMIN_PANEL_PATH } from "@/lib/admin-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ProductForm({ categories, initialData }: { categories: any[]; initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [urlInput, setUrlInput] = useState("");
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
      setStatus("Images uploaded successfully.");
    } catch (error: any) {
      setStatus(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const addImageUrlsFromInput = () => {
    const values = urlInput
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (!values.length) return;
    setImageUrls((prev) => [...prev, ...values]);
    setUrlInput("");
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  };

  const handleSubmit = async (formData: FormData) => {
    if (!imageUrls.length) {
      setStatus("Please add at least one product image.");
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
      setStatus(result.message || "Failed to save product.");
      return;
    }

    router.push(`${ADMIN_PANEL_PATH}/products`);
    router.refresh();
  };

  return (
    <form action={handleSubmit} className="space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-bold text-navy">Basic Information</h2>
        <p className="mt-1 text-sm text-slate-500">Core product identity used across storefront and admin.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Product Name</label>
            <Input name="name" placeholder="Product name" defaultValue={initialData?.name} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Slug</label>
            <Input name="slug" placeholder="product-slug" defaultValue={initialData?.slug} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">SKU</label>
            <Input name="sku" placeholder="RIS-XXX-001" defaultValue={initialData?.sku} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Category</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-navy/10"
              name="categoryId"
              defaultValue={initialData?.categoryId || ""}
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-bold text-navy">Content</h2>
        <p className="mt-1 text-sm text-slate-500">Descriptions, highlights, and specifications shown on product page.</p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Short Description</label>
            <Input name="shortDescription" placeholder="Quick one-line product pitch" defaultValue={initialData?.shortDescription} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Full Description</label>
            <Textarea name="description" placeholder="Detailed product description" defaultValue={initialData?.description} required className="min-h-[130px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Highlights</label>
            <Textarea name="highlights" placeholder="One point per line" defaultValue={(initialData?.highlights || []).join("\n")} className="min-h-[110px]" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Specifications</label>
            <Textarea
              name="specifications"
              placeholder="key:value (one per line)"
              defaultValue={Object.entries(initialData?.specifications || {})
                .map(([k, v]) => `${k}:${v}`)
                .join("\n")}
              className="min-h-[120px]"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-bold text-navy">Media</h2>
        <p className="mt-1 text-sm text-slate-500">Upload images or paste URLs. First image becomes cover image.</p>
        <div className="mt-4 space-y-3">
          <Input type="file" multiple accept="image/*" onChange={(e) => uploadFiles(e.target.files)} disabled={uploading} />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input placeholder="https://image1.jpg, https://image2.jpg" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            <Button type="button" variant="secondary" className="rounded-xl" onClick={addImageUrlsFromInput}>
              Add URLs
            </Button>
          </div>
          {imageUrls.length ? (
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              {imageUrls.map((url) => (
                <div key={url} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-xs">
                  <span className="max-w-[85%] truncate text-slate-600">{url}</span>
                  <button type="button" className="font-semibold text-red-600 hover:text-red-700" onClick={() => removeImage(url)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-bold text-navy">Pricing & Inventory</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">MRP</label>
            <Input name="mrp" type="number" placeholder="MRP" defaultValue={initialData?.mrp} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Selling Price</label>
            <Input name="price" type="number" placeholder="Selling price" defaultValue={initialData?.price} required />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Stock</label>
            <Input name="stock" type="number" placeholder="Stock" defaultValue={initialData?.stock} required />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-bold text-navy">Visibility</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
            <input type="checkbox" name="isFeatured" defaultChecked={initialData?.isFeatured} />
            Featured
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
            <input type="checkbox" name="isBestSeller" defaultChecked={initialData?.isBestSeller} />
            Best Seller
          </label>
          <label className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700">
            <input type="checkbox" name="isActive" defaultChecked={initialData?.isActive ?? true} />
            Active
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        {status ? (
          <p className={`mb-3 rounded-lg px-3 py-2 text-sm ${status.toLowerCase().includes("failed") || status.toLowerCase().includes("please") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {status}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={loading || uploading} className="rounded-xl px-5 py-2.5 text-sm">
            {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="rounded-xl px-5 py-2.5 text-sm"
            onClick={() => router.push(`${ADMIN_PANEL_PATH}/products`)}
          >
            Cancel
          </Button>
        </div>
      </section>
    </form>
  );
}
