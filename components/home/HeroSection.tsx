"use client";

import Link   from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CMSContent, Locale } from "@/lib/cms";

interface Props { cms: CMSContent; locale: Locale; }

const t = {
  fr: {
    badge:    "Aligné sur les ODD de l'ONU",
    headline: "La ville à l'écoute de ses citoyens.",
    sub:      "Signalez les incidents, suivez leur résolution et participez à la gouvernance de votre ville — via WhatsApp ou le web.",
    cta:      "Explorer la démo",
    cta2:     "En savoir plus",
    switchTo: "EN",
  },
  en: {
    badge:    "Aligned with UN SDGs",
    headline: "The city that listens to its citizens.",
    sub:      "Report incidents, track resolutions, and participate in city governance — via WhatsApp or the web.",
    cta:      "Explore the demo",
    cta2:     "Learn more",
    switchTo: "FR",
  },
} as const;

export function HeroSection({ cms, locale }: Props) {
  const i18n = t[locale];

  // Pull CMS overrides with fallback to defaults
  const c = cms.content["hero"] ?? {};
  const headline = c["headline"] ?? i18n.headline;
  const sub      = c["sub"]      ?? i18n.sub;
  const cta      = c["cta"]      ?? i18n.cta;
  const cta_href = c["cta_href"] ?? "/auth/register";

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:px-12 lg:px-24">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Language switcher */}
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher current={locale} />
        </div>

        {/* Badge */}
        <div className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
            {i18n.badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground">
          {sub}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={cta_href}
            className="rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow transition hover:bg-brand-800 hover:-translate-y-0.5"
          >
            {cta}
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-full border border-border px-8 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            {i18n.cta2}
          </Link>
        </div>

        {/* SDG pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {[
            { n: 6,  label: "SDG 6",  color: "#26BDE2" },
            { n: 11, label: "SDG 11", color: "#FD9D24" },
            { n: 13, label: "SDG 13", color: "#3F7E44" },
            { n: 15, label: "SDG 15", color: "#56C02B" },
            { n: 16, label: "SDG 16", color: "#00689D" },
            { n: 17, label: "SDG 17", color: "#19486A" },
          ].map(({ n, label, color }) => (
            <span
              key={n}
              className="rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ background: color }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Language Switcher ──────────────────────────────────────────────────────
function LanguageSwitcher({ current }: { current: Locale }) {
  function switchLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border p-1 text-xs font-semibold">
      {(["fr", "en"] as const).map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={cn(
            "rounded-full px-3 py-1 transition",
            current === loc
              ? "bg-brand-600 text-white"
              : "hover:bg-muted text-muted-foreground"
          )}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}