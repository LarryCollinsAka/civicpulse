"use client";

import { useState } from "react";
import type { CMSFaqItem, Locale } from "@/lib/cms";

export function FAQSection({ items, locale }: { items: CMSFaqItem[]; locale: Locale }) {
  const [open, setOpen] = useState<string | null>(null);

  if (!items.length) return null;

  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {locale === "fr" ? "Questions fréquentes" : "Frequently asked questions"}
        </h2>

        <div className="mt-12 divide-y divide-border rounded-2xl border border-border">
          {items.map((item) => (
            <div key={item.id}>
              <button
                className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium transition hover:bg-muted/50"
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <span>{item.question}</span>
                <span className="ml-4 text-muted-foreground">
                  {open === item.id ? "−" : "+"}
                </span>
              </button>
              {open === item.id && (
                <div className="px-6 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}