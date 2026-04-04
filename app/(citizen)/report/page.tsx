import React from "react";
import type { Metadata } from "next";
import { ReportForm } from "@/components/citizen/ReportForm";

export const metadata: Metadata = { title: "Signaler un incident — CivicPulse" };

export default function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Signaler un incident</h1>
        <p className="text-sm text-muted-foreground">
          Décrivez le problème et indiquez sa localisation.
        </p>
      </div>
      <ReportForm />
    </div>
  );
}