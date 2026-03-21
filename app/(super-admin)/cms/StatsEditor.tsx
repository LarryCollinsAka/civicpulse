"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StatsEditor({ stats: initial }: { stats: any[] }) {
  const [stats, setStats] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const supabase = createClient();

  async function save(id: string, value: string) {
    await supabase.from("homepage_stats").update({ value }).eq("id", id);
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, value } : s)));
    setEditing(null);
  }

  return (
    <div className="mt-4 space-y-2">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex items-center gap-4 rounded-lg border border-border bg-card px-4 py-3"
        >
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{stat.label_fr} / {stat.label_en}</p>
            {editing === stat.id ? (
              <input
                autoFocus
                defaultValue={stat.value}
                className="mt-1 w-32 rounded border border-border px-2 py-1 text-sm font-mono"
                onBlur={(e) => save(stat.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save(stat.id, (e.target as HTMLInputElement).value)}
              />
            ) : (
              <p className="mt-0.5 font-mono text-lg font-bold text-brand-600">{stat.value}</p>
            )}
          </div>
          <button
            onClick={() => setEditing(editing === stat.id ? null : stat.id)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {editing === stat.id ? "Cancel" : "Edit"}
          </button>
        </div>
      ))}
    </div>
  );
}
