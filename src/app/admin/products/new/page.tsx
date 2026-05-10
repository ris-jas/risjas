import ProductForm from "@/components/admin/ProductForm";
import { categoryService } from "@/services/category.service";

export default async function NewProductPage() {
  const categories = await categoryService.listAdmin();
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Add Product</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Create a new catalog item with complete content, media, and pricing.</p>
      </section>
      <ProductForm categories={categories} />
    </div>
  );
}
