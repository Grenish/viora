"use client";

import { useCurrency, Currency } from "@/lib/use-currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CurrencySelect() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select
      value={currency}
      onValueChange={(value) => setCurrency(value as Currency)}
    >
      <SelectTrigger className=" bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 border-border/40 text-xs h-8 rounded-full select-none cursor-pointer">
        <SelectValue placeholder="INR" />
      </SelectTrigger>
      <SelectContent className="bg-background/90 backdrop-blur-md border border-border/40 rounded-2xl min-w-[80px]">
        <SelectItem value="INR" className="text-xs cursor-pointer">
          INR (₹)
        </SelectItem>
        <SelectItem value="USD" className="text-xs cursor-pointer">
          USD ($)
        </SelectItem>
        <SelectItem value="EUR" className="text-xs cursor-pointer">
          EUR (€)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
