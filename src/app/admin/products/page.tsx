import Link from "next/link";

import ProductDeleteButton from "@/components/admin/ProductDeleteButton";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product.service";

export default async function AdminProductsPage() {
  const products = await productService.listAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-[58px] text-6xl font-bold">Products</h1>
        <Link href="/admin/products/new"><Button>Add Product</Button></Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-300 bg-zinc-100">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-300 text-sm uppercase tracking-wide text-zinc-600">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-zinc-300 last:border-b-0">
                <td className="p-4">
                  <p className="text-2xl font-semibold">{product.name}</p>
                  <div className="mt-1 flex gap-2 text-xs">
                    {product.isFeatured ? <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">Featured</span> : null}
                    {product.isBestSeller ? <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-700">Best Seller</span> : null}
                  </div>
                </td>
                <td className="p-4 text-lg">{product.category.name}</td>
                <td className="p-4 text-2xl font-semibold">Rs. {Number(product.price).toFixed(0)}</td>
                <td className="p-4 text-xl">{product.stock}</td>
                <td className="p-4">
                  <span className={`rounded-full px-3 py-1 text-sm ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"}`}>{product.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link className="text-lg font-semibold text-zinc-700 underline" href={`/admin/products/${product.id}/edit`}>Edit</Link>
                    <ProductDeleteButton id={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

