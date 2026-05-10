"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type HeaderCategory = {
  id: string;
  name: string;
  slug: string;
};

export default function Header({ categories = [] }: { categories?: HeaderCategory[] }) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const result = await response.json();
        if (!result?.success) return;
        const count = (result.data?.items || []).reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };
    loadCart();
    window.addEventListener("risjas:cart-updated", loadCart as EventListener);
    window.addEventListener("focus", loadCart);
    return () => {
      window.removeEventListener("risjas:cart-updated", loadCart as EventListener);
      window.removeEventListener("focus", loadCart);
    };
  }, []);

  const navItems = categories.slice(0, 8);

  const runSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-soft py-2" 
          : "bg-white py-4"
      }`}
    >
      <div className="container-page flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden p-2 text-navy"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 group">
          <div className={`relative transition-all duration-500 ${
            isScrolled ? "h-10 w-[120px]" : "h-12 w-[140px] sm:h-20 sm:w-[220px]"
          }`}>
            <Image 
              src="/imgs/Logo-Clean.png" 
              alt="RISJAS Logo" 
              fill 
              sizes="(max-width: 640px) 140px, 220px"
              className="object-contain scale-[1.25] group-hover:scale-[1.35] transition-transform duration-500" 
              priority 
            />
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={runSearch} className="hidden lg:flex flex-1 items-center max-w-[500px] ml-8">
          <div className="flex w-full overflow-hidden rounded-full bg-slate-50 border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/5 transition-all duration-300">
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-6 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" 
              placeholder="Search products..." 
            />
            <button type="submit" className="bg-navy px-6 text-white hover:bg-navy-soft transition-colors flex items-center justify-center">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-6 text-navy">
          <Link href="/track-order" className="hidden sm:flex flex-col items-center gap-1 hover:text-red transition-colors group">
            <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <UserRound className="h-4 w-4" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Track</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-red transition-colors group">
            <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold text-white shadow-sm group-hover:bg-navy transition-colors">
                {cartCount}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* Categories Nav - Desktop Only */}
      <div className={`hidden lg:block transition-all duration-500 overflow-hidden ${
        isScrolled ? "h-0 opacity-0" : "h-12 opacity-100 border-t border-slate-100 mt-2"
      }`}>
        <div className="container-page flex items-center justify-center gap-10 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {navItems.map((item) => (
            <Link 
              key={item.id}
              href={`/products?category=${encodeURIComponent(item.slug)}`}
              className="relative transition-all hover:text-red group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-red transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 top-[64px] bg-white z-40 lg:hidden overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <form className="relative" onSubmit={runSearch}>
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50 px-6 py-3 rounded-full text-sm outline-none border border-slate-200" 
                  placeholder="Search products..." 
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </form>
              <div className="space-y-4">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Categories</p>
                {navItems.map((item) => (
                  <Link 
                    key={item.id}
                    href={`/products?category=${encodeURIComponent(item.slug)}`}
                    className="block py-2 text-lg font-medium text-navy border-b border-slate-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
