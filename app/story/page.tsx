"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Compass, Leaf, Users, Flame, Award, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const pillars = [
  {
    icon: Compass,
    title: "The Vision",
    description:
      "A journey born from a desire to blend classical culinary foundations with modern global interpretations, respecting each ingredient's origins.",
  },
  {
    icon: Leaf,
    title: "The Land",
    description:
      "Sourcing exclusively from regional biodynamic farms and our own estate gardens to guarantee peak seasonal freshness in every creation.",
  },
  {
    icon: Flame,
    title: "The Hearth",
    description:
      "Honoring fire as the ultimate culinary element—using wood-fired ovens and charcoal embers to coax deep, complex flavors from local ingredients.",
  },
];

const milestones = [
  {
    year: "2018",
    title: "The Seed is Sown",
    subtitle: "A Fictional Dream",
    description:
      "A group of passionate chefs and visionary hoteliers acquire the historic Heritage Lane estate in San Francisco, dreaming of a unified culinary retreat.",
  },
  {
    year: "2020",
    title: "Opening the Gates",
    subtitle: "Viora Welcomes the World",
    description:
      "After two years of meticulous restoration of the estate and culinary testing, Viora officially opens its doors to critical acclaim.",
  },
  {
    year: "2022",
    title: "A New Culinary Era",
    subtitle: "Chef Akira Takahashi Joins",
    description:
      "Acclaimed Chef Akira Takahashi takes the helm, introducing his philosophy of marrying delicate global techniques with the estate's open-fire heritage.",
  },
  {
    year: "2025",
    title: "Michelin Recognition",
    subtitle: "Two Star Honor",
    description:
      "Viora is honored with two Michelin stars, celebrating our commitment to culinary excellence, local farmers, and outstanding guest hospitality.",
  },
];

export default function StoryPage() {
  return (
    <div className="w-full bg-background text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-120 flex items-center justify-center overflow-hidden">
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cover.png"
            alt="Viora Estate Grounds"
            fill
            priority
            className="object-cover object-center brightness-[0.35] saturate-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm font-semibold tracking-widest text-zinc-400 uppercase mb-3 font-mono"
          >
            Our Heritage
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-light font-heading tracking-tight text-white mb-6 leading-tight"
          >
            The Story of Viora
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-zinc-300 max-w-xl leading-relaxed text-balance font-light"
          >
            Built on the foundation of elegance, open fire, and seasonal farm-to-table harvests, Viora is a sanctuary of refined gastronomy and peaceful lodging in San Francisco.
          </motion.p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full py-20 md:py-28 max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 flex flex-col gap-4">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
            Culinary Philosophy
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-heading tracking-tight leading-tight">
            Crafting the Extraordinary from the Earth
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-light mt-2">
            Every dish we prepare is an tribute to the seasons, the farmers, and the timeless techniques that transform simple ingredients into art. At Viora, we source locally and cook with open flames, wood coals, and clean heat to capture the pure flavors of Northern California.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed font-light">
            Our estate is more than just a destination for fine dining; it is a gathering place where memories are forged around the warmth of the hearth and the elegance of traditional hospitality.
          </p>
        </div>
        <div className="md:col-span-6 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-border/10 bg-muted">
          <Image
            src="/cuisine.png"
            alt="Artistic plating at Viora"
            fill
            className="object-cover transition-transform duration-700 hover:scale-102"
          />
        </div>
      </section>

      {/* Pillars Section */}
      <section className="w-full bg-card/10 backdrop-blur-xs py-20 md:py-28 border-t border-b border-border/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
              Core Principles
            </span>
            <h2 className="text-2xl md:text-3xl font-heading tracking-tight font-light">
              The Three Pillars
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground font-light max-w-md">
              Our commitment to excellence guides everything we do, from sourcing ingredients to serving our esteemed guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-border/10 bg-card/30 hover:border-border/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-medium font-heading">{pillar.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-light">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="w-full py-20 md:py-28 max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center gap-2">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-primary">
            Our Journey
          </span>
          <h2 className="text-2xl md:text-3xl font-heading tracking-tight font-light">
            Through the Years
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground font-light max-w-md">
            A look back at the key moments that shaped Viora into the culinary destination it is today.
          </p>
        </div>

        <div className="relative w-full">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-border/40 transform md:-translate-x-1/2" />

          <div className="flex flex-col gap-12">
            {milestones.map((m, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={m.year} className="relative flex md:items-center w-full group min-h-36">
                  {/* Timeline central dot */}
                  <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 transform -translate-x-1/2 md:-translate-y-1/2 z-20">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary group-hover:scale-125 transition-all duration-300 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Left Column (Desktop only, even items) */}
                  <div className="hidden md:flex w-1/2 pr-12 justify-end text-right">
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md p-6 rounded-2xl border border-border/10 bg-card/10 backdrop-blur-xs hover:border-border/30 hover:bg-card/20 transition-all flex flex-col gap-2"
                      >
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xl font-bold font-mono tracking-tight text-primary leading-none">{m.year}</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold font-mono">{m.subtitle}</span>
                        </div>
                        <h3 className="text-base font-medium font-heading text-foreground mt-1">{m.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-light">{m.description}</p>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Column (Desktop: odd items, Mobile: all items) */}
                  <div className="w-full md:w-1/2 pl-12 md:pl-12 flex justify-start">
                    <div className={isEven ? "block md:hidden w-full" : "w-full"}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                        className="max-w-md p-6 rounded-2xl border border-border/10 bg-card/10 backdrop-blur-xs hover:border-border/30 hover:bg-card/20 transition-all flex flex-col gap-2"
                      >
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-xl font-bold font-mono tracking-tight text-primary leading-none">{m.year}</span>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold font-mono">{m.subtitle}</span>
                        </div>
                        <h3 className="text-base font-medium font-heading text-foreground mt-1">{m.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-light">{m.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="w-full relative py-24 md:py-32 flex items-center justify-center overflow-hidden border-t border-border/20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/experience.png"
            alt="Cozy dining atmosphere"
            fill
            className="object-cover object-center brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/90 to-background" />
        </div>

        <div className="relative z-10 w-full max-w-xl mx-auto px-6 text-center flex flex-col items-center">
          <Heart className="w-8 h-8 text-primary/80 mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-light font-heading tracking-tight text-white mb-4">
            Be a Part of Our Story
          </h2>
          <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-light mb-8 max-w-md">
            Whether for a curated fine dining evening, tasting menus, or a weekend estate retreat, your presence adds to Viora's unfolding legacy.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/reserve">
              <Button className="rounded-xl flex items-center gap-2 cursor-pointer">
                Book a Table <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="rounded-xl cursor-pointer">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
