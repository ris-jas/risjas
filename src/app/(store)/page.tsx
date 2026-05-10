"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Sparkles, Truck, Star, ArrowRight, Eye, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

import HeroCarousel from "@/components/home/HeroCarousel";

const categories = [
  { title: "Smart Accessories", image: "/products/portable-mini-air.png", href: "/products" },
  { title: "Bathroom", image: "/products/studio/studio-lamp.jpg", href: "/products" },
  { title: "Deal of the Day", image: "/products/flask-400ml.png", href: "/products" },
  { title: "Kitchen", image: "/products/portable-mini-air.png", href: "/products" },
  { title: "Small Electronics", image: "/products/studio/studio-lamp.jpg", href: "/products" },
  { title: "Stationary", image: "/products/flask-400ml.png", href: "/products" },
  { title: "Jewellery", image: "/products/portable-mini-air.png", href: "/products" },
  { title: "Gifts", image: "/products/studio/studio-lamp.jpg", href: "/products" },
  { title: "Electronics", image: "/products/flask-400ml.png", href: "/products" },
  { title: "Home Decor", image: "/products/studio/studio-lamp.jpg", href: "/products" },
  { title: "Care & Beauty", image: "/products/portable-mini-air.png", href: "/products" },
  { title: "Health & Beauty", image: "/products/flask-400ml.png", href: "/products" }
];

const priceDeals = [
  { title: "UNDER ₹9", bg: "bg-navy" },
  { title: "UNDER ₹29", bg: "bg-navy" },
  { title: "UNDER ₹49", bg: "bg-navy" },
  { title: "UNDER ₹149", bg: "bg-navy" },
  { title: "UNDER ₹249", bg: "bg-navy" },
  { title: "UNDER ₹349", bg: "bg-navy" },
  { title: "UNDER ₹449", bg: "bg-navy" },
  { title: "UNDER ₹499", bg: "bg-navy" },
  { title: "UNDER ₹999", bg: "bg-navy" },
  { title: "ABOVE ₹1000", bg: "bg-navy" }
];

const sellingFastProducts = [
  { id: 1, name: "Panda Night Lamp", image: "/products/studio/studio-lamp.jpg", price: "Rs. 149.00", original: "Rs. 499.00", badge: "HOT SALE" },
  { id: 2, name: "Mist Fan Portable", image: "/products/portable-mini-air.png", price: "Rs. 249.00", original: "Rs. 899.00", badge: "NEW" },
  { id: 3, name: "Kitchen Flask 400ml", image: "/products/flask-400ml.png", price: "Rs. 99.00", original: "Rs. 299.00", badge: "TRENDING" },
  { id: 4, name: "Silicon Kitchen Tool", image: "/products/portable-mini-air.png", price: "Rs. 149.00", original: "Rs. 399.00", badge: "HOT SALE" },
  { id: 5, name: "Electric Chopper", image: "/products/studio/studio-lamp.jpg", price: "Rs. 349.00", original: "Rs. 999.00", badge: "TOP RATED" }
];

const renderSectionTitle = (title: string, subtitle?: string) => (
  <div className="flex flex-col items-center justify-center mb-12">
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 60 }}
      viewport={{ once: true }}
      className="h-[2px] bg-red mb-4"
    ></motion.div>
    <h2 className="text-center text-3xl sm:text-4xl font-sans text-navy px-6 tracking-tight font-bold">{title}</h2>
    {subtitle && <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-3">{subtitle}</p>}
  </div>
);

