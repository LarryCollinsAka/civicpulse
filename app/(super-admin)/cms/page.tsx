import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CMSDashboard } from "./CMSDashboard";

export const metadata: Metadata = { title: "CMS — Homepage" };

export default async function CMSPage() {
  const supabase = await createClient();

  const [
    { data: sections },
    { data: stats },
    { data: testimonials },
    { data: partners },
    { data: faq },
  ] = await Promise.all([
    supabase.from("homepage_sections").select("*").order("order"),
    supabase.from("homepage_stats").select("*").order("order"),
    supabase.from("testimonials").select("*").order("order"),
    supabase.from("partners").select("*").order("order"),
    supabase.from("faq_items").select("*").order("order"),
  ]);

  return (
    <CMSDashboard
      sections={sections ?? []}
      stats={stats ?? []}
      testimonials={testimonials ?? []}
      partners={partners ?? []}
      faq={faq ?? []}
    />
  );
}