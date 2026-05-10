import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com";
  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true, isActive: true } });

  const staticRoutes = [
    "",
    "/products",
    "/about",
    "/contact",
    "/shipping-policy",
    "/return-refund-policy",
    "/privacy-policy",
    "/terms-conditions",
    "/track-order"
  ];

  const staticMap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  const productMap = products
    .filter((p) => p.isActive)
    .map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.updatedAt
    }));

  return [...staticMap, ...productMap];
}
