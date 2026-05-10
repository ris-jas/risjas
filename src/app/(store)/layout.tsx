import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[75vh] pb-6 pt-0 md:pb-0">{children}</main>
      <Footer />
      <WhatsAppButton />
      <MobileNav />
    </>
  );
}

