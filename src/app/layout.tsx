import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import type { Viewport } from "next";

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
  title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
  description: "Shop trendy daily-use products, gadgets, and lifestyle picks with COD and secure payments.",
  icons: {
    icon: "/imgs/Logo.png",
    shortcut: "/imgs/Logo.png",
    apple: "/imgs/Logo.png"
  },
  openGraph: {
    title: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
    description: "Premium and affordable products delivered fast across India.",
    siteName: BRAND_NAME,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`site-body ${inter.variable} ${outfit.variable}`}>{children}</body>
    </html>
  );
}
