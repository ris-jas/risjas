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
    title: "Aesthetic Decor",
    subtitle: "Fresh Stylish Picks",
    label: "Curated Home Styling Picks",
    priceText: "Rs. 199",
    buttonText: "Shop Now",
    buttonLink: "/products",
    highlights: ["Premium Quality", "Fast Delivery", "Trending Finds"]
  },
  {
    id: "fallback-cooling",
    image: "/products/studio/studio-fan.jpg",
    bg: "from-[#ecf5ff] via-white to-[#f4f9ff]",
    title: "Cooling Gadgets",
    subtitle: "Beat The Heat",
    label: "Stay Cool With Smart Essentials",
    priceText: "Rs. 149",
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
    }, 6200);
    return () => clearInterval(timer);
  }, [allSlides.length]);

  const nextSlide = () => setIndex((prev) => (prev + 1) % allSlides.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  const active = allSlides[index];

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="relative h-[360px] w-full sm:h-[480px] lg:h-[620px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {active.fullImage ? (
              <>
                <motion.div
                  animate={reducedMotion ? undefined : { scale: [1, 1.02, 1] }}
                  transition={{ duration: 8.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={active.image}
                    alt={active.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b234f]/8 via-transparent to-transparent" />
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
                        Starting From {active.priceText || "Rs. 99"}
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
