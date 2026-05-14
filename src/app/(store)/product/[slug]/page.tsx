import type { Metadata } from "next";
import { Gauge, ShieldCheck, Sparkles, Truck } from "lucide-react";

import Reveal from "@/components/common/Reveal";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import ProductActions from "@/components/product/ProductActions";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import { createPageMetadata, createProductMetadata, createProductSchema } from "@/lib/seo";
import { productService } from "@/services/product.service";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await productService.findBySlug(params.slug);
  if (!data) {
    return createPageMetadata({
      title: "Product Not Found | Risjas Help and Product Navigation",
      description:
        "The requested Risjas product is unavailable right now. Browse our latest gadgets and lifestyle essentials with updated listings, secure checkout, and support.",
      path: `/product/${params.slug}`,
      keywords: ["product unavailable", "browse alternatives", "Risjas catalog"]
    });
  }

  return createProductMetadata({
    name: data.name,
    shortDescription: data.shortDescription,
    slug: data.slug
  });
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const data = await productService.findWithRelated(params.slug);
  if (!data) return <div className="container-page section-space">Product not found.</div>;

  const { product, related } = data;
  const highlights = Array.isArray(product.highlights) ? (product.highlights as string[]) : [];
  const schemaDescription =
    product.shortDescription ||
    `${product.name} from Risjas with updated pricing, specifications, secure checkout, and fast shipping support for customers across India.`;
  const pageSchema = createProductSchema({
    name: product.name,
    description: schemaDescription,
    slug: product.slug,
    image: product.images?.[0]?.imageUrl,
    price: Number(product.price),
    availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  });

  return (
    <>
      <SeoJsonLd id="product-page-schema" schema={pageSchema} />
      <div className="container-page section-space space-y-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <ProductGallery images={product.images} name={product.name} />
          </Reveal>

          <Reveal>
            <div className="rounded-[34px] bg-white p-7 shadow-soft">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-rose-soft px-3 py-1 tracking-[0.12em] text-rose-foreground">NEW DROP</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 tracking-[0.12em] text-slate-500">AUTHENTIC</span>
              </div>
              <h1 className="text-4xl leading-tight text-navy lg:text-5xl">{product.name}</h1>
              <p className="mt-4 text-sm leading-7 text-slate-500">{product.shortDescription}</p>

              <div className="mt-6 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-medium text-navy lg:text-5xl">Rs. {Number(product.price).toFixed(0)}</span>
                <span className="text-lg text-slate-400 line-through">Rs. {Number(product.mrp).toFixed(0)}</span>
                <span className="rounded-full bg-rose-soft px-3 py-1 text-sm text-rose-foreground">Save Rs. {Math.max(0, Number(product.mrp) - Number(product.price)).toFixed(0)}</span>
              </div>

              <p className={`mt-2 text-sm ${product.stock > 0 ? "text-slate-500" : "text-rose-deep"}`}>{product.stock > 0 ? "In stock, ready to ship." : "Out of stock"}</p>

              <div className="mt-5 border-t border-slate-100 pt-5">
                <ProductActions productId={product.id} />
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><Sparkles className="mb-1 h-4 w-4 text-navy" /> Premium quality build</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><Gauge className="mb-1 h-4 w-4 text-navy" /> High performance use</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><ShieldCheck className="mb-1 h-4 w-4 text-navy" /> Secure shopping</div>
                <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-700"><Truck className="mb-1 h-4 w-4 text-navy" /> Fast delivery & returns</div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Free standard shipping on eligible orders. Easy replacement support within policy period.
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl">Engineered for Daily Use</h2>
              <p className="mt-3 leading-8 text-slate-500">{product.description}</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h2 className="text-2xl">Technical Specifications</h2>
              <div className="mt-4 space-y-2">
                {Object.entries((product.specifications as Record<string, string>) || {}).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="text-slate-500">{key}</span>
                    <span className="font-medium text-navy">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {!!highlights.length && (
          <Reveal>
            <section>
              <h2 className="text-3xl">Highlights</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-500">{highlights.map((item, idx) => <li key={idx}>{item}</li>)}</ul>
            </section>
          </Reveal>
        )}

        {!!related.length && (
          <Reveal>
            <section>
              <h2 className="text-3xl">You May Also Like</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
            </section>
          </Reveal>
        )}
      </div>
    </>
  );
}
