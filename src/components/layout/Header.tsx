"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, UserRound, Menu, X, ChevronDown, Package, Heart, Sparkles } from "lucide-react";
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
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await response.json();
        setAuthUser(session?.user || null);
      } catch {
        setAuthUser(null);
      }
    };

    loadSession();
    window.addEventListener("focus", loadSession);
    return () => window.removeEventListener("focus", loadSession);
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
  const isAuthenticated = Boolean(authUser?.email);

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
      <div className="container-page flex items-center justify-between gap-4 lg:gap-6">
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
        <form onSubmit={runSearch} className="hidden lg:flex flex-1 items-center max-w-[680px] ml-5 xl:ml-8">
          <div className="flex w-full overflow-hidden rounded-full bg-slate-50 border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/10 transition-all duration-300">
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-6 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400" 
              placeholder="Search products..." 
            />
            <button type="submit" className="bg-navy px-6 text-white hover:bg-red transition-colors flex items-center justify-center">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-5 text-navy">
          {isAuthenticated ? (
            <Link href="/profile" className="hidden sm:flex flex-col items-center gap-1.5 hover:text-red transition-colors group">
              <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
                <UserRound className="h-4 w-4" />
              </div>
              <span className="text-[11px] uppercase tracking-[0.18em] font-bold">Profile</span>
            </Link>
          ) : (
            <div
              className="relative hidden sm:block"
              onMouseEnter={() => setIsGuestMenuOpen(true)}
              onMouseLeave={() => setIsGuestMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsGuestMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full px-1 py-1.5 text-navy transition-colors ${isGuestMenuOpen ? "text-red" : ""}`}
              >
                <div className={`relative rounded-full border border-slate-100 p-2.5 transition-all duration-300 ${isGuestMenuOpen ? "bg-red text-white" : "bg-slate-50"}`}>
                  <UserRound className="h-4 w-4" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] font-bold">Login</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isGuestMenuOpen ? "-rotate-180" : ""}`} />
              </button>

              <div className="absolute right-0 top-full z-50 h-3 w-72" />
              <div className={`absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_16px_30px_rgba(15,23,42,0.12)] transition-all duration-200 ${isGuestMenuOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0"}`}>
                <div className="flex items-center justify-between rounded-xl px-3 py-2">
                  <span className="text-sm text-slate-600">New customer?</span>
                  <Link href="/profile/signup" className="text-xl font-semibold text-[#3f4df2] hover:text-[#2f3de0]" onClick={() => setIsGuestMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>

                <div className="mt-1 space-y-1 rounded-xl bg-white p-1">
                  <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-navy" onClick={() => setIsGuestMenuOpen(false)}>
                    <UserRound className="h-4 w-4" />
                    <span className="text-base">My Profile</span>
                  </Link>
                  <Link href="/track-order" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-navy" onClick={() => setIsGuestMenuOpen(false)}>
                    <Package className="h-4 w-4" />
                    <span className="text-base">Orders</span>
                  </Link>
                  <Link href="/products" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-navy" onClick={() => setIsGuestMenuOpen(false)}>
                    <Heart className="h-4 w-4" />
                    <span className="text-base">Wishlist</span>
                  </Link>
                  <Link href="/products" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-700 transition-colors hover:bg-slate-50 hover:text-navy" onClick={() => setIsGuestMenuOpen(false)}>
                    <Sparkles className="h-4 w-4" />
                    <span className="text-base">Risjas Plus Zone</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Link href="/cart" className="flex flex-col items-center gap-1.5 hover:text-red transition-colors group">
            <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red px-1.5 text-[10px] font-black text-white ring-2 ring-white shadow-[0_4px_10px_rgba(217,82,112,0.38)] group-hover:bg-navy transition-colors">
                {cartCount}
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] font-bold hidden sm:block">Cart</span>
          </Link>
        </div>
      </div>

      {/* Categories Nav - Desktop Only */}
      <div className={`hidden lg:block transition-all duration-500 overflow-hidden ${
        isScrolled ? "h-10 opacity-100 border-t border-slate-100 mt-1" : "h-12 opacity-100 border-t border-slate-100 mt-2"
      }`}>
        <div className={`container-page flex items-center justify-center gap-8 text-xs font-bold uppercase tracking-[0.12em] text-slate-600 ${isScrolled ? "py-2.5" : "py-3"}`}>
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
