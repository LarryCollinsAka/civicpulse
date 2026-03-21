import Link from "next/link";
import type { Locale } from "@/lib/cms";

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = {
    fr: { tagline: "Construit pour les villes durables.", rights: "Tous droits réservés." },
    en: { tagline: "Built for sustainable cities.",       rights: "All rights reserved." },
  }[locale];

  return (
    <footer className="border-t border-border bg-card px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <span className="font-bold">CivicPulse</span>
            </div>
            <p className="text-xs text-muted-foreground">{t.tagline}</p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {locale === "fr" ? "Produit" : "Product"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
              <li><Link href="#pricing"  className="hover:text-foreground">{locale === "fr" ? "Tarifs" : "Pricing"}</Link></li>
              <li><Link href="/docs"     className="hover:text-foreground">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {locale === "fr" ? "Entreprise" : "Company"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about"   className="hover:text-foreground">{locale === "fr" ? "À propos" : "About"}</Link></li>
              <li><Link href="/blog"    className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {locale === "fr" ? "Légal" : "Legal"}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground">{locale === "fr" ? "Confidentialité" : "Privacy"}</Link></li>
              <li><Link href="/terms"   className="hover:text-foreground">{locale === "fr" ? "Conditions" : "Terms"}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} CivicPulse. {t.rights}
        </div>
      </div>
    </footer>
  );
}