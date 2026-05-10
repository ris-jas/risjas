import Link from "next/link";

import HeroCarousel, { HeroSlide } from "@/components/home/HeroCarousel";
import ProductCard from "@/components/product/ProductCard";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dealRanges = [
  { label: "Under Rs. 199", min: 0, max: 199 },
  { label: "Under Rs. 499", min: 0, max: 499 },
  { label: "Under Rs. 999", min: 0, max: 999 },
  { label: "Rs. 1000 - 1999", min: 1000, max: 1999 },
  { label: "Above Rs. 2000", min: 2000 }
];

const heroBackgrounds = [
  "from-[#f7ebef] via-white to-[#eef3ff]",
  "from-[#eef4ff] via-white to-[#ffeef6]",
  "from-[#fff4ef] via-white to-[#eefaf7]",
  "from-[#f1f5ff] via-white to-[#fff1f6]"
];

function toTitleParts(text?: string) {
  const value = (text || "Risjas Picks").trim();
  const parts = value.split(" ");
  if (parts.length === 1) return { title: parts[0], subtitle: "Collection" };
  return {
    title: parts.slice(0, Math.ceil(parts.length / 2)).join(" "),
    subtitle: parts.slice(Math.ceil(parts.length / 2)).join(" ")
  };
}

function buildHeroSlides(banners: any[], featuredProducts: any[]): HeroSlide[] {
  if (banners.length) {
    return banners.slice(0, 4).map((banner, index) => {
      const { title, subtitle } = toTitleParts(banner.title || banner.subtitle || "Risjas Picks");
      return {
        id: banner.id,
        image: banner.imageUrl,
        bg: heroBackgrounds[index % heroBackgrounds.length],
        title,
        subtitle,
        label: banner.subtitle || "Fresh Collection",
        buttonText: banner.buttonText || "Shop Now",
        buttonLink: banner.buttonLink || "/products"
      };
    });
  }

  return featuredProducts.slice(0, 4).map((product, index) => {
    const { title, subtitle } = toTitleParts(product.name);
    return {
      id: product.id,
      image: product.images?.[0]?.imageUrl || "/products/cute-panda.png",
      bg: heroBackgrounds[index % heroBackgrounds.length],
      title,
      subtitle,
      label: product.category?.name || "Trending",
      priceText: `Rs. ${Number(product.price || 0).toFixed(0)}`,
      discountText: `${Math.max(0, Number(product.discountPercent || 0))}% OFF`,
      buttonText: "View Product",
      buttonLink: `/product/${product.slug}`
    };
  });
}

export default async function HomePage() {
  const [categories, featuredProducts, bestSellerProducts, latestProducts, banners] = await Promise.all([
    categoryService.listActive(),
    productService.list({ featured: true, sort: "newest" as any }),
    productService.list({ bestSeller: true, sort: "newest" as any }),
    productService.list({ sort: "newest" as any }),
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 4 })
  ]);

  const heroSlides = buildHeroSlides(banners, featuredProducts.length ? featuredProducts : latestProducts);
  const topCollections = categories.slice(0, 12);
  const trendingProducts = (bestSellerProducts.length ? bestSellerProducts : latestProducts).slice(0, 10);
  const freshDrops = latestProducts.slice(0, 8);

  return (
    <div className="bg-[#FCFCFC] pb-16 pt-[80px] lg:pt-[128px]">
      <HeroCarousel slides={heroSlides} />

      <section className="container-page pt-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-navy">Top Collections</h2>
              <p className="mt-2 text-slate-600">Shop by your live category catalog.</p>
            </div>
            <Link href="/products" className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red">
              View All
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topCollections.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.slug)}`}
                className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#f8fbff] p-4 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-navy group-hover:text-red line-clamp-2">{category.name}</p>
                <p className="mt-1 text-xs text-slate-500">/{category.slug}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pt-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-navy">Explore By Budget</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {dealRanges.map((range) => (
              <Link
                key={range.label}
                href={range.max ? `/products?minPrice=${range.min}&maxPrice=${range.max}` : `/products?minPrice=${range.min}`}
                className="rounded-2xl bg-navy px-4 py-5 text-center text-sm font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-red"
              >
                {range.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-navy">Trending Now</h2>
            <p className="mt-2 text-slate-600">Dynamic picks based on your live product data.</p>
          </div>
          <Link href="/products" className="text-sm font-semibold text-navy hover:text-red transition">Browse All</Link>
        </div>

        {trendingProducts.length ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
            No active products yet.
          </div>
        )}
      </section>

      <section className="container-page pt-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy">New Drops</h2>
              <p className="mt-2 text-slate-600">Latest products added from your admin panel.</p>
            </div>
            <Link href="/products?sort=newest" className="text-sm font-semibold text-navy hover:text-red transition">See Newest</Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {freshDrops.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page pt-16">
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-lg font-semibold text-navy">Fast Delivery</p>
            <p className="mt-1 text-sm text-slate-600">Quick dispatch on confirmed orders.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-lg font-semibold text-navy">Secure Checkout</p>
            <p className="mt-1 text-sm text-slate-600">COD and Razorpay both supported.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-lg font-semibold text-navy">Real-time Inventory</p>
            <p className="mt-1 text-sm text-slate-600">Stock updates from live orders and admin edits.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
