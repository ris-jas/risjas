"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, Image as ImageIcon, Link2, Tag, X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
  isActive: boolean;
};

export default function CategoryCards({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", imageUrl: "", isActive: true });
  const [busy, setBusy] = useState<"save" | "delete" | null>(null);

  const sorted = useMemo(
    () =>
      [...categories].sort((a, b) => {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.name.localeCompare(b.name);
      }),
    [categories]
  );

  const openEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl || "",
      isActive: category.isActive
    });
  };

  const closeEdit = () => {
    setEditing(null);
    setBusy(null);
  };

  const onSave = async () => {
    if (!editing) return;
    setBusy("save");
    const response = await fetch(`/api/admin/categories/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setBusy(null);
    if (!response.ok) {
      alert("Failed to update category");
      return;
    }
    closeEdit();
    router.refresh();
  };

  const onDelete = async (id: string) => {
    const ok = window.confirm("Delete this category?");
    if (!ok) return;
    setBusy("delete");
    const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setBusy(null);
    if (!response.ok) {
      alert("Failed to delete category");
      return;
    }
    if (editing?.id === id) closeEdit();
    router.refresh();
  };

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {sorted.map((category) => (
          <article
            key={category.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-float"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-red-100/40 blur-xl transition duration-500 group-hover:bg-red-100/60" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-2 text-2xl font-bold leading-tight text-navy">{category.name}</p>
                <p className="mt-1 line-clamp-1 text-sm text-slate-500">/{category.slug}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  category.isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-slate-200 bg-slate-100 text-slate-600"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="relative mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => openEdit(category)}
                className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                type="button"
                className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                onClick={() => onDelete(category.id)}
                disabled={busy === "delete"}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-float sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-navy">Edit Category</h3>
                <p className="mt-1 text-sm text-slate-500">Update name, slug, image URL, and active status.</p>
              </div>
              <button type="button" className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" onClick={closeEdit}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Tag className="h-3.5 w-3.5" />
                  Name
                </span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Link2 className="h-3.5 w-3.5" />
                  Slug
                </span>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Image URL
                </span>
                <input
                  value={form.imageUrl}
                  onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-navy focus:bg-white focus:ring-2 focus:ring-red-100"
                  placeholder="https://..."
                />
              </label>

              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                Active
              </label>
            </div>

            <div className="mt-5 flex items-center gap-2.5">
              <button
                type="button"
                onClick={onSave}
                disabled={busy === "save"}
                className="rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-soft disabled:opacity-60"
              >
                {busy === "save" ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={closeEdit}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
