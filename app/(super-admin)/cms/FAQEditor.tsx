"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface FAQItem {
  id: string;
  question_fr: string;
  question_en: string;
  answer_fr: string;
  answer_en: string;
  category: string;
  order: number;
  is_published: boolean;
}

const EMPTY: Omit<FAQItem, "id"> = {
  question_fr: "",
  question_en: "",
  answer_fr: "",
  answer_en: "",
  category: "general",
  order: 0,
  is_published: true,
};

const CATEGORIES = ["general", "technical", "pricing", "government"];

export function FAQEditor({ faq: initial }: { faq: FAQItem[] }) {
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function togglePublished(id: string, current: boolean) {
    await supabase
      .from("faq_items")
      .update({ is_published: !current })
      .eq("id", id);
    setItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, is_published: !current } : f))
    );
  }

  async function deleteItem(id: string) {
    if (!confirm("Delete this FAQ item?")) return;
    await supabase.from("faq_items").delete().eq("id", id);
    setItems((prev) => prev.filter((f) => f.id !== id));
  }

  async function saveEdit(id: string, data: Partial<FAQItem>) {
    setSaving(true);
    await supabase.from("faq_items").update(data).eq("id", id);
    setItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
    setEditing(null);
    setSaving(false);
  }

  async function addNew() {
    setSaving(true);
    const { data, error } = await supabase
      .from("faq_items")
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
      {/* Category filter pills */}
      <div className="flex gap-2">
        {["all", ...CATEGORIES].map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-border px-3 py-1 text-xs capitalize text-muted-foreground"
          >
            {cat}
          </span>
        ))}
      </div>

      {items.map((f) => (
        <div
          key={f.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          {editing === f.id ? (
            <FAQForm
              initial={f}
              saving={saving}
              onSave={(data) => saveEdit(f.id, data)}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                    {f.category}
                  </span>
                  <span className="text-xs text-muted-foreground">#{f.order}</span>
                </div>
                <p className="text-sm font-medium">{f.question_fr}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.question_en}</p>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {f.answer_fr}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => togglePublished(f.id, f.is_published)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    f.is_published
                      ? "bg-brand-100 text-brand-700"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {f.is_published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() => setEditing(f.id)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(f.id)}
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
          <p className="mb-3 text-sm font-medium">New FAQ item</p>
          <FAQForm
            initial={EMPTY as FAQItem}
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
          + Add FAQ item
        </button>
      )}
    </div>
  );
}

function FAQForm({
  initial,
  saving,
  onSave,
  onCancel,
}: {
  initial: Partial<FAQItem>;
  saving: boolean;
  onSave: (data: Partial<FAQItem>) => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState({ ...EMPTY, ...initial });
  const set = (k: string, v: string | number | boolean) =>
    setData((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
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
          <label className="mb-1 block text-xs text-muted-foreground">Order</label>
          <input
            type="number"
            value={data.order}
            onChange={(e) => set("order", parseInt(e.target.value) || 0)}
            className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Question (FR)</label>
        <input
          value={data.question_fr}
          onChange={(e) => set("question_fr", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Question (EN)</label>
        <input
          value={data.question_en}
          onChange={(e) => set("question_en", e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Answer (FR)</label>
        <textarea
          value={data.answer_fr}
          onChange={(e) => set("answer_fr", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">Answer (EN)</label>
        <textarea
          value={data.answer_en}
          onChange={(e) => set("answer_en", e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-brand-400"
        />
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