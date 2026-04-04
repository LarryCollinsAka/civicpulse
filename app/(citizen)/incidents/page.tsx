import React from "react";
import type { Metadata } from "next";
import { CitizenIncidentsList } from "@/components/citizen/CitizenIncidentsList";

export const metadata: Metadata = { title: "Mes incidents — CivicPulse" };

export default function CitizenIncidentsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Mes incidents</h1>
      <CitizenIncidentsList />
    </div>
  );
}