"use client";

import React, { useRef } from "react";
import { Check, Download, Printer, Users, Clock, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ReservationCardProps {
  bookingRef: string;
  name: string;
  seatingZone: string;
  tableId: string;
  partySize: number;
  date: Date | undefined;
  timeLabel: string;
}

// Custom procedural barcode generator for the download pass
const BarcodeSVG = ({ code }: { code: string }) => {
  return (
    <svg className="w-56 h-10 text-foreground" viewBox="0 0 160 32" fill="currentColor">
      <rect x="0" y="0" width="2" height="32" />
      <rect x="3" y="0" width="1" height="32" />
      {code.split("").map((char, index) => {
        const hash = char.charCodeAt(0);
        const width1 = (hash % 3) + 1;
        const width2 = ((hash >> 2) % 2) + 1;
        const gap = ((hash >> 4) % 3) + 1;
        const offset = 6 + index * 9;
        if (offset > 150) return null;
        return (
          <React.Fragment key={index}>
            <rect x={offset} y="0" width={width1} height="32" />
            <rect x={offset + width1 + gap} y="0" width={width2} height="32" />
          </React.Fragment>
        );
      })}
      <rect x="154" y="0" width="1" height="32" />
      <rect x="157" y="0" width="2" height="32" />
    </svg>
  );
};

export default function ReservationCard({
  bookingRef,
  name,
  seatingZone,
  tableId,
  partySize,
  date,
  timeLabel,
}: ReservationCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // Ultra high-quality render
        useCORS: true,
        backgroundColor: null, // Preserves transparent corners if applicable
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `viora-reservation-${bookingRef}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to generate reservation card image:", error);
    }
  };

  const handlePrint = () => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    // Retrieve or create a hidden print iframe
    let iframe = document.getElementById("print-iframe") as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "print-iframe";
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    // Get all page stylesheets to copy over
    const stylesheets = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"))
      .map((style) => style.outerHTML)
      .join("\n");

    iframeDoc.open();
    iframeDoc.write(
      "<!DOCTYPE html><html><head><title> </title>" +
      stylesheets +
      "<style>" +
      "@page { margin: 0; }" +
      "body { background: white !important; color: black !important; margin: 0 !important; padding: 20px !important; display: flex !important; justify-content: center !important; align-items: center !important; min-height: 90vh !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }" +
      "#printable-premium-pass { border: 1px solid #e5e7eb !important; box-shadow: none !important; background: white !important; color: black !important; max-width: 400px !important; width: 100% !important; border-radius: 16px !important; margin: 0 auto !important; padding: 32px !important; }" +
      ".text-muted-foreground { color: #4b5563 !important; }" +
      "</style></head><body>" +
      cardElement.outerHTML +
      "</body></html>"
    );
    iframeDoc.close();

    // Trigger printing on the iframe
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    }, 300);
  };

  const formattedDate = date
    ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Not Selected";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">


      {/* Print / Download Container */}
      <div id="print-area-container" className="w-full">
        {/* Premium Digital Invitation Card */}
        <div
          ref={cardRef}
          id="printable-premium-pass"
          className="w-full bg-card border border-border/80 p-8 rounded-2xl flex flex-col gap-6 shadow-xl relative overflow-hidden bg-radial from-card via-card to-muted/20"
        >
          {/* Decorative Top Gold Bar Accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-foreground opacity-90" />

          {/* Header Monogram & Brand */}
          <div className="flex flex-col items-center text-center gap-1.5 mt-2">
            <div className="size-11 rounded-full border border-border bg-background flex items-center justify-center text-[13px] font-heading font-light tracking-[0.2em] text-foreground shadow-sm">
              V
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-muted-foreground mt-2">
              Viora Estate
            </span>
            <h2 className="text-xl font-heading font-light tracking-wide text-foreground uppercase mt-0.5">
              Guest Invitation
            </h2>
          </div>

          <Separator className="bg-border/60" />

          {/* Details Section */}
          <div className="flex flex-col gap-4 py-2">
            
            {/* Reference */}
            <div className="flex flex-col gap-1 items-center justify-center text-center bg-muted/40 p-3 rounded-xl border border-border/40">
              <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                Booking Reference
              </span>
              <span className="text-sm font-mono font-semibold tracking-wider text-foreground">
                {bookingRef}
              </span>
            </div>

            {/* Guest Info */}
            <div className="flex flex-col gap-0.5 mt-2">
              <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider">
                Invited Guest
              </span>
              <span className="text-base font-semibold text-foreground truncate">
                {name || "Guest Details"}
              </span>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs mt-1">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="size-3 text-muted-foreground" /> Seating Zone
                </span>
                <span className="font-semibold text-foreground truncate">{seatingZone}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Users className="size-3 text-muted-foreground" /> Party Size
                </span>
                <span className="font-semibold text-foreground">{partySize} Guests &bull; {tableId}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <CalendarDays className="size-3 text-muted-foreground" /> Seating Date
                </span>
                <span className="font-semibold text-foreground">{formattedDate}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Clock className="size-3 text-muted-foreground" /> Dining Time
                </span>
                <span className="font-semibold text-foreground">{timeLabel}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border/60" />

          {/* Barcode & Fine Print */}
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="opacity-90">
              <BarcodeSVG code={`${bookingRef}-${tableId}`} />
            </div>
            <p className="text-[9px] text-muted-foreground/80 leading-relaxed max-w-[260px]">
              Present this digital invitation pass at the estate entrance. Booking is held for a grace period of 15 minutes.
            </p>
          </div>
        </div>
      </div>

      {/* Card Actions (No Print) */}
      <div className="flex gap-3 w-full no-print-element mt-2">
        <Button onClick={handleDownload} className="flex-1 rounded-xl cursor-pointer">
          <Download className="size-4 mr-1.5" />
          Download PNG
        </Button>
        <Button onClick={handlePrint} variant="outline" className="flex-1 rounded-xl cursor-pointer">
          <Printer className="size-4 mr-1.5" />
          Print Pass
        </Button>
      </div>
    </div>
  );
}
