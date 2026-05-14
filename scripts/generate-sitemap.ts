import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function main() {
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

  const urls: Array<{ loc: string; lastmod: string }> = [
    ...staticRoutes.map((route) => ({
      loc: `${siteUrl}${route}`,
      lastmod: new Date().toISOString()
    })),
    ...products.map((product) => ({
      loc: `${siteUrl}/product/${encodeURIComponent(product.slug)}`,
      lastmod: product.updatedAt.toISOString()
    })),
    ...categories.map((category) => ({
      loc: `${siteUrl}/products?category=${encodeURIComponent(category.slug)}`,
      lastmod: category.updatedAt.toISOString()
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  const outputPath = resolve(process.cwd(), "public", "sitemap.xml");
  writeFileSync(outputPath, xml, "utf8");
  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${urls.length}`);
}

main()
  .catch((error) => {
    console.error("Failed to generate sitemap:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
