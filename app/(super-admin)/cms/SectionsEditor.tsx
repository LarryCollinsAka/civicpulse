"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SectionsEditor({ sections: initial }: { sections: any[] }) {
  const [sections, setSections] = useState(initial);
  const [pending, startTransition] = useTransition();
  const supabase = createClient();

  async function toggle(id: string, current: boolean) {
    await supabase
      .from("homepage_sections")
      .update({ is_visible: !current })
      .eq("id", id);

    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_visible: !current } : s))
    );
  }

  return (
    <div className="mt-4 space-y-2">
      {sections.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
        >
          <div>
            <p className="text-sm font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground font-mono">{s.slug}</p>
          </div>
          <button
            onClick={() => toggle(s.id, s.is_visible)}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              s.is_visible
                ? "bg-brand-100 text-brand-700 hover:bg-red-100 hover:text-red-700"
                : "bg-muted text-muted-foreground hover:bg-brand-100 hover:text-brand-700"
            }`}
          >
            {s.is_visible ? "Visible" : "Hidden"}
          </button>
        </div>
      ))}
    </div>
  );
}