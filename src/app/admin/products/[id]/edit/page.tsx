import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [categories, product] = await Promise.all([categoryService.listAdmin(), productService.findById(params.id)]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Edit Product</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Update details, pricing, media, and visibility for this product.</p>
      </section>
      <ProductForm categories={categories} initialData={product} />
    </div>
  );
}
