"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { SocialButtons } from "./SocialButtons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

const schema = z.object({
  full_name:          z.string().min(2, "Required"),
  email:              z.string().email(),
  password:           z.string().min(8, "Minimum 8 characters"),
  preferred_language: z.enum(["fr", "en"]),
});
type FormData = z.infer<typeof schema>;

const t = {
  fr: {
    title:     "Créer un compte",
    subtitle:  "Rejoignez CivicPulse",
    name:      "Nom complet",
    email:     "Adresse email",
    password:  "Mot de passe",
    pwHint:    "Minimum 8 caractères",
    language:  "Langue préférée",
    submit:    "Créer mon compte",
    loading:   "Création…",
    hasAccount:"Déjà un compte ?",
    login:     "Se connecter",
    citizen:   "Inscription citoyen (téléphone)",
  },
  en: {
    title:     "Create account",
    subtitle:  "Join CivicPulse",
    name:      "Full name",
    email:     "Email address",
    password:  "Password",
    pwHint:    "Minimum 8 characters",
    language:  "Preferred language",
    submit:    "Create account",
    loading:   "Creating…",
    hasAccount:"Already have an account?",
    login:     "Sign in",
    citizen:   "Citizen registration (phone)",
  },
};

export function RegisterForm() {
  const [locale, setLocale]   = useState<"fr" | "en">("fr");
  const [error, setError]     = useState("");
  const router                = useRouter();
  const { setUser, setToken } = useAuthStore();
  const i18n                  = t[locale];

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { preferred_language: "fr" },
    });

  async function onSubmit(data: FormData) {
    setError("");
    try {
      const res = await api.post("/auth/register", {
        ...data,
        role: "citizen",
      });
      setToken(res.data.access_token);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Registration failed");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{i18n.title}</h2>
          <p className="text-sm text-muted-foreground">{i18n.subtitle}</p>
        </div>
        <LanguageSwitcher locale={locale} onChange={setLocale} />
      </div>

      <SocialButtons locale={locale} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{i18n.name}</label>
          <input
            type="text"
            autoComplete="name"
            {...register("full_name")}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-600",
              errors.full_name ? "border-red-400" : "border-border"
            )}
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{i18n.email}</label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-600",
              errors.email ? "border-red-400" : "border-border"
            )}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{i18n.password}</label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-600",
              errors.password ? "border-red-400" : "border-border"
            )}
          />
          <p className="mt-1 text-xs text-muted-foreground">{i18n.pwHint}</p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{i18n.language}</label>
          <select
            {...register("preferred_language")}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-brand-600"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          {isSubmitting ? i18n.loading : i18n.submit}
        </button>
      </form>

      <div className="space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          {i18n.hasAccount}{" "}
          <Link href="/auth/login" className="font-medium text-brand-600 hover:underline">
            {i18n.login}
          </Link>
        </p>
        <Link
          href="/auth/citizen"
          className="block text-xs text-muted-foreground hover:text-brand-600"
        >
          {i18n.citizen}
        </Link>
      </div>
    </div>
  );
}