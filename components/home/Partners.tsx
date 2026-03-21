import type { CMSPartner } from "@/lib/cms";

export function Partners({ items }: { items: CMSPartner[] }) {
  if (!items.length) return null;

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Ils nous font confiance
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {items.map((p) => (
            
              key={p.id}
              href={p.website ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
            >
              <img
                src={p.logo_url}
                alt={p.name}
                className="h-10 object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}