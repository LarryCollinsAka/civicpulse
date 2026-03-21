import Link from "next/link";
import type { CMSContent, Locale } from "@/lib/cms";

export function FinalCTA({ locale }: { cms: CMSContent; locale: Locale }) {
  return (
    <section className="bg-brand-600 px-6 py-24 text-center md:px-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
          {locale === "fr"
            ? "Prêt à transformer votre ville ?"
            : "Ready to transform your city?"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          {locale === "fr"
            ? "Rejoignez les villes qui construisent une gouvernance plus réactive avec CivicPulse."
            : "Join cities building smarter, more responsive governance with CivicPulse."}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/auth/register"
            className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-brand-600 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            {locale === "fr" ? "Demander une démo" : "Request a demo"}
          </Link>
          <Link
            href="mailto:hello@civicpulse.cm"
            className="rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:border-white"
          >
            {locale === "fr" ? "Nous contacter" : "Contact us"}
          </Link>
        </div>
      </div>
    </section>
  );
}