"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Search, ShoppingBag, UserRound, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "JUST ARRIVED", 
    "SMART ACCESSORIES", 
    "BATHROOM", 
    "DEAL OF THE DAY", 
    "KITCHEN", 
    "SMALL ELECTRONICS", 
    "STATIONARY", 
    "JEWELLERY", 
    "GIFTS"
  ];

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
            isScrolled ? "h-12 w-[140px]" : "h-16 w-[180px] sm:h-20 sm:w-[220px]"
          }`}>
            <Image 
              src="/imgs/Logo-Clean.png" 
              alt="RISJAS Logo" 
              fill 
              sizes="200px"
              className="object-contain scale-[1.35] group-hover:scale-[1.45] transition-transform duration-500" 
              priority 
            />
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 items-center max-w-[500px] ml-8">
          <div className="flex w-full overflow-hidden rounded-full bg-slate-50 border border-slate-200 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/5 transition-all duration-300">
            <input 
              className="w-full bg-transparent px-6 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" 
              placeholder="Search products..." 
            />
            <button className="bg-navy px-6 text-white hover:bg-navy-soft transition-colors flex items-center justify-center">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-6 text-navy">
          <Link href="/track-order" className="hidden sm:flex flex-col items-center gap-1 hover:text-red transition-colors group">
            <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <UserRound className="h-4 w-4" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold">Login</span>
          </Link>
          
          <Link href="/wishlist" className="flex flex-col items-center gap-1 hover:text-red transition-colors group">
             <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] font-bold text-white shadow-sm group-hover:bg-navy transition-colors">0</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">Wishlist</span>
          </Link>

          <Link href="/cart" className="flex flex-col items-center gap-1 hover:text-red transition-colors group">
            <div className="relative p-2.5 bg-slate-50 rounded-full group-hover:bg-red group-hover:text-white transition-all duration-300 border border-slate-100">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] font-bold text-white shadow-sm group-hover:bg-navy transition-colors">0</span>
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
          {navItems.slice(0, 8).map((item) => (
            <Link 
              key={item} 
              href={`/products?category=${item.toLowerCase()}`} 
              className="relative transition-all hover:text-red group"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-red transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <Link href="/products" className="text-red font-black">MORE</Link>
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
              <div className="relative">
                <input 
                  className="w-full bg-slate-50 px-6 py-3 rounded-full text-sm outline-none border border-slate-200" 
                  placeholder="Search products..." 
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Categories</p>
                {navItems.map((item) => (
                  <Link 
                    key={item} 
                    href={`/products?category=${item.toLowerCase()}`} 
                    className="block py-2 text-lg font-medium text-navy border-b border-slate-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
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
