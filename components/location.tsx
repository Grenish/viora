"use client";

import { MapPin, Clock, Phone, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const hours = [
  { day: "Monday – Friday", time: "12:00 PM – 10:30 PM" },
  { day: "Saturday", time: "11:00 AM – 11:00 PM" },
  { day: "Sunday", time: "11:00 AM – 9:00 PM" },
];

export default function Location() {
  return (
    <div className="w-full bg-background text-foreground py-24 md:py-32">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground font-heading">
            Find Us
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Located at the heart of the estate district. We look forward to
            welcoming you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-7 w-full aspect-4/3 lg:aspect-auto lg:h-105 rounded-xl overflow-hidden border border-border bg-muted">
            <iframe
              title="Viora Estate Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d8e8e1e3%3A0x7d8e3e35a2e9bf3f!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000"
              className="w-full h-full border-0 grayscale"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Address */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Address
              </h3>
              <div className="flex items-start gap-3 mt-1">
                <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5 text-sm">
                  <span className="font-medium text-foreground">
                    Viora Estate
                  </span>
                  <span className="text-muted-foreground">
                    42 Heritage Lane, Estate District
                  </span>
                  <span className="text-muted-foreground">
                    San Francisco, CA 94102
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Operating Hours */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Operating Hours
              </h3>
              <div className="flex flex-col gap-2.5 mt-1">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="size-3.5" />
                      {h.day}
                    </span>
                    <span className="font-medium text-foreground">
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Contact
              </h3>
              <div className="flex flex-col gap-2.5 mt-1 text-sm">
                <a
                  href="tel:+14155559812"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="size-3.5" />
                  +1 (415) 555-9812
                </a>
                <a
                  href="mailto:reservations@viora.estate"
                  className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="size-3.5" />
                  reservations@viora.estate
                </a>
              </div>
            </div>

            <Separator />

            {/* CTA */}
            <div className="flex gap-3">
              <Link href="" className="flex-1">
                <Button className="w-full rounded-xl">Reserve a Table</Button>
              </Link>
              <a
                href="https://maps.google.com/?q=42+Heritage+Lane+San+Francisco+CA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full rounded-xl">
                  Get Directions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
