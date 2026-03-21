"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  quote_fr: string;
  quote_en: string;
  author_name: string;
  author_title: string | null;
  city_name: string | null;
  avatar_url: string | null;
  is_published: boolean;
  order: number;
}

const EMPTY: Omit<Testimonial, "id"> = {
  quote_fr: "",
  quote_en: "",
  author_name: "",
  author_title: "",
  city_name: "",
  avatar_url: "",
  is_published: false,
  order: 0,
};

export function TestimonialsEditor({
  testimonials: initial,
}: {
  testimonials: Testimonial[];
}) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function togglePublished(id: string, current: boolean) {
    await supabase
      .from("testimonials")
      .update({ is_published: !current })
      .eq("id", id);
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: !current } : t))
    );
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  async function saveEdit(id: string, data: Partial<Testimonial>) {
    setSaving(true);
    await supabase.from("testimonials").update(data).eq("id", id);
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    setEditing(null);
    setSaving(false);
  }

  async function addNew() {
    setSaving(true);
    const { data, error } = await supabase
      .from("testimonials")
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
      {items.map((t) => (
        <div
          key={t.id}
          className="rounded-lg border border-border bg-card p-4 space-y-3"
        >
          {editing === t.id ? (
            <EditForm
              initial={t}
              saving={saving}
              onSave={(data) => saveEdit(t.id, data)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.author_name}</p>
                {t.author_title && (
                  <p className="text-xs text-muted-foreground">{t.author_title}{t.city_name ? `, ${t.city_name}` : ""}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 italic">
                  &ldquo;{t.quote_fr}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublished(t.id, t.is_published)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    t.is_published
                      ? "bg-brand-100 text-brand-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.is_published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() => setEditing(t.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(t.id)}
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
          <p className="mb-3 text-sm font-medium">New testimonial</p>
          <EditForm
            initial={EMPTY as Testimonial}
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
          + Add testimonial
        </button>
      )}
    </div>
  );
}

function EditForm({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: Partial<Testimonial>;
  saving: boolean;
  onSave: (data: Partial<Testimonial>) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState({ ...EMPTY, ...initial });
  const set = (k: string, v: string | boolean) =>
    setData((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Author name" value={data.author_name} onChange={(v) => set("author_name", v)} />
        <Field label="Author title" value={data.author_title ?? ""} onChange={(v) => set("author_title", v)} />
        <Field label="City" value={data.city_name ?? ""} onChange={(v) => set("city_name", v)} />
        <Field label="Avatar URL" value={data.avatar_url ?? ""} onChange={(v) => set("avatar_url", v)} />
      </div>
      <TextArea label="Quote (FR)" value={data.quote_fr} onChange={(v) => set("quote_fr", v)} />
      <TextArea label="Quote (EN)" value={data.quote_en} onChange={(v) => set("quote_en", v)} />
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

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
      />
    </div>
  );
}