"use client";

import React, { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function PhoneNumberInput({
  value,
  onChange,
  defaultCountry = "CM", // Cameroon default
  placeholder = "+237 6XX XXX XXX",
  error = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex h-11 w-full items-center rounded-xl border bg-background px-3 text-sm transition",
        error
          ? "border-red-400 focus-within:border-red-500"
          : "border-border focus-within:border-brand-600",
        className
      )}
    >
      <PhoneInput
        international
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none"
        style={{
          "--PhoneInputCountryFlag-height": "1em",
          "--PhoneInputCountrySelectArrow-color": "var(--muted-foreground)",
        } as React.CSSProperties}
      />
    </div>
  );
}

export { isValidPhoneNumber };