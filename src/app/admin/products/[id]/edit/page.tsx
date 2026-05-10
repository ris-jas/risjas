import { notFound } from "next/navigation";

import ProductForm from "@/components/admin/ProductForm";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [categories, product] = await Promise.all([categoryService.listAdmin(), productService.findById(params.id)]);
  if (!product) notFound();

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Edit Product</h1><ProductForm categories={categories} initialData={product} /></div>;
}