"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  locale: "fr" | "en";
  onChange: (locale: "fr" | "en") => void;
}

export function LanguageSwitcher({ locale, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-1 text-xs font-semibold">
      {(["fr", "en"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => onChange(loc)}
          className={cn(
            "rounded-full px-3 py-1 transition",
            locale === loc
              ? "text-white"
              : "text-muted-foreground hover:bg-muted"
          )}
          style={locale === loc ? { backgroundColor: "#1A6B4A" } : {}}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}