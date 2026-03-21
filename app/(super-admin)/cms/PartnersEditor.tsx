"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website: string | null;
  category: string;
  order: number;
  is_visible: boolean;
}

const EMPTY: Omit<Partner, "id"> = {
  name: "",
  logo_url: "",
  website: "",
  category: "partner",
  order: 0,
  is_visible: true,
};

const CATEGORIES = ["partner", "donor", "government", "media"];

export function PartnersEditor({ partners: initial }: { partners: Partner[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function toggleVisible(id: string, current: boolean) {
    await supabase
      .from("partners")
      .update({ is_visible: !current })
      .eq("id", id);
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_visible: !current } : p))
    );
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this partner?")) return;
    await supabase.from("partners").delete().eq("id", id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  async function saveEdit(id: string, data: Partial<Partner>) {
    setSaving(true);
    await supabase.from("partners").update(data).eq("id", id);
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    setEditing(null);
    setSaving(false);
  }

  async function addNew() {
    setSaving(true);
    const { data, error } = await supabase
      .from("partners")
      .insert(form)
      .select()
      .single();
    if (!error && data) {
      setItems((prev) => [...prev, data]);
      setForm(EMPTY);
      setAdding(false);
    }
    setSaving(false);
  }

  return (
    <div className="mt-4 space-y-3">
      {items.map((p) => (
        <div
          key={p.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          {editing === p.id ? (
            <PartnerForm
              initial={p}
              saving={saving}
              onSave={(data) => saveEdit(p.id, data)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="flex items-center gap-4">
              {p.logo_url && (
                <img
                  src={p.logo_url}
                  alt={p.name}
                  className="h-8 w-auto object-contain opacity-70"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">
                  {p.category} · order {p.order}
                  {p.website ? ` · ${p.website}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleVisible(p.id, p.is_visible)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    p.is_visible
                      ? "bg-brand-100 text-brand-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.is_visible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => setEditing(p.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(p.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
          <p className="mb-3 text-sm font-medium">New partner</p>
          <PartnerForm
            initial={EMPTY as Partner}
            saving={saving}
            onSave={async (data) => { setForm(data as typeof EMPTY); await addNew(); }}
            onCancel={() => { setAdding(false); setForm(EMPTY); }}
          />
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full rounded-lg border border-dashed border-border py-3 text-sm text-muted-foreground transition hover:border-brand-400 hover:text-brand-600"
        >
          + Add partner
        </button>
      )}
    </div>
  );
}

function PartnerForm({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: Partial<Partner>;
  saving: boolean;
  onSave: (data: Partial<Partner>) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState({ ...EMPTY, ...initial });
  const set = (k: string, v: string | number | boolean) =>
    setData((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Name</label>
          <input
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Category</label>
          <select
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Logo URL</label>
          <input
            value={data.logo_url}
            onChange={(e) => set("logo_url", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Website</label>
          <input
            value={data.website ?? ""}
            onChange={(e) => set("website", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Order</label>
          <input
            type="number"
            value={data.order}
            onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}