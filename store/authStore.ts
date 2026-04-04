import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      setUser:    (user)      => set({ user }),
      setToken:   (token)     => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "civicpulse-auth",
      // Only persist the token — user is re-fetched on load
      partialize: (s) => ({ token: s.token }),
    }
  )
);