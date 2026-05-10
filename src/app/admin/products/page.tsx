import Image from "next/image";
import Link from "next/link";

import ProductDeleteButton from "@/components/admin/ProductDeleteButton";
import { Button } from "@/components/ui/button";
import { ADMIN_PANEL_PATH } from "@/lib/admin-path";
import { productService } from "@/services/product.service";

export default async function AdminProductsPage() {
  const products = await productService.listAdmin();
  const activeCount = products.filter((product) => product.isActive).length;
  const lowStockCount = products.filter((product) => product.stock <= 10).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-navy sm:text-5xl">Products</h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">Manage catalog items, pricing, stock, and visibility from one place.</p>
          </div>
          <Link href={`${ADMIN_PANEL_PATH}/products/new`}>
            <Button className="rounded-xl px-4 py-2 text-sm">+ Add Product</Button>
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
            Total: {products.length}
          </span>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Active: {activeCount}
          </span>
          <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
            Low Stock: {lowStockCount}
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="max-h-[68vh] overflow-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const image = product.images?.[0]?.imageUrl || "/products/cute-panda.png";

                return (
                  <tr key={product.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                          <Image src={image} alt={product.name} fill className="object-cover" sizes="44px" />
                        </div>
                        <div>
                          <p className="line-clamp-1 text-sm font-semibold text-navy">{product.name}</p>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {product.isFeatured ? (
                              <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Featured</span>
                            ) : null}
                            {product.isBestSeller ? (
                              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">Best Seller</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-slate-600">{product.category.name}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm font-semibold text-navy">Rs. {Number(product.price).toFixed(0)}</div>
                      {Number(product.mrp) > Number(product.price) ? (
                        <div className="text-xs text-slate-400 line-through">Rs. {Number(product.mrp).toFixed(0)}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{product.stock}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          product.isActive ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`${ADMIN_PANEL_PATH}/products/${product.id}/edit`}
                          className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-navy transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <ProductDeleteButton id={product.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
