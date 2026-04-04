"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useIncidents } from "@/hooks/useIncidents";
import { SEVERITY_COLORS } from "@/lib/utils";
import type { IncidentStatus, IncidentSeverity } from "@/types";

const STATUS_LABELS: Record<IncidentStatus, { fr: string; color: string }> = {
  open:        { fr: "Ouvert",       color: "bg-blue-100 text-blue-700" },
  assigned:    { fr: "Assigné",      color: "bg-yellow-100 text-yellow-700" },
  in_progress: { fr: "En cours",     color: "bg-orange-100 text-orange-700" },
  resolved:    { fr: "Résolu",       color: "bg-green-100 text-green-700" },
  closed:      { fr: "Clôturé",      color: "bg-gray-100 text-gray-600" },
};

export function CitizenDashboardHome() {
  const { user }       = useAuthStore();
  const { data, isLoading } = useIncidents({}, 1);
  const incidents      = data?.items ?? [];

  const stats = {
    total:    incidents.length,
    resolved: incidents.filter((i) => i.status === "resolved" || i.status === "closed").length,
    open:     incidents.filter((i) => i.status === "open").length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Bonjour, {user?.full_name?.split(" ")[0] ?? "Citoyen"} 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Bienvenue sur votre espace citoyen CivicPulse
          </p>
        </div>
        <Link
          href="/report"
          className="rounded-full px-4 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          + Signaler
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total signalements", value: stats.total,    color: "#1A6B4A" },
          { label: "En cours",           value: stats.open,     color: "#BA7517" },
          { label: "Résolus",            value: stats.resolved, color: "#0F6E56" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            <p
              className="text-3xl font-black"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Participation score */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{ backgroundColor: "#1A6B4A" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">
              Indice de participation citoyenne
            </p>
            <p className="mt-1 text-4xl font-black">
              {Math.min(100, stats.total * 10)}
              <span className="text-lg opacity-70">/100</span>
            </p>
          </div>
          <div className="text-5xl opacity-20">◎</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/20">
          <div
            className="h-2 rounded-full bg-white transition-all"
            style={{ width: `${Math.min(100, stats.total * 10)}%` }}
          />
        </div>
        <p className="mt-2 text-xs opacity-70">
          Signalez plus d'incidents pour augmenter votre score
        </p>
      </div>

      {/* Recent incidents */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Mes signalements récents</h2>
          <Link href="/incidents" className="text-xs text-brand-600 hover:underline">
            Voir tout
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : incidents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Aucun signalement pour l'instant.
            </p>
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
            {incidents.slice(0, 5).map((incident) => (
              <div
                key={incident.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{incident.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {incident.category} ·{" "}
                    {new Date(incident.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}