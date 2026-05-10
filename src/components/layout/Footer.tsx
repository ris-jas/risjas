import Link from "next/link";
import Image from "next/image";

import { BRAND_NAME } from "@/lib/constants";
import { Youtube, Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

type FooterCategory = {
  id: string;
  name: string;
  slug: string;
};

const footerGroups = [
  {
    title: "QUICK LINKS",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Blogs", href: "#" }
    ]
  },
  {
    title: "POLICIES",
    links: [
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Return & Refund Policy", href: "/return-refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" }
    ]
  }
];

export default function Footer({ categories = [] }: { categories?: FooterCategory[] }) {
  return (
    <div className="px-0 sm:px-6 lg:px-8 pb-8 mt-16">
      <footer className="bg-navy sm:rounded-3xl overflow-hidden shadow-premium relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-10 pb-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 items-start">
            <div className="space-y-5">
              <Link href="/" className="inline-block group relative z-10">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-xl overflow-hidden transition-all duration-500 group-hover:scale-125 group-hover:shadow-premium">
                  <div className="relative h-[85px] w-[85px]">
                    <Image src="/imgs/Logo-Clean.png" alt="RISJAS Logo" fill sizes="100px" className="object-contain" />
                  </div>
                </div>
              </Link>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.3em] font-sans">Grand Store, LLP Retail</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-white text-[12.5px] leading-relaxed font-sans group cursor-pointer">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-red flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white transition-colors">Khasra No 11, Village Saidpur, Near Gurugram Toll, NH-8, Haryana</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white text-[12.5px] font-sans group cursor-pointer">
                    <Phone className="w-3.5 h-3.5 text-red flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white transition-colors">+91-6366 666 607</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white text-[12.5px] font-sans group cursor-pointer">
                    <Mail className="w-3.5 h-3.5 text-red flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white transition-colors">care@risjas.com</span>
                  </div>
                </div>
              </div>
            </div>

            {footerGroups.map((group) => (
              <div key={group.title} className="lg:pl-6">
                <p className="text-[11px] font-black tracking-[0.3em] text-white/40 mb-5 uppercase font-sans">{group.title}</p>
                <div className="space-y-2 text-[13.5px] text-white font-medium">
                  {group.links.map((item) => (
                    <Link key={item.label} href={item.href} className="block transition-all hover:text-red hover:translate-x-1 duration-300 font-sans">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div className="lg:pl-4">
              <p className="text-[11px] font-black tracking-[0.3em] text-white/40 mb-5 uppercase font-sans">Categories</p>
              <div className="space-y-2 text-[13.5px] text-white font-medium">
                {categories.length ? (
                  categories.slice(0, 8).map((item) => (
                    <Link key={item.id} href={`/products?category=${encodeURIComponent(item.slug)}`} className="block transition-all hover:text-red hover:translate-x-1 duration-300 font-sans">
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <Link href="/products" className="block transition-all hover:text-red hover:translate-x-1 duration-300 font-sans">
                    Browse Products
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/5 flex flex-col items-center">
            <p className="text-[10px] font-black tracking-[0.4em] text-white mb-4 uppercase font-sans">Connect With Us</p>
            <div className="flex gap-4">
              <a href="#" aria-label="YouTube" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-red hover:border-red transition-all duration-300 group">
                <Youtube className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-600 transition-all duration-300 group">
                <Instagram className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group">
                <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-black/20 border-t border-white/5 px-8 sm:px-12 py-4 relative z-10 text-center">
          <p className="text-[10px] text-white font-bold tracking-[0.2em] font-sans">
            (c) 2026 {BRAND_NAME.toUpperCase()}. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
