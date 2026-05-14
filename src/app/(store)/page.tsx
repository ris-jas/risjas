import type { Metadata } from "next";
import Link from "next/link";

import SeoJsonLd from "@/components/common/SeoJsonLd";
import HeroCarousel, { HeroSlide } from "@/components/home/HeroCarousel";
import ProductCard from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = createPageMetadata({
  title: "Risjas Online Store | Trendy Gadgets & Lifestyle Picks",
  description:
    "Shop trendy gadgets, aesthetic decor, and daily-use essentials at Risjas with secure checkout, fast shipping, and reliable customer support across India.",
  path: "/",
  keywords: ["home decor India", "smart gadgets online", "boutique lifestyle store", "COD shopping"]
});

const dealRanges = [
  { label: "Under Rs. 199", min: 0, max: 199 },
  { label: "Under Rs. 499", min: 0, max: 499 },
  { label: "Under Rs. 999", min: 0, max: 999 },
  { label: "Rs. 1000 - 1999", min: 1000, max: 1999 },
  { label: "Above Rs. 2000", min: 2000 }
];

const heroCategoryConfigs = [
  {
    id: "aesthetic-decor",
    match: ["aesthetic decor", "aesthetic-decor", "decor"],
    tabLabel: "Aesthetic Decor",
    title: "Aesthetic Decor",
    subtitle: "Fresh Stylish Picks",
    label: "Curated Home Styling Picks",
    priceText: "Rs. 199",
    bg: "from-[#fff2f7] via-white to-[#eaf2ff]",
    fallbackImage: "/products/studio/studio-lamp.jpg",
    highlights: ["Premium Quality", "Fast Delivery", "Trending Finds"]
  },
  {
    id: "best-sellers",
    match: ["best sellers", "best-sellers", "best seller"],
    tabLabel: "Best Sellers",
    title: "Best Sellers",
    subtitle: "Top Trending Products",
    label: "Most Loved Customer Picks",
    priceText: "Rs. 99",
    bg: "from-[#fff4fa] via-white to-[#e9f1ff]",
    fallbackImage: "/products/cute-panda.png",
    highlights: ["Top Rated", "Quick Delivery", "Trusted Quality"]
  },
  {
    id: "cooling-gadgets",
    match: ["cooling gadgets", "cooling-gadgets", "cooling"],
    tabLabel: "Cooling Gadgets",
    title: "Cooling Gadgets",
    subtitle: "Beat The Heat",
    label: "Stay Cool With Smart Essentials",
    priceText: "Rs. 149",
    bg: "from-[#e9f4ff] via-white to-[#f2f8ff]",
    fallbackImage: "/products/portable-mini-air.png",
    highlights: ["Portable Design", "Summer Ready", "Quick Delivery"]
  },
  {
    id: "cute-gifts",
    match: ["cute gifts", "cute-gifts", "gift"],
    tabLabel: "Cute Gifts",
    title: "Cute Gifts",
    subtitle: "Sweet Little Surprises",
    label: "Charming Picks For Every Occasion",
    priceText: "Rs. 99",
    bg: "from-[#fff0f5] via-white to-[#f6f1ff]",
    fallbackImage: "/products/panda-trending-banner.png",
    highlights: ["Gift Ready", "Budget Friendly", "Fast Shipping"]
  },
  {
    id: "drinkware",
    match: ["drinkware", "bottle", "tumbler"],
    tabLabel: "Drinkware",
    title: "Drinkware",
    subtitle: "Hydrate In Style",
    label: "Sip In Style Every Day",
    priceText: "Rs. 129",
    bg: "from-[#eef5ff] via-white to-[#f2f9ff]",
    fallbackImage: "/products/studio/studio-bottle.jpg",
    highlights: ["Leak Proof", "Trendy Styles", "Daily Essentials"]
  },
  {
    id: "kitchen-dining",
    match: ["kitchen & dining", "kitchen-dining", "dining"],
    tabLabel: "Kitchen & Dining",
    title: "Kitchen & Dining",
    subtitle: "Cook Serve Enjoy",
    label: "Modern Essentials For Every Meal",
    priceText: "Rs. 249",
    bg: "from-[#fff6f0] via-white to-[#eef4ff]",
    fallbackImage: "/products/flask-400ml.png",
    highlights: ["Everyday Utility", "Premium Finish", "Customer Favorites"]
  },
  {
    id: "kitchen-tools",
    match: ["kitchen tools", "kitchen-tools", "tools"],
    tabLabel: "Kitchen Tools",
    title: "Kitchen Tools",
    subtitle: "Chop Mix Prep",
    label: "Smart Tools For Easy Cooking",
    priceText: "Rs. 99",
    bg: "from-[#fff7f2] via-white to-[#edf3ff]",
    fallbackImage: "/products/panda-usb-charging.png",
    highlights: ["Easy To Use", "Daily Utility", "Best Value"]
  },
  {
    id: "lifestyle",
    match: ["lifestyle", "home", "daily"],
    tabLabel: "Lifestyle",
    title: "Lifestyle",
    subtitle: "Upgrade Everyday Living",
    label: "Daily Essentials With A Smart Twist",
    priceText: "Rs. 199",
    bg: "from-[#fff5ef] via-white to-[#edf3ff]",
    fallbackImage: "/products/studio/studio-fan.jpg",
    highlights: ["Trending Picks", "Useful Essentials", "Fast Delivery"]
  }
];

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[\s&_-]+/g, " ");
}

