"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Tableau de bord", labelEn: "Dashboard",     icon: "⊞" },
  { href: "/report",    label: "Signaler",         labelEn: "Report",        icon: "＋" },
  { href: "/incidents", label: "Mes incidents",    labelEn: "My incidents",  icon: "◎" },
  { href: "/profile",   label: "Mon profil",       labelEn: "My profile",    icon: "◉" },
];

export function CitizenSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: "#1A6B4A" }}
        >
          <div className="h-2 w-2 rounded-full bg-white" />
        </div>
        <span className="font-bold text-sm">CivicPulse</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                active
                  ? "font-medium text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={active ? { backgroundColor: "#1A6B4A" } : {}}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <Link
          href="/auth/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted"
        >
          <span>→</span>
          Déconnexion
        </Link>
      </div>
    </aside>
  );
}