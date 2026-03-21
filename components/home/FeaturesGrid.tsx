import type { CMSContent, Locale } from "@/lib/cms";

const DEFAULT_FEATURES = {
  fr: [
    { icon: "🗺️", title: "Tableau de bord GIS en temps réel",     desc: "Carte interactive avec heatmaps de participation citoyenne par quartier." },
    { icon: "🚨", title: "Signalement intelligent",               desc: "Classification IA automatique, attribution au bon département, suivi de résolution." },
    { icon: "🤖", title: "Agent IA de gouvernance",               desc: "Alimenté par Claude. Répond aux questions, génère des rapports ODD, prédit les zones à risque." },
    { icon: "📲", title: "Canal WhatsApp citoyen",                desc: "Signalez via WhatsApp — sans télécharger une nouvelle application." },
    { icon: "🔐", title: "Contrôle d'accès par rôle",            desc: "Super admin, admin ville et citoyens — chacun voit ce qu'il doit voir." },
    { icon: "🌍", title: "Rapports ODD automatiques",            desc: "Chaque incident résolu est lié à un indicateur ODD. Rapports HLPF en un clic." },
  ],
  en: [
    { icon: "🗺️", title: "Real-time GIS dashboard",              desc: "Interactive map with citizen participation heatmaps by neighbourhood." },
    { icon: "🚨", title: "Smart incident reporting",             desc: "AI auto-classification, routed to the right department, resolution tracked." },
    { icon: "🤖", title: "AI governance agent",                  desc: "Powered by Claude. Answers questions, generates SDG reports, predicts hotspots." },
    { icon: "📲", title: "WhatsApp citizen channel",             desc: "Report via WhatsApp — no new app to download." },
    { icon: "🔐", title: "Role-based access control",            desc: "Super admin, city admin and citizens — everyone sees what they need." },
    { icon: "🌍", title: "Automatic SDG reports",               desc: "Every resolved incident linked to an SDG indicator. HLPF reports in one click." },
  ],
};

export function FeaturesGrid({ locale }: { cms: CMSContent; locale: Locale }) {
  const features = DEFAULT_FEATURES[locale];

  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {locale === "fr" ? "Tout ce dont votre ville a besoin." : "Everything your city needs."}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          {locale === "fr"
            ? "Du signalement de nid-de-poule aux analyses politiques — CivicPulse ferme la boucle."
            : "From pothole reports to policy analytics — CivicPulse closes the loop."}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-2xl">
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold leading-snug">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}