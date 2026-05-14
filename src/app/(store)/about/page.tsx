import type { Metadata } from "next";

import Reveal from "@/components/common/Reveal";
import SeoJsonLd from "@/components/common/SeoJsonLd";
import { createPageMetadata, createWebPageSchema } from "@/lib/seo";

const title = "About Risjas | Aesthetic Decor & Smart Utility Store";
const description =
  "Learn about Risjas, your trusted destination for aesthetic decor and smart utility products, crafted to elevate daily living with quality and style in India.";

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/about",
  keywords: ["about Risjas", "decor brand story", "smart utility products", "Indian lifestyle brand"]
});

export default function AboutPage() {
  const pageSchema = createWebPageSchema({ title, description, path: "/about", type: "AboutPage" });

  return (
    <>
      <SeoJsonLd id="about-page-schema" schema={pageSchema} />
      <div className="container-page section-space">
        <Reveal className="mx-auto max-w-5xl rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-navy/70">About RISJAS</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-navy sm:text-5xl">Boutique Utility. Everyday Beauty.</h1>
          <p className="mt-5 max-w-3xl text-base font-light leading-8 text-slate-500">
            RISJAS curates aesthetic home decor and practical smart gadgets designed for modern living.
            We focus on quality picks, clean design, and a premium shopping experience from browse to delivery.
          </p>
        </Reveal>
      </div>
    </>
  );
}
