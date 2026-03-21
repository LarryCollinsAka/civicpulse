import type { CMSContent, Locale } from "@/lib/cms";

const SDGS = [
  { n: 6,  color: "#26BDE2", fr: "Eau propre et assainissement",  en: "Clean water & sanitation" },
  { n: 11, color: "#FD9D24", fr: "Villes durables",               en: "Sustainable cities" },
  { n: 13, color: "#3F7E44", fr: "Action climatique",             en: "Climate action" },
  { n: 15, color: "#56C02B", fr: "Vie terrestre",                 en: "Life on land" },
  { n: 16, color: "#00689D", fr: "Paix et justice",               en: "Peace & justice" },
  { n: 17, color: "#19486A", fr: "Partenariats",                  en: "Partnerships" },
];

export function SDGSection({ locale }: { cms: CMSContent; locale: Locale }) {
  return (
    <section className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {locale === "fr" ? "Construit pour l'agenda de la planète." : "Built for the planet's agenda."}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
          {locale === "fr"
            ? "Chaque incident résolu est lié à un indicateur ODD. Générez des rapports de progrès HLPF en un clic."
            : "Every resolved incident is linked to an SDG indicator. Generate HLPF progress reports in one click."}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {SDGS.map((sdg) => (
            <div
              key={sdg.n}
              className="flex flex-col items-center justify-center rounded-2xl p-6 text-center text-white"
              style={{ background: sdg.color }}
            >
              <span className="text-3xl font-black">{sdg.n}</span>
              <span className="mt-2 text-xs font-semibold leading-tight opacity-90">
                {locale === "fr" ? sdg.fr : sdg.en}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}