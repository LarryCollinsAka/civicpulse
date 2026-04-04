"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useIncidents } from "@/hooks/useIncidents";
import { SEVERITY_COLORS } from "@/lib/utils";
import type { IncidentStatus, IncidentSeverity } from "@/types";

const STATUS_LABELS: Record<IncidentStatus, { fr: string; color: string }> = {
  open:        { fr: "Ouvert",   color: "bg-blue-100 text-blue-700" },
  assigned:    { fr: "Assigné",  color: "bg-yellow-100 text-yellow-700" },
  in_progress: { fr: "En cours", color: "bg-orange-100 text-orange-700" },
  resolved:    { fr: "Résolu",   color: "bg-green-100 text-green-700" },
  closed:      { fr: "Clôturé",  color: "bg-gray-100 text-gray-600" },
};

const FILTERS: { value: "" | IncidentStatus; label: string }[] = [
  { value: "",            label: "Tous" },
  { value: "open",        label: "Ouverts" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved",    label: "Résolus" },
];

export function CitizenIncidentsList() {
  const [status, setStatus] = useState<"" | IncidentStatus>("");
  const { data, isLoading } = useIncidents(status ? { status } : {});
  const incidents = data?.items ?? [];

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className="rounded-full border px-4 py-1.5 text-xs font-semibold transition"
            style={
              status === f.value
                ? { backgroundColor: "#1A6B4A", color: "#fff", borderColor: "#1A6B4A" }
                : {}
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Aucun incident trouvé.</p>
          <Link
            href="/report"
            className="mt-3 inline-block rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            Faire un signalement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="rounded-xl border border-border bg-card p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{incident.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {incident.category} ·{" "}
                    {new Date(incident.created_at).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "long", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      SEVERITY_COLORS[incident.severity as IncidentSeverity]
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      STATUS_LABELS[incident.status as IncidentStatus].color
                    }`}
                  >
                    {STATUS_LABELS[incident.status as IncidentStatus].fr}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    backgroundColor: "#1A6B4A",
                    width: {
                      open:        "10%",
                      assigned:    "30%",
                      in_progress: "60%",
                      resolved:    "100%",
                      closed:      "100%",
                    }[incident.status as IncidentStatus],
                  }}
                />
              </div>

              {incident.ai_summary && (
                <p className="text-xs text-muted-foreground italic border-l-2 border-brand-200 pl-2">
                  IA: {incident.ai_summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}