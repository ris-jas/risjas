"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/products/flask-400ml.png",
    bg: "from-[#F5DCD9] via-[#Fdf8f7] to-[#F5DCD9]",
    title: "KITCHEN",
    subtitle: "ESSENTIALS",
    discount: "80%",
    label: "DAILY LUXURY",
    accent: "bg-red/10"
  },
  {
    image: "/products/portable-mini-air.png",
    bg: "from-slate-100 via-white to-slate-100",
    title: "SUMMER",
    subtitle: "COOLING",
    discount: "60%",
    label: "SMART GADGETS",
    accent: "bg-blue-50"
  },
  {
    image: "/products/studio/studio-lamp.jpg",
    bg: "from-[#fdf8f6] via-[#f4ebe6] to-[#fdf8f6]",
    title: "HOME",
    subtitle: "DECOR",
    discount: "50%",
    label: "AESTHETICS",
    accent: "bg-[#D98A81]/5"
  }
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

  const active = slides[index];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="h-[400px] sm:h-[550px] lg:h-[650px] w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${active.bg}`}
          >
            {/* Decor Elements */}
            <div className="absolute inset-0 overflow-hidden">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 0.1 }}
                 transition={{ duration: 2 }}
                 className={`absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full ${active.accent} blur-3xl`}
               ></motion.div>
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 0.05 }}
                 transition={{ duration: 2.5 }}
                 className={`absolute -left-20 -bottom-20 w-[400px] h-[400px] rounded-full ${active.accent} blur-3xl`}
               ></motion.div>
            </div>

            <div className="container-page w-full flex items-center justify-between relative z-10 h-full">
              <div className="w-full lg:w-1/2 flex flex-col justify-center h-full px-6 sm:px-10 lg:pl-0">
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-[1px] w-10 bg-red"></span>
                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-red">{active.label}</p>
                  </div>
                  
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-sans text-navy leading-[0.9] tracking-tighter font-bold">
                    {active.title}
                  </h2>
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-sans text-red leading-[0.9] tracking-tighter mt-4 font-bold">
                    {active.subtitle}
                  </h2>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 sm:mt-16 flex items-center gap-8"
                  >
                    <Link href="/products" className="group relative overflow-hidden bg-navy px-10 py-4 sm:px-12 sm:py-5 rounded-full text-xs font-black tracking-widest uppercase text-white shadow-premium transition-all duration-500">
                      <span className="relative z-10 flex items-center gap-2">
                        Discover Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </Link>
                    
                    <div className="hidden sm:flex flex-col border-l border-navy/10 pl-8">
                       <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Starting from</span>
                       <span className="text-2xl font-sans font-bold text-navy">Rs. 99.00</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
                  className="relative w-[85%] h-[85%] z-10"
                >
                  <Image 
                    src={active.image} 
                    alt={active.title} 
                    fill 
                    sizes="50vw"
                    className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] mix-blend-multiply" 
                    priority 
                  />
                </motion.div>
                
                {/* Sale Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="absolute top-1/4 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-premium flex flex-col items-center justify-center border border-slate-50 z-20"
                >
                  <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Save</span>
                  <span className="text-3xl sm:text-4xl font-sans font-black text-red">80%</span>
                  <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Off</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 right-10 z-30 flex gap-3">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-navy/10 bg-white/50 hover:bg-white flex items-center justify-center text-navy transition-all duration-300 backdrop-blur-sm shadow-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-navy/10 bg-white/50 hover:bg-white flex items-center justify-center text-navy transition-all duration-300 backdrop-blur-sm shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${index === i ? "w-10 bg-red" : "w-4 bg-navy/10 hover:bg-navy/30"}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
