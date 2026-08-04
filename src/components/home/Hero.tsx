/**
 * Full-bleed Centered Editorial Hero — Arranged per preferred layout structure.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroContent } from "@/constants/placeholders";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-brand-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <Image
          src={heroContent.image.src}
          alt={heroContent.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-75 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
      </div>

      {/* Centered Hero Content Block */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pt-20">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-brand-gold font-semibold"
        >
          {heroContent.eyebrow} — 2026 Collection
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold leading-tight tracking-tight text-white mb-8 max-w-4xl"
        >
          Affordable{" "}
          <span className="italic text-brand-gold">Elegance</span>,
          <br />
          Everyday Grace
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-sans text-sm md:text-base text-white/80 uppercase tracking-[0.18em] mb-12 max-w-lg mx-auto"
        >
          {heroContent.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/shop"
            className="group relative inline-block px-10 py-4 border border-brand-gold text-brand-gold font-mono text-xs tracking-[0.25em] uppercase overflow-hidden transition-all duration-500 hover:text-brand-black"
          >
            <span className="absolute inset-0 bg-brand-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 font-bold">Explore Collection</span>
          </Link>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-brand-gold to-transparent animate-pulse" />
      </div>
    </section>
  );
}
