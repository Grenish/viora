"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MenuIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import LiquidGlass from "./liquid-glass";

const continental: { title: string; desc: string; link: string }[] = [
  {
    title: "American",
    desc: "Hearty, bold flavors featuring grilled meats, fresh produce, and comfort food traditions.",
    link: "/",
  },
  {
    title: "Beverages",
    desc: "Refreshing drinks and beverages crafted to complement and enhance your dining experience.",
    link: "/",
  },
  {
    title: "Chinese",
    desc: "Authentic wok-fired dishes with intricate spice blends and time-honored cooking techniques.",
    link: "/",
  },
  {
    title: "European",
    desc: "Elegant continental cuisine blending refined techniques with premium local ingredients.",
    link: "/",
  },
  {
    title: "Indian",
    desc: "Aromatic spiced curries and traditional recipes celebrating rich culinary heritage.",
    link: "/",
  },
  {
    title: "Italian",
    desc: "Classic flavors from Italy featuring fresh pasta, vibrant sauces, and artisanal traditions.",
    link: "/",
  },
  {
    title: "Mediterranean",
    desc: "Sunshine-inspired dishes with olive oil, fresh seafood, and farm-to-table simplicity.",
    link: "/",
  },
  {
    title: "Mexican",
    desc: "Vibrant and zesty flavors with traditional spices, fresh ingredients, and bold character.",
    link: "/",
  },
  {
    title: "Middle Eastern",
    desc: "Exotic spices and ancient recipes blending Mediterranean and Eastern culinary traditions.",
    link: "/",
  },
  {
    title: "Pan Asian",
    desc: "Diverse fusion of Asian flavors showcasing regional specialties and modern innovation.",
    link: "/",
  },
];

const rooms: { title: string; desc: string; link: string }[] = [
  {
    title: "Suite",
    desc: "Luxurious accommodations with separate living and sleeping areas, premium amenities, and exclusive services.",
    link: "/",
  },
  {
    title: "Two Bedroom Room",
    desc: "Spacious layout perfect for families or groups, featuring two comfortable bedrooms with modern furnishings.",
    link: "/",
  },
  {
    title: "One Bedroom Room",
    desc: "Elegant private retreat with a separate bedroom and living area, ideal for couples or individual travelers.",
    link: "/",
  },
  {
    title: "Deluxe Room",
    desc: "Premium single-room accommodation with upscale décor, enhanced comfort, and curated in-room conveniences.",
    link: "/",
  },
  {
    title: "Standard Room",
    desc: "Comfortable and well-appointed rooms offering essential amenities and a cozy atmosphere for a pleasant stay.",
    link: "/",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<
    "continentals" | "rooms" | null
  >(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleAccordion = (name: "continentals" | "rooms") =>
    setOpenAccordion((prev) => (prev === name ? null : name));

  return (
    <header className="w-full py-4 px-4 md:px-8 fixed top-0 z-40 pointer-events-none overflow-x-clip">
      <LiquidGlass
        className={cn(
          "w-full sm:w-11/12 md:w-10/12 max-w-full mx-auto border rounded-full pointer-events-auto transition-[width] duration-300 ease-in-out",
          isScrolled && "md:w-5xl",
        )}
        radius={28}
        bezel={20}
        thickness={70}
        ior={50}
        blur={2}
      >
        <nav className="w-full py-2 px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <h2>Viora</h2>
              </Link>
            </div>

            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/">Home</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/story">Story</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Continentals</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-100 gap-2 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                        {continental.map((item, index) => (
                          <ListItem
                            key={index}
                            title={item.title}
                            href={item.link}
                          >
                            {item.desc}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Rooms</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-100 gap-2 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                        {rooms.map((item, index) => (
                          <ListItem
                            key={index}
                            title={item.title}
                            href={item.link}
                          >
                            {item.desc}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      asChild
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link href="/contact">Contact</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <Button className="hidden md:inline-flex">Book Now</Button>

            <button
              className="md:hidden rounded-lg p-1.5 hover:bg-muted transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <motion.span
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {mobileOpen ? (
                  <XIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </motion.span>
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="md:hidden absolute left-4 right-4 top-full mt-1 z-50 rounded-xl border bg-background p-3 shadow-lg flex flex-col gap-1 pointer-events-auto"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <MobileNavLink href="/" onClick={() => setMobileOpen(false)}>
                  Home
                </MobileNavLink>

                <MobileNavLink
                  href="/story"
                  onClick={() => setMobileOpen(false)}
                >
                  Story
                </MobileNavLink>

                <div>
                  <button
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    onClick={() => toggleAccordion("continentals")}
                  >
                    Continentals
                    <ChevronDownIcon
                      className={cn(
                        "size-4 transition-transform duration-200",
                        openAccordion === "continentals" && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === "continentals" && (
                      <motion.ul
                        className="mt-1 ml-3 flex flex-col gap-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        {continental.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={item.link}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <button
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    onClick={() => toggleAccordion("rooms")}
                  >
                    Rooms
                    <ChevronDownIcon
                      className={cn(
                        "size-4 transition-transform duration-200",
                        openAccordion === "rooms" && "rotate-180",
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openAccordion === "rooms" && (
                      <motion.ul
                        className="mt-1 ml-3 flex flex-col gap-1"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        {rooms.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={item.link}
                              onClick={() => setMobileOpen(false)}
                              className="block rounded-xl px-3 py-2 text-sm hover:bg-muted transition-colors"
                            >
                              <span className="font-medium">{item.title}</span>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {item.desc}
                              </p>
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>

                <MobileNavLink
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </MobileNavLink>

                <div className="pt-2">
                  <Button className="w-full">Book Now</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </LiquidGlass>
    </header>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium">{title}</div>
            <div className="line-clamp-2 text-muted-foreground">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
