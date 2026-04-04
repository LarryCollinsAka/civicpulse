"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useCreateIncident } from "@/hooks/useIncidents";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "securite",       label: "Sécurité" },
  { value: "environnement",  label: "Environnement" },
  { value: "eau",            label: "Eau et assainissement" },
  { value: "transport",      label: "Transport" },
  { value: "autre",          label: "Autre" },
];

const SEVERITIES = [
  { value: "low",      label: "Faible",   color: "bg-green-100 text-green-700 border-green-200" },
  { value: "medium",   label: "Moyen",    color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "high",     label: "Élevé",    color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "critical", label: "Critique", color: "bg-red-100 text-red-700 border-red-200" },
];

const schema = z.object({
  title:       z.string().min(5, "Minimum 5 caractères"),
  description: z.string().min(20, "Minimum 20 caractères"),
  category:    z.string().min(1, "Sélectionnez une catégorie"),
  severity:    z.enum(["low", "medium", "high", "critical"]),
});
type FormData = z.infer<typeof schema>;

export function ReportForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useCreateIncident();
  const [selectedSeverity, setSelectedSeverity] = useState("medium");
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { severity: "medium" },
    });

  async function onSubmit(data: FormData) {
    try {
      await mutateAsync(data);
      setSuccess(true);
      setTimeout(() => router.push("/incidents"), 2000);
    } catch (err) {
      console.error(err);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <h3 className="font-semibold text-green-800">Incident signalé !</h3>
        <p className="mt-1 text-sm text-green-600">
          Notre IA va analyser votre signalement. Vous serez notifié des mises à jour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Titre</label>
        <input
          type="text"
          placeholder="Ex: Nid-de-poule dangereux rue de l'Hôpital"
          {...register("title")}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-600",
            errors.title ? "border-red-400" : "border-border"
          )}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Catégorie</label>
        <select
          {...register("category")}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-600"
        >
          <option value="">Sélectionner…</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* Severity */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Gravité</label>
        <div className="grid grid-cols-4 gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                setSelectedSeverity(s.value);
                setValue("severity", s.value as any);
              }}
              className={cn(
                "rounded-xl border py-2 text-xs font-semibold transition",
                selectedSeverity === s.value
                  ? s.color
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Description</label>
        <textarea
          rows={4}
          placeholder="Décrivez le problème en détail. Plus votre description est précise, plus vite il sera traité."
          {...register("description")}
          className={cn(
            "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-600 resize-none",
            errors.description ? "border-red-400" : "border-border"
          )}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>

      {/* Photo placeholder */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Photo <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          📷 Upload photo — coming soon
        </div>
      </div>

      {/* Location placeholder */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Localisation <span className="text-muted-foreground font-normal">(optionnel)</span>
        </label>
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
          📍 Map pin — coming soon
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60"
        style={{ backgroundColor: "#1A6B4A" }}
      >
        {isPending ? "Envoi en cours…" : "Soumettre le signalement"}
      </button>
    </form>
  );
}