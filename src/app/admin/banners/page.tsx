"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("manual");
  const [uploading, setUploading] = useState(false);

  const load = () => fetch("/api/admin/banners").then((r) => r.json()).then((d) => setBanners(d.data || []));

  useEffect(() => {
    load();
  }, []);

  const onUpload = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "risjas/banners");
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Upload failed");
      setImageUrl(result.data.imageUrl);
      setPublicId(result.data.publicId || "uploaded-banner");
      setStatus("Banner image uploaded successfully");
    } catch (error: any) {
      setStatus(error.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("");

    const form = new FormData(e.currentTarget);
    const response = await fetch("/api/admin/banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        subtitle: form.get("subtitle"),
        imageUrl,
        publicId,
        buttonText: form.get("buttonText"),
        buttonLink: form.get("buttonLink"),
        isActive: true
      })
    });

    const result = await response.json();
    if (!result.success) {
      setStatus(result.message || "Failed to create banner");
      return;
    }

    setStatus("Banner created successfully");
    (e.target as HTMLFormElement).reset();
    setImageUrl("");
    setPublicId("manual");
    load();
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this banner?");
    if (!ok) return;
    const response = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!result.success) {
      setStatus(result.message || "Failed to delete banner");
      return;
    }
    setStatus("Banner deleted successfully");
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Banners</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
        <Input name="title" placeholder="Title" required />
        <Input name="subtitle" placeholder="Subtitle" />
        <Input name="buttonText" placeholder="Button text" />
        <Input name="buttonLink" placeholder="Button link" />
        <Input type="file" accept="image/*" onChange={(e) => onUpload(e.target.files?.[0] || null)} disabled={uploading} />
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Banner image URL"
          required
        />
        {status ? <p className="text-sm text-slate-600 sm:col-span-3">{status}</p> : null}
        <Button type="submit" className="sm:col-span-3 sm:w-fit" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Banner"}
        </Button>
      </form>
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
        {banners.map((banner) => (
          <div key={banner.id} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
            <span>{banner.title}</span>
            <button type="button" className="text-xs text-red-600" onClick={() => onDelete(banner.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}