function buildHeroSlides(categories: any[], products: any[], banners: any[]): HeroSlide[] {
  if (banners.length) {
    return banners.map((banner) => {
      const buttonLink = banner.buttonLink || "/products";
      return {
        id: banner.id,
        image: banner.imageUrl,
        bg: "from-[#fff3f7] via-white to-[#e9f1ff]",
        title: banner.title || "RISJAS Collection",
        subtitle: banner.subtitle || "",
        label: banner.subtitle || "Featured Collection",
        buttonText: banner.buttonText || "Shop Now",
        buttonLink,
        fullImage: true
      };
    });
  }

  return heroCategoryConfigs.map((config) => {
    const category = categories.find((item) => {
      const categorySlug = normalize(item.slug || "");
      const categoryName = normalize(item.name || "");
      return config.match.some((token) => {
        const match = normalize(token);
        return categorySlug.includes(match) || categoryName.includes(match);
      });
    });

    const product = category
      ? products.find((item) => item.categoryId === category.id && item.images?.[0]?.imageUrl)
      : undefined;

    const buttonLink = category ? `/products?category=${encodeURIComponent(category.slug)}` : "/products";
    return {
      id: config.id,
      image: product?.images?.[0]?.imageUrl || config.fallbackImage,
      bg: config.bg,
      title: config.title,
      subtitle: config.subtitle,
      tabLabel: config.tabLabel,
      label: config.label,
      priceText: config.priceText,
      buttonText: "Shop Now",
      buttonLink,
      highlights: config.highlights
    };
  });
}

export default async function HomePage() {
  const [categories, featuredProducts, bestSellerProducts, latestProducts, banners] = await Promise.all([
    categoryService.listActive(),
    productService.list({ featured: true, sort: "newest" as any }),
    productService.list({ bestSeller: true, sort: "newest" as any }),
    productService.list({ sort: "newest" as any }),
    prisma.banner.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  const heroSlides = buildHeroSlides(categories, featuredProducts.length ? featuredProducts : latestProducts, banners);
  const topCollections = categories.slice(0, 12);
  const trendingProducts = (bestSellerProducts.length ? bestSellerProducts : latestProducts).slice(0, 10);
  const freshDrops = latestProducts.slice(0, 8);
  const pageSchema = createWebPageSchema({
    title: "Risjas Online Store | Trendy Gadgets & Lifestyle Picks",
    description:
      "Shop trendy gadgets, aesthetic decor, and daily-use essentials at Risjas with secure checkout, fast shipping, and reliable customer support across India.",
    path: "/"
  });

  return (
    <>
      <SeoJsonLd id="home-page-schema" schema={pageSchema} />
      <div className="bg-[#FCFCFC] pb-16">
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
    </>
  );
}
