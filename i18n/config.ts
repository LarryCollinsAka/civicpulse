export const locales    = ["fr", "en"] as const;
export const defaultLocale = "fr"      as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export const localeFlags: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
};