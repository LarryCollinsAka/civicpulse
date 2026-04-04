"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { LanguageSwitcher } from "./LanguageSwitcher";
import {
  PhoneNumberInput,
  isValidPhoneNumber,
} from "@/components/ui/PhoneInput";
import { cn } from "@/lib/utils";

const t = {
  fr: {
    title: "Connexion Citoyen",
    subtitle: "Entrez votre numéro de téléphone",
    phone: "Numéro de téléphone",
    phonePh: "+237 6XX XXX XXX",
    sendOtp: "Envoyer le code",
    sending: "Envoi…",
    otpSent: "Code envoyé sur votre téléphone",
    otp: "Code de vérification",
    otpPh: "123456",
    verify: "Vérifier et se connecter",
    verifying: "Vérification…",
    resend: "Renvoyer le code",
    back: "Changer de numéro",
    backLogin: "Retour à la connexion",
    error: "Code incorrect. Réessayez.",
  },
  en: {
    title: "Citizen Login",
    subtitle: "Enter your phone number",
    phone: "Phone number",
    phonePh: "+237 6XX XXX XXX",
    sendOtp: "Send code",
    sending: "Sending…",
    otpSent: "Code sent to your phone",
    otp: "Verification code",
    otpPh: "123456",
    verify: "Verify and sign in",
    verifying: "Verifying…",
    resend: "Resend code",
    back: "Change number",
    backLogin: "Back to login",
    error: "Incorrect code. Please try again.",
  },
};

type Step = "phone" | "otp";

export function CitizenAuthForm() {
  const [locale, setLocale] = useState<"fr" | "en">("fr");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const i18n = t[locale];

  async function sendOTP() {
    if (!phone) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: phone.replace(/\s/g, ""),
      });
      if (err) throw err;
      setStep("otp");
    } catch (err: any) {
      setError(err.message ?? "Failed to send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP() {
    if (!otp) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data, error: err } = await supabase.auth.verifyOtp({
        phone: phone.replace(/\s/g, ""),
        token: otp,
        type: "sms",
      });
      if (err) throw err;

      // Exchange Supabase token for FastAPI JWT
      const res = await fetch("/api/auth/oauth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabase_access_token: data.session?.access_token,
          provider: "phone",
          phone: phone.replace(/\s/g, ""),
        }),
      });

      if (!res.ok) throw new Error("Auth failed");
      const authData = await res.json();
      setToken(authData.access_token);
      setUser(authData.user);
      router.push("/dashboard");
    } catch {
      setError(i18n.error);
    } finally {
      setLoading(false);
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

      {step === "phone" ? (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {i18n.phone}
            </label>
            <PhoneNumberInput
              value={phone}
              onChange={setPhone}
              defaultCountry="CM"
              error={!!error && !phone}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={sendOTP}
            disabled={loading || !phone}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            {loading ? i18n.sending : i18n.sendOtp}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            <a href="/auth/login" className="hover:text-brand-600">
              {i18n.backLogin}
            </a>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg bg-brand-50 px-4 py-3 text-sm text-brand-600">
            {i18n.otpSent} <strong>{phone}</strong>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              {i18n.otp}
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder={i18n.otpPh}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-center text-2xl font-mono tracking-widest outline-none focus:border-brand-600"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={verifyOTP}
            disabled={loading || otp.length < 6}
            className="w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            {loading ? i18n.verifying : i18n.verify}
          </button>

          <div className="flex justify-between text-xs text-muted-foreground">
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="hover:text-brand-600"
            >
              {i18n.back}
            </button>
            <button
              onClick={sendOTP}
              disabled={loading}
              className="hover:text-brand-600"
            >
              {i18n.resend}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
