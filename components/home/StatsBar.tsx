import type { CMSStat } from "@/lib/cms";

export function StatsBar({ stats }: { stats: CMSStat[] }) {
  return (
    <section className="border-y border-border bg-muted/40 px-6 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.key} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-brand-600">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}