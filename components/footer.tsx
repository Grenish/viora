import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Story", href: "/story" },
  { label: "Contact", href: "/contact" },
  { label: "Reserve", href: "/reserve" },
];

const cuisineLinks = [
  { label: "American", href: "/" },
  { label: "Italian", href: "/" },
  { label: "Indian", href: "/" },
  { label: "Mediterranean", href: "/" },
  { label: "Pan Asian", href: "/" },
];

const roomLinks = [
  { label: "Suite", href: "/" },
  { label: "Deluxe Room", href: "/" },
  { label: "Standard Room", href: "/" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-card/50 border-t border-border text-foreground">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
            <Link href="/">
              <span className="text-lg font-semibold tracking-tight text-foreground font-heading">
                Viora
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
              Every dish served with a touch of elegance and tradition at our
              estate in San Francisco.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Cuisines */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Cuisines
            </h4>
            <nav className="flex flex-col gap-2">
              {cuisineLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Rooms */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Rooms
            </h4>
            <nav className="flex flex-col gap-2">
              {roomLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>&copy; {year} Viora Estate. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
