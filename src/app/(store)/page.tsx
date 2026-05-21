import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Gift, Home, LampDesk, PackageSearch, Snowflake, Sparkle, UtensilsCrossed, Wine, Wrench } from "lucide-react";

import SeoJsonLd from "@/components/common/SeoJsonLd";
import HeroCarousel, { HeroSlide } from "@/components/home/HeroCarousel";
import ProductCard from "@/components/product/ProductCard";
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
  { label: "Under ₹199", min: 0, max: 199 },
  { label: "Under ₹499", min: 0, max: 499 },
  { label: "Under ₹999", min: 0, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "Above ₹2000", min: 2000 }
];

const collectionAccents = [
  "from-[#fff3f8] via-[#fffdfd] to-[#edf4ff] border-[#f2d9e6] hover:border-[#d89bb6]",
  "from-[#eef5ff] via-[#fcfeff] to-[#fff4f9] border-[#dae6f7] hover:border-[#9cb4d6]",
  "from-[#fff7ef] via-[#fffefe] to-[#f1f6ff] border-[#f3dfcc] hover:border-[#d8b18d]",
  "from-[#f4fff7] via-[#fdfefe] to-[#f2f5ff] border-[#dbeede] hover:border-[#9dc8ac]"
];

const heroCategoryConfigs = [
  {
    id: "aesthetic-decor",
    match: ["aesthetic decor", "aesthetic-decor", "decor"],
    tabLabel: "Aesthetic Decor",
    title: "Aesthetic Decor",
    subtitle: "Fresh Stylish Picks",
    label: "Curated Home Styling Picks",
    priceText: "₹199",
    bg: "from-[#fff2f7] via-white to-[#eaf2ff]",
    fallbackImage: "/hero/optimized/aesthetic-decor.png",
    overlayClass: "from-[#1a2f63]/66 via-[#1a2f63]/34 to-[#1a2f63]/10",
    highlights: ["Premium Quality", "Fast Delivery", "Trending Finds"]
  },
  {
    id: "best-sellers",
    match: ["best sellers", "best-sellers", "best seller"],
    tabLabel: "Best Sellers",
    title: "Best Sellers",
    subtitle: "Top Trending Products",
    label: "Most Loved Customer Picks",
    priceText: "₹99",
    bg: "from-[#fff4fa] via-white to-[#e9f1ff]",
    fallbackImage: "/hero/optimized/best-sellers.png",
    overlayClass: "from-[#3b2448]/58 via-[#3b2448]/28 to-transparent",
    highlights: ["Top Rated", "Quick Delivery", "Trusted Quality"]
  },
  {
    id: "cooling-gadgets",
    match: ["cooling gadgets", "cooling-gadgets", "cooling"],
    tabLabel: "Cooling Gadgets",
    title: "Cooling Gadgets",
    subtitle: "Beat The Heat",
    label: "Stay Cool With Smart Essentials",
    priceText: "₹149",
    bg: "from-[#e9f4ff] via-white to-[#f2f8ff]",
    fallbackImage: "/hero/optimized/cooling-gadgets.png",
    overlayClass: "from-[#11365f]/60 via-[#11365f]/30 to-transparent",
    highlights: ["Portable Design", "Summer Ready", "Quick Delivery"]
  },
  {
    id: "cute-gifts",
    match: ["cute gifts", "cute-gifts", "gift"],
    tabLabel: "Cute Gifts",
    title: "Cute Gifts",
    subtitle: "Sweet Little Surprises",
    label: "Charming Picks For Every Occasion",
    priceText: "₹99",
    bg: "from-[#fff0f5] via-white to-[#f6f1ff]",
    fallbackImage: "/hero/optimized/cute-gifts.png",
    overlayClass: "from-[#4e1f4a]/58 via-[#4e1f4a]/26 to-transparent",
    highlights: ["Gift Ready", "Budget Friendly", "Fast Shipping"]
  },
  {
    id: "drinkware",
    match: ["drinkware", "bottle", "tumbler"],
    tabLabel: "Drinkware",
    title: "Drinkware",
    subtitle: "Hydrate In Style",
    label: "Sip In Style Every Day",
    priceText: "₹129",
    bg: "from-[#eef5ff] via-white to-[#f2f9ff]",
    fallbackImage: "/hero/optimized/drinkware.png",
    overlayClass: "from-[#123761]/62 via-[#123761]/32 to-transparent",
    highlights: ["Leak Proof", "Trendy Styles", "Daily Essentials"]
  },
  {
    id: "kitchen-dining",
    match: ["kitchen & dining", "kitchen-dining", "dining"],
    tabLabel: "Kitchen & Dining",
    title: "Kitchen & Dining",
    subtitle: "Cook Serve Enjoy",
    label: "Modern Essentials For Every Meal",
    priceText: "₹249",
    bg: "from-[#fff6f0] via-white to-[#eef4ff]",
    fallbackImage: "/hero/optimized/kitchen-dining.png",
    overlayClass: "from-[#3f2a1d]/58 via-[#3f2a1d]/24 to-transparent",
    highlights: ["Everyday Utility", "Premium Finish", "Customer Favorites"]
  },
  {
    id: "kitchen-tools",
    match: ["kitchen tools", "kitchen-tools", "tools"],
    tabLabel: "Kitchen Tools",
    title: "Kitchen Tools",
    subtitle: "Chop Mix Prep",
    label: "Smart Tools For Easy Cooking",
    priceText: "₹99",
    bg: "from-[#fff7f2] via-white to-[#edf3ff]",
    fallbackImage: "/hero/optimized/kitchen-tools.png",
    overlayClass: "from-[#3f321f]/54 via-[#3f321f]/20 to-transparent",
    highlights: ["Easy To Use", "Daily Utility", "Best Value"]
  },
  {
    id: "lifestyle",
    match: ["lifestyle", "home", "daily"],
    tabLabel: "Lifestyle",
    title: "Lifestyle",
    subtitle: "Upgrade Everyday Living",
    label: "Daily Essentials With A Smart Twist",
    priceText: "₹199",
    bg: "from-[#fff5ef] via-white to-[#edf3ff]",
    fallbackImage: "/hero/optimized/lifestyle.png",
    overlayClass: "from-[#1f3150]/58 via-[#1f3150]/28 to-transparent",
    highlights: ["Trending Picks", "Useful Essentials", "Fast Delivery"]
  }
];

