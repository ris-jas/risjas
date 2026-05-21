import type { Metadata } from "next";

import EmptyState from "@/components/common/EmptyState";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import ProductSort from "@/components/product/ProductSort";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

const title = "Risjas Products | Shop Gadgets, Decor and Daily Essentials";
const description =
  "Browse the full Risjas product collection featuring trendy gadgets, aesthetic decor, and daily essentials with filters, sorting, and secure online checkout.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/products",
  keywords: ["all products", "shop gadgets", "home decor collection", "daily essentials online"]
});

export default async function ProductsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const categories = await categoryService.listActive();
  const products = await productService.list({
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    minPrice: typeof searchParams.minPrice === "string" ? Number(searchParams.minPrice) : undefined,
    maxPrice: typeof searchParams.maxPrice === "string" ? Number(searchParams.maxPrice) : undefined,
    sort: (typeof searchParams.sort === "string" ? searchParams.sort : "newest") as any
  });

  const selectedSort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const pageSchema = createWebPageSchema({ title, description, path: "/products", type: "CollectionPage" });

  return (
    <>
      <SeoJsonLd id="products-page-schema" schema={pageSchema} />
      <div className="container-page section-space">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <ProductFilters categories={categories} />

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] bg-white p-4 shadow-soft">
              <h1 className="text-4xl sm:text-5xl">Products</h1>
              <div className="flex items-center gap-3">
                <p className="text-sm text-slate-500">Showing 1-{products.length} results</p>
                <ProductSort defaultValue={selectedSort} />
              </div>
            </div>

            {products.length ? (
              <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState title="No products found" description="Try adjusting filters or search." />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
