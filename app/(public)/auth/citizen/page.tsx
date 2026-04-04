import React from "react";
import { CitizenAuthForm } from "@/components/auth/CitizenAuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Connexion Citoyen — CivicPulse" };

export default function CitizenAuthPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div
        className="relative flex h-[35vh] flex-col items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#1A6B4A" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
            <div className="h-4 w-4 rounded-full bg-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Espace Citoyen</h1>
          <p className="text-sm text-white/70">
            Connectez-vous avec votre numéro de téléphone
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 42 1080 40C1200 38 1320 28 1380 23L1440 18V60H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-6 pt-8 pb-12">
        <div className="w-full max-w-sm">
          <CitizenAuthForm />
        </div>
      </div>
    </div>
  );
}