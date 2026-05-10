"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type HeroSlide = {
  id: string;
  image: string;
  bg: string;
  title: string;
  subtitle: string;
  label: string;
  priceText?: string;
  discountText?: string;
  buttonText?: string;
  buttonLink?: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: "fallback-kitchen",
    image: "/products/flask-400ml.png",
    bg: "from-[#F5DCD9] via-[#Fdf8f7] to-[#F5DCD9]",
    title: "Kitchen",
    subtitle: "Essentials",
    label: "Daily Luxury",
    priceText: "Rs. 99",
    discountText: "Up to 80%",
    buttonText: "Discover Collection",
    buttonLink: "/products"
  },
  {
    id: "fallback-cooling",
    image: "/products/portable-mini-air.png",
    bg: "from-slate-100 via-white to-slate-100",
    title: "Summer",
    subtitle: "Cooling",
    label: "Smart Gadgets",
    priceText: "Rs. 149",
    discountText: "Up to 60%",
    buttonText: "Shop Now",
    buttonLink: "/products"
  }
];

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const allSlides = useMemo(() => (slides.length ? slides : fallbackSlides), [slides]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % allSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [allSlides.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);

  const active = allSlides[index];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="h-[400px] sm:h-[550px] lg:h-[650px] w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${active.bg}`}
          >
            <div className="container-page w-full flex items-center justify-between relative z-10 h-full">
              <div className="w-full lg:w-1/2 flex flex-col justify-center h-full px-6 sm:px-10 lg:pl-0">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-[1px] w-10 bg-red"></span>
                    <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.35em] text-red">{active.label}</p>
                  </div>

                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-sans text-navy leading-[0.9] tracking-tighter font-bold">
                    {active.title}
                  </h2>
                  <h2 className="text-5xl sm:text-7xl lg:text-8xl font-sans text-red leading-[0.9] tracking-tighter mt-4 font-bold">
                    {active.subtitle}
                  </h2>

                  <div className="mt-10 sm:mt-14 flex items-center gap-8">
                    <Link
                      href={active.buttonLink || "/products"}
                      className="group relative overflow-hidden bg-navy px-10 py-4 sm:px-12 sm:py-5 rounded-full text-xs font-black tracking-widest uppercase text-white shadow-premium transition-all duration-500"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {active.buttonText || "Discover Collection"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-red translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </Link>

                    <div className="hidden sm:flex flex-col border-l border-navy/10 pl-8">
                      <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Starting from</span>
                      <span className="text-2xl font-sans font-bold text-navy">{active.priceText || "Rs. 99"}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="hidden lg:flex w-1/2 h-full relative items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.9, ease: "circOut" }}
                  className="relative w-[85%] h-[85%] z-10"
                >
                  <Image src={active.image} alt={active.title} fill sizes="50vw" className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]" priority />
                </motion.div>

                <div className="absolute top-1/4 right-0 w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-full shadow-premium flex flex-col items-center justify-center border border-slate-50 z-20">
                  <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Offer</span>
                  <span className="text-xl sm:text-2xl font-sans font-black text-red text-center px-2">{active.discountText || "Best Deal"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 right-10 z-30 flex gap-3">
          <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-navy/10 bg-white/60 hover:bg-white flex items-center justify-center text-navy transition-all duration-300 backdrop-blur-sm shadow-sm" aria-label="Previous slide">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-navy/10 bg-white/60 hover:bg-white flex items-center justify-center text-navy transition-all duration-300 backdrop-blur-sm shadow-sm" aria-label="Next slide">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {allSlides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setIndex(i)}
              className={`h-1 transition-all duration-500 rounded-full ${index === i ? "w-10 bg-red" : "w-4 bg-navy/20 hover:bg-navy/40"}`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}