export default function HomePage() {
  return (
    <div className="bg-[#FCFCFC] pb-16 font-sans pt-[80px] lg:pt-[128px]">
      <HeroCarousel />

      {/* Featured Categories Grid */}
      <section id="top-collections" className="container-page pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          {renderSectionTitle("Top Collections", "Curated for you")}
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-10">
            {categories.map((item, idx) => (
              <motion.div 
                key={item.title + idx}
                whileHover={{ y: -8 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <Link href={item.href} className="relative h-[100px] w-[100px] sm:h-[120px] sm:w-[120px] mb-4">
                  <div className="absolute inset-0 bg-white rounded-full shadow-soft border border-slate-100 group-hover:border-red/20 group-hover:shadow-premium transition-all duration-500"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-full p-4 flex items-center justify-center">
                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100px, 120px" className="object-contain p-4 group-hover:scale-110 transition duration-500" />
                  </div>
                </Link>
                <p className="text-[11px] sm:text-xs font-bold text-navy/80 tracking-wide uppercase group-hover:text-red transition leading-tight max-w-[100px]">{item.title}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Range Section with Glass Cards */}
      <section id="explore-range" className="container-page pt-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}>
          {renderSectionTitle("Explore Our Range", "Budget friendly picks")}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {priceDeals.map((deal, idx) => (
              <Link 
                key={deal.title + idx} 
                href="/products" 
                className="relative h-[80px] sm:h-[100px] rounded-xl overflow-hidden flex items-center justify-center bg-navy hover:bg-red transition-all duration-500 shadow-soft hover:shadow-premium group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-50"></div>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                <p className="text-white font-bold text-sm sm:text-lg tracking-[0.15em] z-10">{deal.title}</p>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-500 group-hover:w-full"></div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Visual Product Showcase */}
      <div className="grid lg:grid-cols-2 gap-8 container-page pt-24">
        <section id="kitchen-accessories">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-soft border border-slate-50 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
              <Sparkles className="w-32 h-32 text-navy" />
            </div>
            <h3 className="text-2xl font-sans text-navy font-bold mb-6">Kitchen Accessories</h3>
            <div className="grid grid-cols-3 gap-4">
               {Array(3).fill(null).map((_, i) => (
                 <Link href="/products" key={i} className="group/item relative h-40 bg-slate-50 rounded-2xl overflow-hidden">
                    <Image src="/products/flask-400ml.png" alt="Kitchen" fill sizes="(max-width: 768px) 33vw, 20vw" className="object-contain p-4 group-hover/item:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-navy/0 group-hover/item:bg-navy/40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                      <Eye className="text-white w-6 h-6" />
                    </div>
                 </Link>
               ))}
            </div>
            <Link href="/products" className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red hover:gap-4 transition-all">
              Discover Collection <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </section>

        <section id="home-essentials">
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-soft border border-slate-50 overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition">
              <Star className="w-32 h-32 text-navy" />
            </div>
            <h3 className="text-2xl font-sans text-navy font-bold mb-6">Home Essentials</h3>
            <div className="grid grid-cols-3 gap-4">
               {Array(3).fill(null).map((_, i) => (
                 <Link href="/products" key={i} className="group/item relative h-40 bg-slate-50 rounded-2xl overflow-hidden">
                    <Image src="/products/studio/studio-lamp.jpg" alt="Home" fill sizes="(max-width: 768px) 33vw, 20vw" className="object-contain p-4 group-hover/item:scale-110 transition duration-500" />
                    <div className="absolute inset-0 bg-navy/0 group-hover/item:bg-navy/40 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all duration-300">
                      <Eye className="text-white w-6 h-6" />
                    </div>
                 </Link>
               ))}
            </div>
            <Link href="/products" className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red hover:gap-4 transition-all">
              Discover Collection <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        </section>
      </div>

      {/* Trending Now Section with Premium Cards */}
      <section id="trending-now" className="container-page pt-28">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl font-sans text-navy font-bold">Trending Now</h2>
              <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-2">What everyone is buying</p>
            </div>
            <Link href="/products" className="group flex items-center gap-3 bg-white border border-slate-200 px-8 py-3 rounded-full text-[10px] font-black tracking-widest uppercase text-navy hover:bg-navy hover:text-white transition-all duration-500 shadow-sm hover:shadow-md">
              View All Products <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {sellingFastProducts.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white flex flex-col rounded-3xl overflow-hidden shadow-soft hover:shadow-premium transition-all duration-500 border border-slate-50 relative"
              >
                <div className="absolute top-3 left-3 z-20">
                  <span className="bg-red text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg">{item.badge}</span>
                </div>
                
                <div className="relative aspect-[4/5] bg-[#F9FAFB] overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover group-hover:scale-110 transition duration-700 p-2 mix-blend-multiply" 
                  />
                  
                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-navy/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                    <button className="bg-white text-navy p-3 rounded-full hover:bg-red hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-500">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="bg-navy text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red transition-colors transform translate-y-4 group-hover:translate-y-0 duration-700">
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 bg-white">
                  <p className="text-sm text-navy font-bold line-clamp-1 mb-2 group-hover:text-red transition-colors duration-300">{item.name}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-red font-black text-base">{item.price}</span>
                    <span className="text-slate-300 text-xs line-through">{item.original}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-16">
             <Link href="/products" className="relative group overflow-hidden bg-navy px-12 py-4 rounded-full text-[10px] font-black tracking-widest uppercase text-white shadow-xl hover:shadow-premium transition-all duration-500">
                <span className="relative z-10">Load More Products</span>
                <div className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             </Link>
          </div>
        </motion.div>
      </section>

      {/* Trust Badges Section */}
      <section className="container-page pt-24">
        <div className="bg-navy rounded-[3rem] p-10 sm:p-16 grid sm:grid-cols-3 gap-10 relative overflow-hidden shadow-premium">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-red group-hover:border-red transition-all duration-500">
              <Truck className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-sans text-xl font-bold mb-2">Fast Delivery</h4>
            <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Secure and lightning fast shipping across India.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-red group-hover:border-red transition-all duration-500">
              <ShieldCheck className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-sans text-xl font-bold mb-2">Secure Payment</h4>
            <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">100% secure payment gateways and COD available.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-red group-hover:border-red transition-all duration-500">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h4 className="text-white font-sans text-xl font-bold mb-2">Premium Quality</h4>
            <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Handpicked products that guarantee satisfaction.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
