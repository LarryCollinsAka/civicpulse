"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export function CitizenProfile() {
  const { user, setUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName]       = useState(user?.full_name ?? "");
  const [lang, setLang]       = useState(user?.preferred_language ?? "fr");
  const [saving, setSaving]   = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await api.patch(`/users/${user?.id}`, {
        full_name: name,
        preferred_language: lang,
      });
      setUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-md">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          {user?.full_name?.[0] ?? "C"}
        </div>
        <div>
          <p className="font-semibold">{user?.full_name ?? "Citoyen"}</p>
          <p className="text-sm text-muted-foreground">{user?.email ?? user?.phone}</p>
          <span className="mt-1 inline-block rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
            Citoyen
          </span>
        </div>
      </div>

      {/* Profile form */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Informations personnelles</h3>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-brand-600 hover:underline"
          >
            {editing ? "Annuler" : "Modifier"}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Nom complet</label>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-600"
              />
            ) : (
              <p className="text-sm">{user?.full_name ?? "—"}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Email</label>
            <p className="text-sm">{user?.email ?? "—"}</p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Téléphone</label>
            <p className="text-sm">{user?.phone ?? "—"}</p>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Langue préférée</label>
            {editing ? (
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as "fr" | "en")}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-600"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            ) : (
              <p className="text-sm">{lang === "fr" ? "Français" : "English"}</p>
            )}
          </div>
        </div>

        {editing && (
          <button
            onClick={save}
            disabled={saving}
            className="w-full rounded-xl py-2 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            {saving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        )}
      </div>
    </div>
  );
}