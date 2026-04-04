"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function CitizenTopBar() {
  const { user, logout } = useAuthStore();
  const router           = useRouter();

  function handleLogout() {
    logout();
    router.push("/auth/login");
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <span className="font-bold text-sm">CivicPulse</span>
      </div>

      <div className="hidden md:block" />

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Participation badge */}
        <div
          className="hidden rounded-full px-3 py-1 text-xs font-semibold text-white sm:block"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          Citoyen actif
        </div>

        {/* User avatar */}
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: "#1A6B4A" }}
          title="Déconnexion"
        >
          {user?.full_name?.[0] ?? "C"}
        </button>
      </div>
    </header>
  );
}