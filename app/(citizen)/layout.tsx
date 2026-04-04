import React from "react";
import { CitizenSidebar } from "@/components/citizen/CitizenSidebar";
import { CitizenTopBar } from "@/components/citizen/CitizenTopBar";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      {/* Sidebar */}
      <CitizenSidebar />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <CitizenTopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}