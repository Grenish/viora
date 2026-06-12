"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import ReservationCard from "./reservation-card";

interface Experience {
  id: string;
  name: string;
  description: string;
  location: string;
  maxParty: number;
}

interface TableMapItem {
  id: string;
  label: string;
  seats: number;
}

const experiences: Experience[] = [
  {
    id: "dining-hall",
    name: "The Dining Hall",
    description:
      "Our lively main room with warm marble tables and cellar views.",
    location: "Main Floor",
    maxParty: 8,
  },
  {
    id: "chefs-counter",
    name: "The Chef's Counter",
    description:
      "An intimate, front-row seat to the kitchen. Watch the team cook over live fire.",
    location: "Kitchen Front",
    maxParty: 4,
  },
  {
    id: "estate-gardens",
    name: "The Estate Gardens",
    description:
      "Al fresco dining under olive trees with a gentle evening breeze.",
    location: "Outdoor Terrace",
    maxParty: 6,
  },
  {
    id: "private-suite",
    name: "Private Dining Suite",
    description:
      "A completely secluded room for special celebrations with tasting menus.",
    location: "Upper Level",
    maxParty: 12,
  },
];

const tableLayouts: Record<string, TableMapItem[]> = {
  "dining-hall": [
    { id: "T1", label: "Table 1", seats: 2 },
    { id: "T2", label: "Table 2", seats: 4 },
    { id: "T3", label: "Table 3", seats: 4 },
    { id: "T4", label: "Table 4", seats: 2 },
    { id: "T5", label: "Table 5", seats: 6 },
    { id: "T6", label: "Table 6", seats: 8 },
  ],
  "chefs-counter": [
    { id: "C1", label: "Seat 1", seats: 1 },
    { id: "C2", label: "Seat 2", seats: 1 },
    { id: "C3", label: "Seat 3", seats: 1 },
    { id: "C4", label: "Seat 4", seats: 1 },
  ],
  "estate-gardens": [
    { id: "G1", label: "Garden 1", seats: 2 },
    { id: "G2", label: "Garden 2", seats: 4 },
    { id: "G3", label: "Garden 3", seats: 4 },
    { id: "G4", label: "Garden 4", seats: 6 },
  ],
  "private-suite": [{ id: "S1", label: "Grand Suite Table", seats: 12 }],
};

