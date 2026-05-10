import { Layers3 } from "lucide-react";

import CategoryCards from "@/components/admin/CategoryCards";
import CategoryForm from "@/components/admin/CategoryForm";
import { categoryService } from "@/services/category.service";

export default async function AdminCategoriesPage() {
  const categories = await categoryService.listAdmin();
  const activeCount = categories.filter((category) => category.isActive).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Categories</h1>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">Manage category structure and visibility for your storefront.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Total Categories: {categories.length}
          </span>
          <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Active: {activeCount}
          </span>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-2">
          <Layers3 className="h-5 w-5 text-navy" />
          <h2 className="text-3xl font-bold text-navy">Add Category</h2>
        </div>
        <CategoryForm />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-3xl font-bold text-navy">Category Cards</h2>
        <CategoryCards categories={categories} />
      </section>
    </div>
  );
}
