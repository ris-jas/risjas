"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  id: string;
  image: string;
  bg: string;
  overlayClass?: string;
  title: string;
  subtitle: string;
  label: string;
  priceText?: string;
  discountText?: string;
  buttonText?: string;
  buttonLink?: string;
  highlights?: string[];
  fullImage?: boolean;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: "fallback-aesthetic",
    image: "/products/studio/studio-lamp.jpg",
    bg: "from-[#fff2f7] via-white to-[#eaf2ff]",
    overlayClass: "from-[#1a2f63]/66 via-[#1a2f63]/34 to-[#1a2f63]/10",
    title: "Aesthetic Decor",
    subtitle: "Fresh Stylish Picks",
    label: "Curated Home Styling Picks",
    priceText: "₹199",
    buttonText: "Shop Now",
    buttonLink: "/products",
    highlights: ["Premium Quality", "Fast Delivery", "Trending Finds"]
  },
  {
    id: "fallback-cooling",
    image: "/products/studio/studio-fan.jpg",
    bg: "from-[#ecf5ff] via-white to-[#f4f9ff]",
    overlayClass: "from-[#11365f]/60 via-[#11365f]/30 to-transparent",
    title: "Cooling Gadgets",
    subtitle: "Beat The Heat",
    label: "Stay Cool With Smart Essentials",
    priceText: "₹149",
    buttonText: "View Collection",
    buttonLink: "/products",
    highlights: ["Portable Design", "Summer Ready", "Quick Delivery"]
  }
];

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const allSlides = useMemo(() => (slides.length ? slides : fallbackSlides), [slides]);
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % allSlides.length);
    }, 7200);
    return () => clearInterval(timer);
  }, [allSlides.length]);

  useEffect(() => {
    const timers = allSlides.map((slide, slideIndex) =>
      window.setTimeout(() => {
        const image = new window.Image();
        image.src = slide.image;
      }, slideIndex * 350)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [allSlides]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  const active = allSlides[index];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative h-[430px] w-full sm:h-[560px] lg:h-[720px] xl:h-[760px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {active.fullImage ? (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    quality={82}
                    unoptimized
                    className="object-cover object-[62%_35%]"
                  />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-r ${active.overlayClass || "from-[#081b3f]/58 via-[#081b3f]/22 to-transparent"}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                <div className="container-page relative z-10 flex h-full items-center py-8 sm:py-12">
                  <motion.div
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="w-full max-w-[680px] text-white"
                  >
                    <p className="inline-flex items-center rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-md">
                      {active.label || "Risjas Store"}
                    </p>
                    <Link href={active.buttonLink || "/products"} className="block transition-colors hover:text-white/85">
                      <h1 className="mt-4 max-w-[650px] text-4xl font-black leading-[1.02] text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.42)] sm:text-6xl lg:text-7xl">Fresh New Trendy Collection</h1>
                    </Link>
                    <Link href={active.buttonLink || "/products"} className="block">
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-white/92 drop-shadow-[0_3px_12px_rgba(0,0,0,0.32)] transition-colors hover:text-white sm:text-lg">
                        {active.subtitle || "Trendy gadgets, cute gifts, decor and daily essentials - all in one place."}
                      </p>
                      <p className="mt-2 text-base font-bold text-white transition-colors hover:text-[#ffd5e4]">{active.title || "Best picks for everyday life."}</p>
                    </Link>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={active.buttonLink || "/products"}
                        className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-navy shadow-[0_16px_32px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffdce9]"
                      >
                        {active.buttonText || "Shop Now"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        href="/#top-collections"
                        className="inline-flex items-center rounded-full border border-white/35 bg-white/14 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_rgba(0,0,0,0.14)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/24"
                      >
                        Explore Categories
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </>
            ) : (
              <div className={`relative h-full w-full bg-gradient-to-br ${active.bg}`}>
                <div className="container-page grid h-full items-center gap-8 py-8 lg:grid-cols-2 lg:py-12">
                  <motion.div
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-2xl"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#c57a9a]">{active.label}</p>
                    <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-tight text-[#0f2f66] sm:text-6xl">
                      {active.title}
                    </h1>
                    <p className="mt-2 text-3xl font-semibold leading-tight text-[#173d78] sm:text-5xl">{active.subtitle}</p>
                    <div className="mt-6 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#f29dc0] to-[#74a4ff]" />

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Link
                        href={active.buttonLink || "/products"}
                        className="group inline-flex items-center gap-2 rounded-full bg-[#0f2f66] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(15,47,102,0.25)] transition duration-300 hover:-translate-y-0.5"
                      >
                        {active.buttonText || "Shop Now"}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                      <span className="rounded-full border border-[#204d92] bg-white/80 px-5 py-3 text-sm font-semibold text-[#163a73]">
                        Starting From {active.priceText || "₹99"}
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 20, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    className="relative hidden h-full min-h-[360px] lg:block"
                  >
                    <Image src={active.image} alt={active.title} fill sizes="50vw" className="object-contain drop-shadow-[0_34px_34px_rgba(20,44,100,0.2)]" />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-y-0 left-0 right-0 z-20 mx-auto flex max-w-[1400px] items-center justify-between px-3 sm:px-6">
          <button
            type="button"
            onClick={prevSlide}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#173d78] backdrop-blur transition hover:bg-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#173d78] backdrop-blur transition hover:bg-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
          {allSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-10 bg-[#f29dc0]" : "w-4 bg-white/70 hover:bg-white"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
