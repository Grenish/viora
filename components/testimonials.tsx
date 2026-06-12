"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  category: "critic" | "patron";
  quote: string;
  rating: number;
  date: string;
  recommended: string;
}

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "The Michelin Guide",
    role: "Official Inspection Team",
    category: "critic",
    quote:
      "An extraordinary culinary symphony. From the delicate, house-milled Truffle Tagliolini to the perfectly poached Atlantic Halibut, Viora represents a masterclass in balance, technique, and creative global vision. The service is absolute perfection.",
    rating: 5,
    date: "October 2025",
    recommended: "Truffle Tagliolini",
  },
  {
    id: "t2",
    name: "Marcus Vance",
    role: "Connoisseur & Patron",
    category: "patron",
    quote:
      "The Saffron Seafood Paella transported me straight to the Spanish coast. Viora succeeds where many upscale restaurants fail: they maintain absolute authenticity of flavors while elevating the presentation to pure fine art.",
    rating: 5,
    date: "March 2026",
    recommended: "Saffron Seafood Paella",
  },
  {
    id: "t3",
    name: "Elena Rostova",
    role: "Editor-in-Chief, Gastronome Magazine",
    category: "critic",
    quote:
      "Dining at Viora is not merely eating; it is a curated editorial journey. The design, the service, and the sheer audacity of bringing Chinese wok-fired techniques next to a classic Beef Wellington is nothing short of brilliant.",
    rating: 5,
    date: "December 2025",
    recommended: "Classic Beef Wellington",
  },
  {
    id: "t4",
    name: "Kenji Sato",
    role: "Frequent Guest",
    category: "patron",
    quote:
      "The wood-fired Branzino was cooked to perfection. The skin was beautifully blistered, yet the meat remained incredibly moist and tender. Paired with a glass of crisp white wine, it was a flawless evening.",
    rating: 5,
    date: "May 2026",
    recommended: "Wood-Fired Branzino",
  },
  {
    id: "t5",
    name: "Sarah Jenkins",
    role: "Luxury Travel Writer",
    category: "critic",
    quote:
      "Viora's rooms are as luxurious as their menu. We stayed in the Suite and dined on the Wood-Fired Branzino. It is a seamless fusion of world-class hospitality and world-class gastronomy. A true five-star retreat.",
    rating: 5,
    date: "January 2026",
    recommended: "Deluxe Suite & Branzino",
  },
  {
    id: "t6",
    name: "Amara Diop",
    role: "Food Blogger & Guest",
    category: "patron",
    quote:
      "Their Persian Lamb Kofta is legendary. The blend of fire-kissed spices and saffron rice represents a culinary heritage treated with the utmost respect. Viora is a true celebration of culinary diversity.",
    rating: 5,
    date: "April 2026",
    recommended: "Persian Lamb Kofta",
  },
];

const springTransition = {
  type: "spring" as const,
  stiffness: 160,
  damping: 24,
  mass: 0.9,
};

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const RatingStars = ({ val }: { val: number }) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "size-3",
              i < val
                ? "fill-primary text-primary"
                : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-background text-foreground py-24 md:py-32 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16 px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight">
              Guest Journals
            </h2>
          </div>
          <p className="max-w-xs text-xs md:text-sm opacity-55 leading-relaxed">
            Acclaimed whispers and critic signatures. Celebrating shared stories
            around our global culinary hearth.
          </p>
        </div>

        {/* Desktop Layout (Horizontal Accordion) */}
        <div className="hidden lg:flex w-full h-115 rounded-3xl border border-border/40 overflow-hidden bg-card/10 backdrop-blur-xs">
          {testimonials.map((t, idx) => {
            const isActive = idx === activeIndex;
            const num = String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={t.id}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  "relative h-full border-r border-border/30 last:border-0 cursor-pointer overflow-hidden select-none",
                  isActive ? "bg-card/30" : "bg-transparent hover:bg-muted/5",
                )}
                animate={{
                  flex: isActive ? 5.5 : 0.5,
                }}
                transition={springTransition}
              >
                {/* Active Panel Content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="absolute inset-0 p-10 flex flex-col justify-between"
                    >
                      {/* Background quote decor in active card */}
                      <div className="absolute -right-8 -top-8 text-foreground/5 pointer-events-none select-none">
                        <Quote className="size-48" />
                      </div>

                      {/* Top Row: Number & Title */}
                      <div className="flex items-start gap-4 z-10">
                        <span className="font-mono text-xs text-primary">
                          {num}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <h3 className="text-sm font-semibold tracking-wide text-foreground">
                            {t.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {t.role} &bull; {t.date}
                          </p>
                        </div>
                      </div>

                      {/* Middle Content: Quote */}
                      <div className="z-10 pr-16 my-4">
                        <p className="font-serif italic text-2xl xl:text-3xl font-light leading-relaxed text-foreground/90">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between border-t border-border/20 pt-4 z-10">
                        <RatingStars val={t.rating} />
                        {t.recommended && (
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span>Recommends:</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-muted text-foreground border border-border/40 font-sans text-xs">
                              {t.recommended}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed Panel Content */}
                <AnimatePresence>
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 flex flex-col justify-between items-center py-10"
                    >
                      <span className="font-mono text-xs text-muted-foreground/60">
                        {num}
                      </span>

                      <div className="flex-1 flex items-center justify-center">
                        <p className="font-sans text-xs tracking-widest uppercase rotate-270 whitespace-nowrap origin-center text-muted-foreground/70 font-medium">
                          {t.name}
                        </p>
                      </div>

                      <div className="size-1.5 rounded-full bg-muted-foreground/20" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile/Tablet Layout (Vertical Accordion) */}
        <div className="flex lg:hidden flex-col gap-4 w-full">
          {testimonials.map((t, idx) => {
            const isActive = idx === activeIndex;
            const num = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={t.id}
                className={cn(
                  "border border-border/30 rounded-2xl overflow-hidden transition-all duration-300",
                  isActive ? "bg-card/30 border-primary/20" : "bg-transparent",
                )}
              >
                {/* Header/Trigger */}
                <button
                  onClick={() => setActiveIndex(idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {num}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        {t.name}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground/60"
                  >
                    <Plus className="size-4" />
                  </motion.div>
                </button>

                {/* Content Panel */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border/20 flex flex-col gap-4">
                        <p className="font-serif italic text-base leading-relaxed text-foreground/90">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border/10">
                          <RatingStars val={t.rating} />
                          {t.recommended && (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs bg-muted text-foreground border border-border/40 font-sans">
                              {t.recommended}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
