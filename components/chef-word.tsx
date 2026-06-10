"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function ChefWord() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[60vh] min-h-112.5 overflow-hidden flex items-center justify-center"
    >
      <motion.div
        style={{ y }}
        className="absolute inset-0 w-full h-[124%] top-[-12%] z-0"
      >
        <Image
          src="/akira-takahashi.png"
          alt="Akira Takahashi portrait"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-[0.4] saturate-[0.85]"
        />
      </motion.div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center text-white flex flex-col items-center">
        <span className="font-semibold text-xs md:text-sm uppercase tracking-widest text-zinc-400 mb-2">
          Chef&apos;s Word
        </span>
        <h1 className="font-bold text-3xl md:text-5xl font-heading mb-4">
          Akira Takahashi
        </h1>
        <p className="font-light text-sm md:text-base leading-relaxed text-zinc-200 max-w-xl text-balance">
          Cooking demonstrations engage audiences through interactive learning.
          Hand-crafted pasta demonstrates the marriage of technique and
          tradition. Restaurant design influences dining atmosphere and customer
          experience. The perfect roast requires proper seasoning and
          temperature monitoring. Restaurant staff training maintains service
          standards and efficiency.
        </p>
      </div>
    </div>
  );
}
