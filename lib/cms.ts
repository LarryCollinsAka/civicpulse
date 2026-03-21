import { createClient } from "./supabase/server";

export type Locale = "fr" | "en";

export interface CMSContent {
  sections:     Record<string, boolean>;          // slug → is_visible
  content:      Record<string, Record<string, string>>; // section.key → value
  stats:        CMSStat[];
  testimonials: CMSTestimonial[];
  partners:     CMSPartner[];
  faq:          CMSFaqItem[];
}

export interface CMSStat {
  key:      string;
  label:    string;
  value:    string;
  order:    number;
}

export interface CMSTestimonial {
  id:           string;
  quote:        string;
  author_name:  string;
  author_title: string | null;
  city_name:    string | null;
  avatar_url:   string | null;
}

export interface CMSPartner {
  id:       string;
  name:     string;
  logo_url: string;
  website:  string | null;
  category: string;
  order:    number;
}

export interface CMSFaqItem {
  id:       string;
  question: string;
  answer:   string;
  category: string;
  order:    number;
}

export async function getCMSContent(locale: Locale = "fr"): Promise<CMSContent> {
  const supabase = await createClient();

  const [
    { data: sections },
    { data: contentRows },
    { data: stats },
    { data: testimonials },
    { data: partners },
    { data: faq },
  ] = await Promise.all([
    supabase
      .from("homepage_sections")
      .select("slug, is_visible")
      .order("order"),

    supabase
      .from("homepage_content")
      .select("section_slug, key, value")
      .eq("locale", locale),

    supabase
      .from("homepage_stats")
      .select("key, label_fr, label_en, value, order")
      .eq("is_visible", true)
      .order("order"),

    supabase
      .from("testimonials")
      .select("id, quote_fr, quote_en, author_name, author_title, city_name, avatar_url")
      .eq("is_published", true)
      .order("order"),

    supabase
      .from("partners")
      .select("id, name, logo_url, website, category, order")
      .eq("is_visible", true)
      .order("order"),

    supabase
      .from("faq_items")
      .select("id, question_fr, question_en, answer_fr, answer_en, category, order")
      .eq("is_published", true)
      .order("order"),
  ]);

  // Build section visibility map
  const sectionMap: Record<string, boolean> = {};
  for (const s of sections ?? []) {
    sectionMap[s.slug] = s.is_visible;
  }

  // Build nested content map: content["hero"]["headline"] = "..."
  const contentMap: Record<string, Record<string, string>> = {};
  for (const row of contentRows ?? []) {
    if (!contentMap[row.section_slug]) contentMap[row.section_slug] = {};
    contentMap[row.section_slug][row.key] = row.value;
  }

  return {
    sections: sectionMap,
    content:  contentMap,

    stats: (stats ?? []).map((s) => ({
      key:   s.key,
      label: locale === "fr" ? s.label_fr : s.label_en,
      value: s.value,
      order: s.order,
    })),

    testimonials: (testimonials ?? []).map((t) => ({
      id:           t.id,
      quote:        locale === "fr" ? t.quote_fr : t.quote_en,
      author_name:  t.author_name,
      author_title: t.author_title,
      city_name:    t.city_name,
      avatar_url:   t.avatar_url,
    })),

    partners: partners ?? [],

    faq: (faq ?? []).map((f) => ({
      id:       f.id,
      question: locale === "fr" ? f.question_fr : f.question_en,
      answer:   locale === "fr" ? f.answer_fr   : f.answer_en,
      category: f.category,
      order:    f.order,
    })),
  };
}