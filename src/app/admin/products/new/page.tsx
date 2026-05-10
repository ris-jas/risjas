import ProductForm from "@/components/admin/ProductForm";
import { categoryService } from "@/services/category.service";

export default async function NewProductPage() {
  const categories = await categoryService.listAdmin();
  return <div className="space-y-4"><h1 className="text-2xl font-bold">Add Product</h1><ProductForm categories={categories} /></div>;
}