import { headers } from "next/headers";
import type { Locale } from "@/i18n/config";

// Read locale detected by middleware — call from Server Components
export async function getLocale(): Promise<Locale> {
  const headerStore = await headers();
  const locale = headerStore.get("x-locale");
  return (locale === "en" ? "en" : "fr") as Locale;
}