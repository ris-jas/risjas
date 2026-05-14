import SeoJsonLd from "@/components/common/SeoJsonLd";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { BRAND_NAME } from "@/lib/constants";
import { siteUrl } from "@/lib/seo";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await categoryService.listActive();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: siteUrl,
    logo: `${siteUrl}/imgs/Logo-Circle.png`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@risjas.com"
    }
  };

  return (
    <>
      <SeoJsonLd id="store-website-schema" schema={[websiteSchema, organizationSchema]} />
      <Header categories={categories} />
      <main className="min-h-[75vh] pb-6 pt-[80px] lg:pt-[140px]">{children}</main>
      <Footer categories={categories} />
      <WhatsAppButton />
      <MobileNav />
    </>
  );
}

