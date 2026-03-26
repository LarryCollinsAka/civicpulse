import React from "react";
import Link from "next/link";
import type { CMSContent, Locale } from "@/lib/cms";

const TIERS = {
  fr: [
    {
      name: "Citoyen",
      price: "Gratuit",
      period: "",
      highlight: false,
      desc: "Pour tous les citoyens qui souhaitent signaler des problèmes.",
      features: [
        "Signalement via WhatsApp et web",
        "Suivi de ses incidents",
        "Notifications de statut",
      ],
      cta: "Commencer gratuitement",
      href: "/auth/register",
    },
    {
      name: "Ville",
      price: "$800",
      period: "/mois",
      highlight: true,
      desc: "Tableau de bord complet pour les équipes municipales.",
      features: [
        "Tableau de bord GIS",
        "Agent IA Claude",
        "Rapports ODD",
        "Canal WhatsApp",
        "5 admins inclus",
      ],
      cta: "Démarrer un pilote",
      href: "/auth/register",
    },
    {
      name: "Gouvernement",
      price: "Sur mesure",
      period: "",
      highlight: false,
      desc: "Déploiement multi-villes, intégrations personnalisées.",
      features: [
        "Tout dans Ville",
        "Multi-villes",
        "API ministère",
        "SLA dédié",
        "Formation incluse",
      ],
      cta: "Contacter les ventes",
      href: "mailto:sales@civicpulse.cm",
    },
  ],
  en: [
    {
      name: "Citizen",
      price: "Free",
      period: "",
      highlight: false,
      desc: "For all citizens who want to report issues.",
      features: [
        "Report via WhatsApp and web",
        "Track your incidents",
        "Status notifications",
      ],
      cta: "Get started free",
      href: "/auth/register",
    },
    {
      name: "City",
      price: "$800",
      period: "/month",
      highlight: true,
      desc: "Full dashboard for municipal teams.",
      features: [
        "GIS dashboard",
        "Claude AI agent",
        "SDG reports",
        "WhatsApp channel",
        "5 admin seats",
      ],
      cta: "Start a pilot",
      href: "/auth/register",
    },
    {
      name: "Government",
      price: "Custom",
      period: "",
      highlight: false,
      desc: "Multi-city deployment, custom integrations.",
      features: [
        "Everything in City",
        "Multi-city",
        "Ministry API",
        "Dedicated SLA",
        "Training included",
      ],
      cta: "Contact sales",
      href: "mailto:sales@civicpulse.cm",
    },
  ],
};

export function PricingSection({
  locale,
}: {
  cms: CMSContent;
  locale: Locale;
}) {
  const tiers = TIERS[locale];

  return (
    <section className="bg-muted/30 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {locale === "fr"
            ? "Tarification transparente."
            : "Transparent pricing."}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          {locale === "fr"
            ? "Du citoyen gratuit au contrat gouvernemental — une tarification qui s'adapte à votre ville."
            : "From free citizen access to government contracts — pricing that scales with your city."}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => {
            if (tier.highlight) {
              // Highlighted card — green background, all white text
              return (
                <div
                  key={tier.name}
                  className="rounded-2xl p-8 shadow-lg"
                  style={{ backgroundColor: "#1A6B4A" }}
                >
                  <span
                    className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#ffffff",
                    }}
                  >
                    {locale === "fr" ? "Le plus populaire" : "Most popular"}
                  </span>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "#ffffff" }}
                  >
                    {tier.name}
                  </h3>
                  <div className="my-4 flex items-baseline gap-1">
                    <span
                      className="text-4xl font-black"
                      style={{ color: "#ffffff" }}
                    >
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span
                        className="text-sm"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p
                    className="mb-6 text-sm"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {tier.desc}
                  </p>
                  <ul className="mb-8 space-y-2">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "#ffffff" }}
                      >
                        <span>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={tier.href}
                    className="block w-full rounded-full py-2.5 text-center text-sm font-semibold transition"
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#1A6B4A",
                    }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              );
            }

            // Regular card
            return (
              <div
                key={tier.name}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h3 className="font-bold text-lg">{tier.name}</h3>
                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">{tier.price}</span>
                  {tier.period && (
                    <span className="text-sm text-muted-foreground">
                      {tier.period}
                    </span>
                  )}
                </div>
                <p className="mb-6 text-sm text-muted-foreground">
                  {tier.desc}
                </p>
                <ul className="mb-8 space-y-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-brand-600">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className="block w-full rounded-full border border-border py-2.5 text-center text-sm font-semibold transition hover:bg-muted"
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}