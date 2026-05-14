import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com";
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    })
  ]);

  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/shipping-policy",
    "/return-refund-policy",
    "/privacy-policy",
    "/terms-conditions"
  ];

  const staticMap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  const productMap = products.map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt
    }));

  const categoryMap = categories.map((category) => ({
    url: `${siteUrl}/products?category=${encodeURIComponent(category.slug)}`,
    lastModified: category.updatedAt
  }));

  return [...staticMap, ...productMap, ...categoryMap];
}
