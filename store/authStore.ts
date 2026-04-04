import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  role: "super_admin" | "city_admin" | "citizen";
  city_id: string | null;
  preferred_language: "fr" | "en";
  is_verified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  tokenExpiry: number | null; // Unix timestamp ms
  isLoading: boolean;
  setUser:    (user: AuthUser | null) => void;
  setToken:   (token: string | null, expiresInMinutes?: number) => void;
  setLoading: (loading: boolean) => void;
  logout:     () => Promise<void>;
  isExpired:  () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,
      isLoading: false,

      setUser: (user) => set({ user }),

      setToken: (token, expiresInMinutes = 1440) => {
        const tokenExpiry = token
          ? Date.now() + expiresInMinutes * 60 * 1000
          : null;
        set({ token, tokenExpiry });
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: async () => {
        // 1. Sign out from Supabase (invalidates OAuth sessions)
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch {}

        // 2. Clear all persisted state
        set({ user: null, token: null, tokenExpiry: null });

        // 3. Wipe localStorage key entirely
        if (typeof window !== "undefined") {
          localStorage.removeItem("civicpulse-auth");
        }
      },

      isExpired: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return true;
        return Date.now() > tokenExpiry;
      },
    }),
    {
      name: "civicpulse-auth",
      partialize: (s) => ({
        token:       s.token,
        tokenExpiry: s.tokenExpiry,
        user:        s.user,
      }),
    }
  )
);