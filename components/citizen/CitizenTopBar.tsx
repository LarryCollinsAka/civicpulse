"use client";

import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export function CitizenTopBar() {
  const { user, logout } = useAuthStore();
  const router           = useRouter();
  const { t }            = useI18n();
  const [loggingOut, setLoggingOut] = React.useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await logout();          // clears Zustand + localStorage + Supabase session
    router.push("/auth/login");
    router.refresh();        // force Next.js to re-render server components
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: "#1A6B4A" }}>
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <span className="font-bold text-sm">CivicPulse</span>
      </div>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <div
          className="hidden rounded-full px-3 py-1 text-xs font-semibold text-white sm:block"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          {t("citizen.active")}
        </div>

        {/* User menu */}
        <div className="relative group">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            {user?.full_name?.[0] ?? "C"}
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-9 hidden w-40 rounded-xl border border-border bg-background shadow-lg group-focus-within:block">
            <div className="border-b border-border px-4 py-2">
              <p className="text-xs font-medium truncate">{user?.full_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? user?.phone}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-b-xl"
            >
              {loggingOut ? t("auth.loggingOut") : t("auth.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}