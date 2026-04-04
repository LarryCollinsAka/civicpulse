import React from "react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div
            className="absolute inset-0 rounded-2xl opacity-20 animate-ping"
            style={{ backgroundColor: "#1A6B4A" }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "#1A6B4A" }}
          >
            <div className="h-5 w-5 rounded-full bg-white" />
          </div>
        </div>

        {/* Brand name */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold tracking-tight">CivicPulse</p>
          <p className="text-xs text-muted-foreground">Chargement…</p>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-48 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full animate-pulse"
            style={{ backgroundColor: "#1A6B4A", width: "60%" }}
          />
        </div>
      </div>
    </div>
  );
}