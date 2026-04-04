"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { translate, type Locale } from "./index";
import { useAuthStore } from "@/store/authStore";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "fr";
    // Priority: user profile > localStorage > browser
    const stored = localStorage.getItem("civicpulse-locale") as Locale | null;
    return stored ?? "fr";
  });

  // When user profile loads/changes, sync their preferred language
  useEffect(() => {
    if (user?.preferred_language) {
      setLocaleState(user.preferred_language as Locale);
      localStorage.setItem("civicpulse-locale", user.preferred_language);
      document.cookie = `NEXT_LOCALE=${user.preferred_language};path=/;max-age=31536000`;
    }
  }, [user?.preferred_language]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("civicpulse-locale", l);
    document.cookie = `NEXT_LOCALE=${l};path=/;max-age=31536000`;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let result = translate(locale, key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{{${k}}}`, String(v));
        });
      }
      return result;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}