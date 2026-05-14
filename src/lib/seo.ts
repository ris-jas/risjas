import type { Metadata } from "next";

import { BRAND_NAME } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://risjas.com";
const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESCRIPTION_MIN = 140;
const DESCRIPTION_MAX = 150;

const BASE_KEYWORDS = [
  "Risjas",
  "online shopping India",
  "lifestyle products",
  "trending gadgets",
  "aesthetic decor",
  "daily essentials"
];

function trimToMaxLength(value: string, max: number): string {
  if (value.length <= max) return value;
  const slice = value.slice(0, max - 3).trimEnd();
  return `${slice}...`;
}

function ensureTitleLength(title: string): string {
  const base = title.trim();
  if (base.length > TITLE_MAX) return trimToMaxLength(base, TITLE_MAX);
  if (base.length >= TITLE_MIN) return base;

  const suffix = " | Risjas Online Store";
  const withSuffix = `${base}${suffix}`;
  if (withSuffix.length <= TITLE_MAX) return withSuffix;

  return trimToMaxLength(withSuffix, TITLE_MAX);
}

function ensureDescriptionLength(description: string): string {
  const base = description.trim();
  if (base.length > DESCRIPTION_MAX) return trimToMaxLength(base, DESCRIPTION_MAX);
  if (base.length >= DESCRIPTION_MIN) return base;

  const filler = " Shop confidently with secure checkout and trusted support across India.";
  const withFiller = `${base}${filler}`;
  if (withFiller.length <= DESCRIPTION_MAX) return withFiller;

  return trimToMaxLength(withFiller, DESCRIPTION_MAX);
}

function fullUrl(path: string): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  normalizeTitle = true
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  normalizeTitle?: boolean;
}): Metadata {
  const safeTitle = normalizeTitle ? ensureTitleLength(title) : title.trim();
  const safeDescription = ensureDescriptionLength(description);
  const canonicalUrl = fullUrl(path);

  return {
    title: { absolute: safeTitle },
    description: safeDescription,
    keywords: [...new Set([...BASE_KEYWORDS, ...keywords])],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url: canonicalUrl,
      siteName: BRAND_NAME,
      type: "website",
      images: [{ url: "/imgs/Logo.png", width: 1200, height: 630, alt: `${BRAND_NAME} banner` }]
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: ["/imgs/Logo.png"]
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
}

function buildProductTitle(name: string): string {
  const fullName = name.trim();
  if (fullName.length >= TITLE_MIN && fullName.length <= TITLE_MAX) return fullName;
  if (fullName.length > TITLE_MAX) return fullName;

  const suffixOptions = [
    " | Buy Online at Risjas",
    " | Risjas Official Store",
    " | Risjas Store",
    " | Risjas"
  ];

  let bestTitle = fullName;

  for (const suffix of suffixOptions) {
    const candidate = `${fullName}${suffix}`;
    if (candidate.length >= TITLE_MIN && candidate.length <= TITLE_MAX) {
      return candidate;
    }
    if (candidate.length <= TITLE_MAX && candidate.length > bestTitle.length) {
      bestTitle = candidate;
    }
  }

  return bestTitle;
}

export function createWebPageSchema({
  title,
  description,
  path,
  type = "WebPage"
}: {
  title: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage" | "FAQPage";
}) {
  const safeTitle = ensureTitleLength(title);
  const safeDescription = ensureDescriptionLength(description);
  const url = fullUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: safeTitle,
    description: safeDescription,
    url,
    inLanguage: "en-IN",
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: SITE_URL
    }
  };
}

export function createProductMetadata({
  name,
  shortDescription,
  slug
}: {
  name: string;
  shortDescription?: string | null;
  slug: string;
}): Metadata {
  const title = buildProductTitle(name);

  const fallbackDescription = `${name} at Risjas with latest pricing, key features, verified product details, secure checkout, and fast shipping support for customers across India.`;

  return createPageMetadata({
    title,
    description: shortDescription?.trim() || fallbackDescription,
    path: `/product/${slug}`,
    keywords: [name, "buy online", "product details", "best price"],
    normalizeTitle: false
  });
}

export function createProductSchema({
  name,
  description,
  slug,
  image,
  price,
  currency = "INR",
  availability = "https://schema.org/InStock"
}: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  price: number;
  currency?: string;
  availability?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: ensureDescriptionLength(description),
    image: image ? [image] : [],
    url: fullUrl(`/product/${slug}`),
    brand: {
      "@type": "Brand",
      name: BRAND_NAME
    },
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: Number(price).toFixed(2),
      availability
    }
  };
}

export const siteUrl = SITE_URL;
