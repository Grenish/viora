"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "USD" | "INR" | "EUR";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number | string) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const RATES: Record<Currency, number> = {
  USD: 1.0,
  INR: 83.5,
  EUR: 0.92,
};

const FORMATTERS: Record<Currency, Intl.NumberFormat> = {
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  INR: new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
  EUR: new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("INR");

  useEffect(() => {
    const saved = localStorage.getItem("viora_currency") as Currency | null;
    if (saved && ["USD", "INR", "EUR"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("viora_currency", c);
  };

  const formatPrice = (priceInUSD: number | string) => {
    const numericUSD = typeof priceInUSD === "string" ? parseFloat(priceInUSD) : priceInUSD;
    if (isNaN(numericUSD)) return "";
    const converted = numericUSD * RATES[currency];
    return FORMATTERS[currency].format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return ctx;
}
