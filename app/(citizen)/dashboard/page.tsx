import React from "react";
import type { Metadata } from "next";
import { CitizenDashboardHome } from "@/components/citizen/CitizenDashboardHome";

export const metadata: Metadata = { title: "Tableau de bord — CivicPulse" };

export default function CitizenDashboardPage() {
  return <CitizenDashboardHome />;
}