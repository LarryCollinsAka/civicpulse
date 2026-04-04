import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import type { IncidentSeverity } from "@/types";

// ── shadcn/ui className merger ─────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date helpers ───────────────────────────────────────────────────────────
export function timeAgo(
  date: string | Date,
  lang: "fr" | "en" = "fr"
) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: lang === "fr" ? fr : enUS,
  });
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

// ── Incident severity colours (Tailwind classes) ───────────────────────────
export const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  low:      "bg-green-100  text-green-800",
  medium:   "bg-yellow-100 text-yellow-800",
  high:     "bg-orange-100 text-orange-800",
  critical: "bg-red-100    text-red-800",
};

// ── SDG colours and names ──────────────────────────────────────────────────
export const SDG_COLORS: Record<number, string> = {
  6:  "#26BDE2",
  11: "#FD9D24",
  13: "#3F7E44",
  15: "#56C02B",
  16: "#00689D",
  17: "#19486A",
};

export const SDG_NAMES: Record<number, string> = {
  6:  "Clean Water & Sanitation",
  11: "Sustainable Cities",
  13: "Climate Action",
  15: "Life on Land",
  16: "Peace & Justice",
  17: "Partnerships",
};

// ── SDG names in French ────────────────────────────────────────────────────
export const SDG_NAMES_FR: Record<number, string> = {
  6:  "Eau propre et assainissement",
  11: "Villes durables",
  13: "Action climatique",
  15: "Vie terrestre",
  16: "Paix et justice",
  17: "Partenariats",
};