"use client";

import { Settings } from "lucide-react";
import { useCurrency, Currency } from "@/lib/use-currency";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SettingsDropdown() {
  const { currency, setCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/90 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white data-open:bg-white/10 data-open:text-white cursor-pointer"
        >
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 rounded-2xl bg-popover text-popover-foreground border-border">
        <DropdownMenuLabel>Currency</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currency}
          onValueChange={(val) => setCurrency(val as Currency)}
        >
          <DropdownMenuRadioItem value="INR" className="cursor-pointer">
            INR (₹)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="USD" className="cursor-pointer">
            USD ($)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="EUR" className="cursor-pointer">
            EUR (€)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
