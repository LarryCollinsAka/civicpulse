import fr from "./fr.json";
import en from "./en.json";

export type Locale = "fr" | "en";
export type TranslationKey = string; // dot-notation e.g. "auth.login"

const translations = { fr, en };

// Resolve a dot-notation key like "auth.login" → "Se connecter"
export function translate(locale: Locale, key: string): string {
  const parts  = key.split(".");
  let   result = translations[locale] as Record<string, any>;

  for (const part of parts) {
    if (result && typeof result === "object" && part in result) {
      result = result[part];
    } else {
      // Fallback to French if key missing in English
      let fallback = translations["fr"] as Record<string, any>;
      for (const p of parts) {
        fallback = fallback?.[p];
      }
      return typeof fallback === "string" ? fallback : key;
    }
  }

  return typeof result === "string" ? result : key;
}