const timeSlots = {
  lunch: [
    { value: "12:00", label: "12:00 PM" },
    { value: "12:30", label: "12:30 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "13:30", label: "1:30 PM" },
  ],
  dinner: [
    { value: "18:00", label: "6:00 PM" },
    { value: "18:30", label: "6:30 PM" },
    { value: "19:00", label: "7:00 PM" },
    { value: "19:30", label: "7:30 PM" },
    { value: "20:00", label: "8:00 PM" },
    { value: "20:30", label: "8:30 PM" },
    { value: "21:00", label: "9:00 PM" },
  ],
};

const dietaryOptions = [
  "None",
  "Gluten-Free",
  "Vegan",
  "Vegetarian",
  "Nut Allergy",
  "Dairy-Free",
];

export default function Reservations() {
  const [step, setStep] = useState(1);
  const [selectedExperience, setSelectedExperience] =
    useState<string>("dining-hall");
  const [selectedTable, setSelectedTable] = useState<string>("T2");
  const [partySize, setPartySize] = useState<number>(4);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("19:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dietary, setDietary] = useState<string>("None");
  const [notes, setNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingRef] = useState(
    () => `VRA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  );

  const experienceDetails = useMemo(() => {
    return (
      experiences.find((e) => e.id === selectedExperience) || experiences[0]
    );
  }, [selectedExperience]);

  const activeTables = useMemo(() => {
    return tableLayouts[selectedExperience] || [];
  }, [selectedExperience]);

  const handleTableSelect = (tableId: string, seats: number) => {
    setSelectedTable(tableId);
    setPartySize(seats);
  };

  const handlePartySizeChange = (size: number) => {
    setPartySize(size);
    const firstFittingTable = activeTables.find((t) => t.seats >= size);
    if (firstFittingTable) {
      setSelectedTable(firstFittingTable.id);
    }
  };

  const handleNext = () => {
    if (step === 1 && selectedExperience && partySize) {
      setStep(2);
    } else if (step === 2 && date && time) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && phone.trim()) {
      setIsConfirmed(true);
    }
  };

  const timeLabel = useMemo(() => {
    const combined = [...timeSlots.lunch, ...timeSlots.dinner];
    const match = combined.find((t) => t.value === time);
    return match ? match.label : `${time} PM`;
  }, [time]);

  if (isConfirmed) {
    return (
      <div className="w-full min-h-screen bg-background text-foreground py-24 px-4 flex items-center justify-center">
        <ReservationCard
          bookingRef={bookingRef}
          name={name}
          seatingZone={experienceDetails.name}
          tableId={selectedTable}
          partySize={partySize}
          date={date}
          timeLabel={timeLabel}
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground py-24 md:py-32">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* Simple Minimal Header */}
        <div className="flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground font-heading">
            Reserve a Table
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Complete your seating preferences and details to secure your
            reservation at Viora.
          </p>
        </div>

        {/* Steps Breadcrumb Progress */}
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground border-b border-border pb-4">
          <button
            type="button"
            disabled={step < 1}
            onClick={() => setStep(1)}
            className={cn(
              "transition-colors hover:text-foreground",
              step === 1 && "text-foreground font-semibold",
            )}
          >
            01. Seating Preferring
          </button>
          <span>/</span>
          <button
            type="button"
            disabled={step < 2}
            onClick={() => setStep(2)}
            className={cn(
              "transition-colors hover:text-foreground",
              step === 2 && "text-foreground font-semibold",
            )}
          >
            02. Date & Session
          </button>
          <span>/</span>
          <button
            type="button"
            disabled={step < 3}
            onClick={() => setStep(3)}
            className={cn(
              "transition-colors hover:text-foreground",
              step === 3 && "text-foreground font-semibold",
            )}
          >
            03. Guest Details
          </button>
        </div>

        {/* Wizard Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left: Step Form Wizard */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-8"
                >
                  {/* Experiences Zone Selection */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Select Zone Preference
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {experiences.map((exp) => {
                        const isSelected = selectedExperience === exp.id;
                        return (
                          <div
                            key={exp.id}
                            onClick={() => {
                              setSelectedExperience(exp.id);
                              const defaultTable = tableLayouts[exp.id][0];
                              handleTableSelect(
                                defaultTable.id,
                                defaultTable.seats,
                              );
                            }}
                            className={cn(
                              "border rounded-xl p-4 cursor-pointer select-none transition-all bg-card hover:bg-muted/30",
                              isSelected
                                ? "border-foreground"
                                : "border-border",
                            )}
                          >
                            <h4 className="text-sm font-semibold text-foreground">
                              {exp.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {exp.description}
                            </p>
                            <div className="text-[10px] text-muted-foreground/85 font-mono mt-3">
                              MAX CAPACITY: {exp.maxParty} GUESTS &bull;{" "}
                              {exp.location}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clean Tables Grid Layout */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Select Table
                    </h3>

                    <div className="border border-border rounded-xl p-6 bg-card">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                        {activeTables.map((tab) => {
                          const isSelected = selectedTable === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() =>
                                handleTableSelect(tab.id, tab.seats)
                              }
                              className={cn(
                                "py-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5",
                                isSelected
                                  ? "bg-foreground text-background border-foreground font-semibold"
                                  : "bg-card border-border hover:bg-muted/40",
                              )}
                            >
                              <span className="text-xs font-mono font-medium">
                                {tab.id}
                              </span>
                              <span className="text-[9px] opacity-75">
                                {tab.seats} Seats
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Party Size count Selector */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Confirm Guest Capacity
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.from({
                        length: Math.min(12, experienceDetails.maxParty),
                      }).map((_, i) => {
                        const size = i + 1;
                        const isSelected = partySize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handlePartySizeChange(size)}
                            className={cn(
                              "size-9 rounded-lg text-xs border transition-all cursor-pointer flex items-center justify-center",
                              isSelected
                                ? "bg-foreground text-background border-foreground font-semibold"
                                : "bg-card border-border hover:bg-muted/40",
                            )}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Calendar select */}
                    <div className="md:col-span-7 flex flex-col gap-3">
                      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Select Seating Date
                      </h3>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-xl border border-border bg-card w-fit"
                      />
                    </div>

                    {/* Time sessions */}
                    <div className="md:col-span-5 flex flex-col gap-5">
                      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Select Time Session
                      </h3>

                      {/* Lunch */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-widest">
                          Lunch slots
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {timeSlots.lunch.map((t) => {
                            const isSelected = time === t.value;
                            return (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => setTime(t.value)}
                                className={cn(
                                  "py-2 rounded-lg border text-xs transition-all",
                                  isSelected
                                    ? "bg-foreground text-background border-foreground font-medium"
                                    : "bg-card border-border hover:bg-muted/40",
                                )}
                              >
                                {t.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dinner */}
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-widest">
                          Dinner slots
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.dinner.map((t) => {
                            const isSelected = time === t.value;
                            return (
                              <button
                                key={t.value}
                                type="button"
                                onClick={() => setTime(t.value)}
                                className={cn(
                                  "py-2 rounded-lg border text-xs transition-all",
                                  isSelected
                                    ? "bg-foreground text-background border-foreground font-medium"
                                    : "bg-card border-border hover:bg-muted/40",
                                )}
                              >
                                {t.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-6"
                >
                  <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Guest Registry Profile
                  </h3>

                  <div className="flex flex-col gap-5 max-w-xl">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="guest-name"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Full Name
                      </label>
                      <Input
                        id="guest-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Liam Sterling"
                        className="rounded-lg bg-card border-border"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="guest-email"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Email Address
                        </label>
                        <Input
                          id="guest-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="liam@sterling.com"
                          className="rounded-lg bg-card border-border"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="guest-phone"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="guest-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 555-9812"
                          className="rounded-lg bg-card border-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        Dietary Restrictions
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {dietaryOptions.map((opt) => {
                          const isSelected = dietary === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setDietary(opt)}
                              className={cn(
                                "px-3.5 py-1.5 rounded-full text-xs border transition-all",
                                isSelected
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-card border-border hover:bg-muted/40",
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="guest-notes"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Special Occasions / Notes
                      </label>
                      <Textarea
                        id="guest-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any anniversaries, birthdays, or specific preferences..."
                        className="min-h-24 rounded-lg bg-card border-border"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Sticky Checkout Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <Card className="border border-border bg-card rounded-xl shadow-xs flex flex-col justify-between min-h-87.5 p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-semibold text-base text-foreground tracking-tight">
                    Reservation Details
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Summary of your seating
                  </p>
                </div>

                <Separator />

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium text-foreground">
                      {experienceDetails.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Table code</span>
                    <span className="font-medium text-foreground font-mono">
                      {selectedTable}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Party Size</span>
                    <span className="font-medium text-foreground">
                      {partySize} Guests
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Seating Date</span>
                    <span className="font-medium text-foreground">
                      {date
                        ? date.toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Dining Time</span>
                    <span className="font-medium text-foreground">
                      {time ? timeLabel : "—"}
                    </span>
                  </div>
                </div>

                {step === 3 && name.trim() && (
                  <div className="flex flex-col gap-2.5 text-xs border-t border-border pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Guest</span>
                      <span className="font-medium truncate max-w-30">
                        {name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dietary</span>
                      <span className="font-medium">{dietary}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <div className="w-full flex gap-2">
                  {step > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="rounded-xl"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      onClick={handleNext}
                      disabled={
                        (step === 1 &&
                          (!selectedExperience || !selectedTable)) ||
                        (step === 2 && (!date || !time))
                      }
                      className="flex-1 rounded-xl"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!name.trim() || !email.trim() || !phone.trim()}
                      className="flex-1 rounded-xl"
                    >
                      Confirm Seating
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