function normalize(value: string) {
  return value.toLowerCase().trim().replace(/[\s&_-]+/g, " ");
}

function getCollectionIcon(slug: string) {
  const key = slug.toLowerCase();
  if (key.includes("decor")) return LampDesk;
  if (key.includes("gift")) return Gift;
  if (key.includes("kitchen") && key.includes("tool")) return Wrench;
  if (key.includes("kitchen") || key.includes("dining")) return UtensilsCrossed;
  if (key.includes("cool")) return Snowflake;
  if (key.includes("drink")) return Wine;
  if (key.includes("lifestyle")) return Home;
  if (key.includes("best")) return Sparkle;
  return PackageSearch;
}

function buildHeroSlides(categories: any[]) {
  return heroCategoryConfigs.map((config) => {
    const category = categories.find((item) => {
      const categorySlug = normalize(item.slug || "");
      const categoryName = normalize(item.name || "");
      return config.match.some((token) => {
        const match = normalize(token);
        return categorySlug.includes(match) || categoryName.includes(match);
      });
    });

    const buttonLink = category
      ? `/products?category=${encodeURIComponent(category.slug)}`
      : `/products?category=${encodeURIComponent(config.id)}`;
    return {
      id: config.id,
      image: config.fallbackImage,
      bg: config.bg,
      title: config.title,
      subtitle: config.subtitle,
      tabLabel: config.tabLabel,
      label: config.label,
      priceText: config.priceText,
      buttonText: "Shop Now",
      buttonLink,
      highlights: config.highlights,
      overlayClass: config.overlayClass,
      fullImage: true
    };
  });
}

export default async function HomePage() {
  const [categories, bestSellerProducts, latestProducts] = await Promise.all([
    categoryService.listActive(),
    productService.list({ bestSeller: true, sort: "newest" as any }),
    productService.list({ sort: "newest" as any })
  ]);

  const heroSlides = buildHeroSlides(categories);
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

      <section id="top-collections" className="container-page pt-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e3e8f3] bg-white p-6 shadow-[0_8px_30px_rgba(15,32,67,0.06)] sm:p-8">
          <div className="pointer-events-none absolute -right-24 -top-16 h-56 w-56 rounded-full bg-[#e8f0ff] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[#ffe9f2] blur-3xl" />

          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#f0d6e1] bg-[#fff4f8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#9e5b72]">
                <Sparkles className="h-3.5 w-3.5" />
                Curated Picks
              </p>
              <h2 className="mt-3 text-4xl font-bold leading-tight text-navy sm:text-5xl">Top Collections</h2>
              <p className="mt-2 max-w-xl text-slate-600">Discover trending categories crafted for daily utility, gifting, and lifestyle upgrades.</p>
            </div>
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-navy bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red hover:border-red"
            >
              View All
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="relative mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topCollections.map((category, index) => (
              (() => {
                const Icon = getCollectionIcon(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className={`group relative min-h-[146px] overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(21,41,74,0.12)] ${collectionAccents[index % collectionAccents.length]}`}
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/50 blur-xl transition-all duration-300 group-hover:scale-125" />
                    <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/65 text-navy shadow-sm">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                    <p className="relative mt-3 text-base font-semibold text-navy transition-colors duration-300 group-hover:text-red line-clamp-2">{category.name}</p>
                    <div className="relative mt-4 inline-flex items-center gap-1 text-xs font-semibold text-navy/75 transition-all duration-300 group-hover:text-navy">
                      Explore
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })()
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
            <p className="mt-2 text-slate-600">Popular picks loved by shoppers.</p>
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
              <p className="mt-2 text-slate-600">Fresh arrivals just added to our store.</p>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-lg font-semibold text-navy">Fast Dispatch</p>
              <p className="mt-1 text-sm text-slate-600">Quick shipping on confirmed orders.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-lg font-semibold text-navy">Secure Payments</p>
              <p className="mt-1 text-sm text-slate-600">Trusted checkout with safe payment options.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-lg font-semibold text-navy">COD Available</p>
              <p className="mt-1 text-sm text-slate-600">Cash on Delivery for added convenience.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-lg font-semibold text-navy">Easy Returns</p>
              <p className="mt-1 text-sm text-slate-600">Simple support for return and replacement requests.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
