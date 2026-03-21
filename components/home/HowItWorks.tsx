import type { CMSContent, Locale } from "@/lib/cms";

const STEPS = {
  fr: [
    { n: "01", title: "Le citoyen signale",        desc: "Via WhatsApp, le web ou l'application. Photo, description, localisation GPS." },
    { n: "02", title: "L'IA classe et route",      desc: "Claude catégorise l'incident, évalue la gravité et l'assigne au bon département en secondes." },
    { n: "03", title: "La ville résout",           desc: "L'admin reçoit une alerte, assigne un technicien, met à jour le statut. Le citoyen est notifié à chaque étape." },
  ],
  en: [
    { n: "01", title: "Citizen reports",           desc: "Via WhatsApp, web, or app. Photo, description, GPS location." },
    { n: "02", title: "AI classifies and routes",  desc: "Claude categorises the incident, assesses severity and assigns it to the right department in seconds." },
    { n: "03", title: "City resolves",             desc: "Admin receives an alert, assigns a technician, updates the status. Citizen notified at every step." },
  ],
};

export function HowItWorks({ locale }: { cms: CMSContent; locale: Locale }) {
  const steps = STEPS[locale];

  return (
    <section id="how-it-works" className="bg-muted/30 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          {locale === "fr" ? "Comment ça marche ?" : "How it works"}
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative flex flex-col items-start gap-4">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-12 hidden h-px w-[calc(100%+2rem)] bg-border md:block" />
              )}
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {step.n}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}