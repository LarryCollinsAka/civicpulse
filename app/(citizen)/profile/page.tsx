import React from "react";
import type { Metadata } from "next";
import { CitizenProfile } from "@/components/citizen/CitizenProfile";

export const metadata: Metadata = { title: "Mon profil — CivicPulse" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Mon profil</h1>
      <CitizenProfile />
    </div>
  );
}