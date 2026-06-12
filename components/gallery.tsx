"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  gridClass: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "/gallery/outside.png",
    alt: "Viora restaurant exterior during dusk showing clean minimal architecture with warm illumination.",
    title: "The Estate",
    description: "Architectural minimalism blended with natural landscape.",
    gridClass: "md:col-span-8 h-[300px] md:h-[480px]",
  },
  {
    id: "g2",
    src: "/gallery/interior.png",
    alt: "Elegant dining room inside Viora featuring marble tables, ambient lighting, and rich wood accents.",
    title: "The Dining Hall",
    description: "Warm marble, dark wood, and delicate ambient lights.",
    gridClass: "md:col-span-3 h-[250px] md:h-[350px]",
  },
  {
    id: "g3",
    src: "/gallery/chef-at-work.png",
    alt: "Chef cooking in high-end restaurant kitchen with fire and precision.",
    title: "Culinary Craft",
    description: "Wok fire and wood smoke treated with heritage and precision.",
    gridClass: "md:col-span-3 h-[250px] md:h-[350px]",
  },
  {
    id: "g4",
    src: "/gallery/special.png",
    alt: "Beautifully plated seasonal dish on textured ceramic plate.",
    title: "Seasonal Creation",
    description: "Elevated delicacies crafted from local harvests.",
    gridClass: "md:col-span-3 h-[250px] md:h-[350px]",
  },
  {
    id: "g5",
    src: "/gallery/family-photo.png",
    alt: "Guests gathered around a dining table laughing and enjoying food.",
    title: "Our Community",
    description: "Creating moments that linger long after the evening ends.",
    gridClass: "md:col-span-3 h-[250px] md:h-[350px]",
  },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) =>
          prev !== null ? (prev + 1) % galleryItems.length : null,
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) =>
          prev !== null
            ? (prev - 1 + galleryItems.length) % galleryItems.length
            : null,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const activeItem =
    lightboxIndex !== null ? galleryItems[lightboxIndex] : null;

  return (
    <div className="w-full bg-background text-foreground py-24 md:py-32 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
          <div className="md:col-span-4 h-75 md:h-120 flex flex-col justify-between p-8 rounded-[min(var(--radius-4xl),24px)] border border-border/20 bg-card/5 backdrop-blur-xs select-none">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-primary font-semibold tracking-widest uppercase">
                Visual Narrative
              </span>
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-light font-heading tracking-tight leading-tight mt-6 text-foreground">
                Viora in <br /> Frame
              </h2>
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-70">
                A photographic journal capturing the estate architecture, our
                fire-kissed kitchen craft, and the shared warmth of our guests.
              </p>
            </div>
          </div>

          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className={cn(
                "relative group overflow-hidden rounded-[min(var(--radius-4xl),24px)] border border-border/10 cursor-pointer select-none bg-muted/10",
                item.gridClass,
              )}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-1 text-white">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-widest font-sans">
                      {item.title}
                    </h3>
                    <Maximize2 className="size-3.5 opacity-70" />
                  </div>
                  <p className="text-[11px] text-white/70 font-serif italic max-w-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/75 via-black/20 to-transparent p-4 flex flex-col gap-0.5 md:hidden text-white">
                <h3 className="text-xs font-semibold uppercase tracking-wider">
                  {item.title}
                </h3>
                <p className="text-[10px] text-white/75 truncate">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col justify-between p-6 md:p-10 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="w-full flex items-center justify-between z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(galleryItems.length).padStart(2, "0")}
              </span>

              <button
                onClick={() => setLightboxIndex(null)}
                className="rounded-full p-2 border border-border/30 hover:bg-muted text-foreground cursor-pointer transition-colors"
                aria-label="Close Gallery"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 w-full flex items-center justify-center relative my-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null
                      ? (prev - 1 + galleryItems.length) % galleryItems.length
                      : null,
                  );
                }}
                className="absolute left-2 md:left-4 z-10 p-2.5 rounded-full border border-border/30 bg-card/60 hover:bg-card text-foreground transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div
                className="relative w-full h-full max-w-5xl max-h-[70vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  priority
                  className="object-contain rounded-2xl"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((prev) =>
                    prev !== null ? (prev + 1) % galleryItems.length : null,
                  );
                }}
                className="absolute right-2 md:left-auto md:right-4 z-10 p-2.5 rounded-full border border-border/30 bg-card/60 hover:bg-card text-foreground transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            <div
              className="w-full max-w-xl mx-auto text-center z-10 flex flex-col gap-1 pb-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-heading font-medium tracking-wide uppercase">
                {activeItem.title}
              </h3>
              <p className="text-xs text-muted-foreground font-serif italic leading-relaxed mt-1">
                {activeItem.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
