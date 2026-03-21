import type { CMSTestimonial } from "@/lib/cms";

export function Testimonials({ items }: { items: CMSTestimonial[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-muted/30 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Ce que disent les villes
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                {t.avatar_url ? (
                  <img
                    src={t.avatar_url}
                    alt={t.author_name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
                    {t.author_name[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{t.author_name}</p>
                  {t.author_title && (
                    <p className="text-xs text-muted-foreground">
                      {t.author_title}{t.city_name ? `, ${t.city_name}` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}