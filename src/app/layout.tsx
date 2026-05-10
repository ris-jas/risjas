import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import type { Viewport } from "next";
import Script from "next/script";

import "./globals.css";
import "./fallback.css";

import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#0d1633",
};

export const metadata: Metadata = {
  title: {
    default: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`
  },
  description: "Discover trendy lifestyle products, smart gadgets, and daily essentials at Risjas. Best prices, COD available, and fast shipping across India.",
  keywords: ["Risjas", "Risjas Online Store", "Trendy Gadgets", "Lifestyle Products India", "Risjas Ecommerce", "Daily Essentials"],
  authors: [{ name: "Risjas Team" }],
  creator: "Risjas",
  publisher: "Risjas",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/imgs/Logo.png",
    shortcut: "/imgs/Logo.png",
    apple: "/imgs/Logo.png"
  },
  openGraph: {
    title: `${BRAND_NAME} - Premium Lifestyle Store`,
    description: "Shop the latest trends in gadgets and lifestyle at Risjas. Quality products, affordable prices, and 100% secure checkout.",
    url: "https://risjas.com",
    siteName: BRAND_NAME,
    images: [
      {
        url: "/imgs/Logo.png",
        width: 800,
        height: 600,
        alt: "Risjas Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} - Trendy Lifestyle Store`,
    description: "Shop the latest trends in gadgets and lifestyle at Risjas.",
    images: ["/imgs/Logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`site-body ${inter.variable} ${outfit.variable}`}>
        {children}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

