import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { categoryService } from "@/services/category.service";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const categories = await categoryService.listActive();

  return (
    <>
      <Header categories={categories} />
      <main className="min-h-[75vh] pb-6 pt-[80px] lg:pt-[140px]">{children}</main>
      <Footer categories={categories} />
      <WhatsAppButton />
      <MobileNav />
    </>
  );
}

