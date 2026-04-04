"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Exchange Supabase session for our FastAPI JWT
        try {
          const res = await fetch("/api/auth/oauth/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              supabase_access_token: session.access_token,
              provider: session.user.app_metadata.provider,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            setToken(data.access_token);
            setUser(data.user);

            // Redirect based on role
            const role = data.user.role;
            if (role === "super_admin") router.push("/platform");
            else if (role === "city_admin") router.push("/map");
            else router.push("/dashboard");
          }
        } catch (err) {
          router.push("/auth/login?error=oauth_failed");
        }
      }
    });
  }, [router, setUser, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
          style={{ borderColor: "#1A6B4A", borderTopColor: "transparent" }}
        />
        <p className="text-sm text-muted-foreground">
          Connexion en cours…
        </p>
      </div>
    </div>
  );
}