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
  email:    z.string().email(),
  password: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

const t = {
  fr: {
    title:       "Bon retour",
    subtitle:    "Connectez-vous à votre compte",
    email:       "Adresse email",
    password:    "Mot de passe",
    forgot:      "Mot de passe oublié ?",
    submit:      "Se connecter",
    loading:     "Connexion…",
    noAccount:   "Pas encore de compte ?",
    register:    "S'inscrire",
    citizen:     "Connexion citoyen (téléphone)",
    error:       "Email ou mot de passe incorrect",
  },
  en: {
    title:       "Welcome back",
    subtitle:    "Sign in to your account",
    email:       "Email address",
    password:    "Password",
    forgot:      "Forgot password?",
    submit:      "Sign in",
    loading:     "Signing in…",
    noAccount:   "Don't have an account?",
    register:    "Register",
    citizen:     "Citizen login (phone)",
    error:       "Invalid email or password",
  },
};

export function LoginForm() {
  const [locale, setLocale]   = useState<"fr" | "en">("fr");
  const [error, setError]     = useState("");
  const router                = useRouter();
  const { setUser, setToken } = useAuthStore();
  const i18n                  = t[locale];

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setError("");
    try {
      const res = await api.post("/auth/login", data);
      setToken(res.data.access_token);
      setUser(res.data.user);

      const role = res.data.user.role;
      if (role === "super_admin")  router.push("/platform");
      else if (role === "city_admin") router.push("/map");
      else router.push("/dashboard");
    } catch {
      setError(i18n.error);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{i18n.title}</h2>
          <p className="text-sm text-muted-foreground">{i18n.subtitle}</p>
        </div>
        <LanguageSwitcher locale={locale} onChange={setLocale} />
      </div>

      {/* Social buttons */}
      <SocialButtons locale={locale} />

      {/* Email + password form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {i18n.email}
          </label>
          <input
            type="email"
            autoComplete="email"
            {...register("email")}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-600",
              errors.email ? "border-red-400" : "border-border"
            )}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium">{i18n.password}</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-brand-600 hover:underline"
            >
              {i18n.forgot}
            </Link>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={cn(
              "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-brand-600",
              errors.password ? "border-red-400" : "border-border"
            )}
          />
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

      {/* Footer links */}
      <div className="space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          {i18n.noAccount}{" "}
          <Link href="/auth/register" className="font-medium text-brand-600 hover:underline">
            {i18n.register}
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